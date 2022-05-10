import {render, screen, waitFor} from "@testing-library/react";
import {Router} from "react-router-dom";
import userEvent from "@testing-library/user-event";
import {setupServer} from "msw/node";
import {rest} from "msw";
import {createMemoryHistory} from "history";
import {mockAccount} from "api/account";
import {ApiHost} from "constants/urls";
import {routes} from "constants/routes";
import {PersistKeys} from "constants/persistKeys";
import {QueryClient, QueryClientProvider} from "react-query";
import {ReactNode} from "react";
import {SignUp} from "./SignUp";

const history = createMemoryHistory();
const queryClient = new QueryClient();

const wrapper = ({children}: {children: ReactNode}) =>  (
  <QueryClientProvider client={queryClient}>
    <Router location={history.location} navigator={history}>
      {children}
    </Router>
  </QueryClientProvider>
)

test("should match snapshot", () => {
  const { container } = render(<SignUp />, { wrapper });
  // eslint-disable-next-line testing-library/no-node-access
  expect(container.firstChild).toMatchSnapshot();
});

describe("Sign up page", () => {
  const account = mockAccount()
  const server = setupServer(
    rest.post(`${ApiHost}/sign_up`, (req, res, ctx) => {
      return res(
        ctx.json({
          account,
          token: "token",
        })
      );
    })
  );

  server.use(
    rest.get(`${ApiHost}/accounts/${account.id}`, (req, res, ctx) => {
      return res(
        ctx.json(account)
      )
    })
  )

  beforeAll(() => {
    server.listen();
  });
  afterAll(() => {
    server.close();
  });

  test("should validation error", async () => {
    render(
      <SignUp />,{wrapper}
    );
    userEvent.click(screen.getByText("新規登録"));
    expect(
      await screen.findByText("パスワードを入力してください")
    ).toBeInTheDocument();
  });

  test("should validation error when password not match with confirmationPassword", async () => {
    render(
      <SignUp />,{wrapper}
    );
    userEvent.type(screen.getByPlaceholderText("パスワード"), "password");
    userEvent.type(screen.getByPlaceholderText("パスワード(確認用)"), "test");
    userEvent.click(screen.getByText("新規登録"));
    expect(
      await screen.findByText("パスワードが一致していません")
    ).toBeInTheDocument();
  });

  test("should not sign up", async () => {
    render(
      <SignUp />,{wrapper}
    );
    userEvent.type(screen.getByPlaceholderText("パスワード"), "password");
    userEvent.type(
      screen.getByPlaceholderText("パスワード(確認用)"),
      "password"
    );
    userEvent.click(screen.getByText("新規登録"));
    await waitFor(() =>
      screen.findByText("招待リンクからのみ新規登録を行うことができます")
    );
    expect(
      screen.getByText("招待リンクからのみ新規登録を行うことができます")
    ).toBeInTheDocument();
  });

  test("should sign up", async () => {
    history.push(`${routes.signUp()}?token=token`);
    render(
      <SignUp />,{wrapper}
    );
    userEvent.type(screen.getByPlaceholderText("パスワード"), "password");
    userEvent.type(
      screen.getByPlaceholderText("パスワード(確認用)"),
      "password"
    );
    userEvent.click(screen.getByText("新規登録"));
    await waitFor(() =>
      expect(localStorage.getItem(PersistKeys.AuthToken)).toBe("token")
    );
    await waitFor(() =>
      expect(history.location.pathname).toBe(routes.managements())
    );
  });
});
