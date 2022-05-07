import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { createMemoryHistory } from "history";
import { ApiHost } from "constants/urls";
import { mockAccount } from "api/account";
import { routes } from "constants/routes";
import { PersistKeys } from "constants/persistKeys";
import { Login } from "./Login";

it("should match snapshot", () => {
  const { container } = render(<Login />, { wrapper: BrowserRouter });

  // eslint-disable-next-line testing-library/no-node-access
  expect(container.firstChild).toMatchSnapshot();
});

describe("Login", () => {
  const server = setupServer(
    rest.post(`${ApiHost}/login`, (req, res, ctx) => {
      return res(
        ctx.json({
          account: mockAccount(),
          token: "token",
        })
      );
    })
  );

  beforeAll(() => {
    server.listen();
  });
  afterAll(() => {
    server.close();
  });

  it("should validation error", async () => {
    render(<Login />, { wrapper: BrowserRouter });
    userEvent.click(screen.getByText("ログイン"));
    expect(
      await screen.findByText("メールアドレスを入力してください")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("パスワードを入力してください")
    ).toBeInTheDocument();
  });

  it("should validation error when type wrong email", async () => {
    render(<Login />, { wrapper: BrowserRouter });
    userEvent.type(screen.getByPlaceholderText("メールアドレス"), "test");
    userEvent.click(screen.getByText("ログイン"));
    expect(
      await screen.findByText("正しいメールアドレスを入力してください")
    ).toBeInTheDocument();
  });
  it("should login", async () => {
    const history = createMemoryHistory();
    history.push(routes.login());
    render(
      <Router location={history.location} navigator={history}>
        <Login />
      </Router>
    );
    userEvent.type(
      screen.getByPlaceholderText("メールアドレス"),
      "test@test.com"
    );
    userEvent.type(screen.getByPlaceholderText("パスワード"), "password");
    userEvent.click(screen.getByText("ログイン"));
    await waitFor(() =>
      expect(history.location.pathname).toBe(routes.managements())
    );
    await waitFor(() =>
      expect(localStorage.getItem(PersistKeys.AuthToken)).toBe("token")
    );
  });
});
