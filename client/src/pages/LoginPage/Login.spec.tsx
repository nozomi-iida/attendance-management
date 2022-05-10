import {render, screen, waitFor} from "@testing-library/react";
import {Router} from "react-router-dom";
import userEvent from "@testing-library/user-event";
import {setupServer} from "msw/node";
import {rest} from "msw";
import {createMemoryHistory} from "history";
import {ApiHost} from "constants/urls";
import {mockAccount} from "api/account";
import {routes} from "constants/routes";
import {PersistKeys} from "constants/persistKeys";
import {QueryClient, QueryClientProvider} from "react-query";
import {ReactNode} from "react";
import {Login} from "./Login";

const history = createMemoryHistory();
const queryClient = new QueryClient();

const wrapper = ({children}: {children: ReactNode}) =>  (
  <QueryClientProvider client={queryClient}>
    <Router location={history.location} navigator={history}>
      {children}
    </Router>
  </QueryClientProvider>
)

it("should match snapshot", () => {
  const { container } = render(<Login />, { wrapper });

  // eslint-disable-next-line testing-library/no-node-access
  expect(container.firstChild).toMatchSnapshot();
});

describe("Login", () => {
  const account = mockAccount()
  const server = setupServer(
    rest.post(`${ApiHost}/login`, (req, res, ctx) => {
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

  beforeEach(() => {
    history.push(routes.login());
    render(
          <Login />,{wrapper}
    );
  });

  it("should validation error", async () => {
    userEvent.click(screen.getByText("ログイン"));
    expect(
      await screen.findByText("メールアドレスを入力してください")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("パスワードを入力してください")
    ).toBeInTheDocument();
  });

  it("should validation error when type wrong email", async () => {
    userEvent.type(screen.getByPlaceholderText("メールアドレス"), "test");
    userEvent.click(screen.getByText("ログイン"));
    expect(
      await screen.findByText("正しいメールアドレスを入力してください")
    ).toBeInTheDocument();
  });
  it("should login", async () => {
    userEvent.type(
      screen.getByPlaceholderText("メールアドレス"),
      "test@test.com"
    );
    userEvent.type(screen.getByPlaceholderText("パスワード"), "password");
    userEvent.click(screen.getByText("ログイン"));
    await waitFor(() =>
      expect(localStorage.getItem(PersistKeys.AuthToken)).toBe("token")
    );
    await waitFor(() =>
      expect(history.location.pathname).toBe(routes.managements())
    );
  });
});
