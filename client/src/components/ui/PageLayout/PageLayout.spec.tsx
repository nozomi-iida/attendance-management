import { render, screen, waitFor } from "@testing-library/react";
import { PageLayout } from "components/ui/PageLayout/PageLayout";
import { createMemoryHistory } from "history";
import { BrowserRouter, Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { CurrentAccountContext } from "hooks/useCurrentAccount/CurrentAccountContext";
import { mockAccount } from "api/account";
import { routes } from "constants/routes";

test("should match snapshot", () => {
  const { container } = render(
    <PageLayout>
      <div />
    </PageLayout>,
    { wrapper: BrowserRouter }
  );

  // eslint-disable-next-line testing-library/no-node-access
  expect(container.firstChild).toMatchSnapshot();
});

describe("PageLayout", () => {
  test("logout", async () => {
    const account = mockAccount();
    const history = createMemoryHistory();
    render(
      <Router location={history.location} navigator={history}>
        <CurrentAccountContext.Provider
          value={{ account, setAccount: jest.fn }}
        >
          <PageLayout>
            <div />
          </PageLayout>
        </CurrentAccountContext.Provider>
      </Router>
    );
    userEvent.hover(
      screen.getByRole("button", {
        name: account.handleName,
      })
    );
    await waitFor(() => {
      screen.getByText("ログアウト");
    });
    userEvent.click(screen.getByText("ログアウト"));
    await waitFor(() => expect(history.location.pathname).toBe(routes.login()));
  });
});
