import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { createMemoryHistory } from "history";
import { SignUp } from "./SignUp";
import { mockAccount } from "../../api/account";
import { ApiHost } from "../../constants/urls";
import { routes } from "../../constants/routes";
import { PersistKeys } from "../../constants/persistKeys";

test("should match snapshot", () => {
  const { container } = render(<SignUp />, { wrapper: BrowserRouter });
  // eslint-disable-next-line testing-library/no-node-access
  expect(container.firstChild).toMatchSnapshot();
});

describe("Sign up page", () => {
  const server = setupServer(
    rest.post(`${ApiHost}/sign_up`, (req, res, ctx) => {
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

  test("should validation error", async () => {
    render(<SignUp />, { wrapper: BrowserRouter });
    userEvent.click(screen.getByText("新規登録"));
    expect(
      await screen.findByText("パスワードを入力してください")
    ).toBeInTheDocument();
  });

  test("should validation error when password not match with confirmationPassword", async () => {
    render(<SignUp />, { wrapper: BrowserRouter });
    userEvent.type(screen.getByPlaceholderText("パスワード"), "password");
    userEvent.type(screen.getByPlaceholderText("パスワード(確認用)"), "test");
    userEvent.click(screen.getByText("新規登録"));
    expect(
      await screen.findByText("パスワードが一致していません")
    ).toBeInTheDocument();
  });

  test("should sign up", async () => {
    const history = createMemoryHistory();
    history.push(`${routes.signUp()}?token=testTokne`);
    render(
      <Router location={history.location} navigator={history}>
        <SignUp />
      </Router>
    );
    userEvent.type(screen.getByPlaceholderText("パスワード"), "password");
    userEvent.type(
      screen.getByPlaceholderText("パスワード(確認用)"),
      "password"
    );
    userEvent.click(screen.getByText("新規登録"));
    await waitFor(() =>
      expect(history.location.pathname).toBe(routes.managements())
    );
    await waitFor(() =>
      expect(localStorage.getItem(PersistKeys.AuthToken)).toBe("token")
    );
  });
});
