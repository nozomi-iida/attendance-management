/* eslint-disable */
import { CurrentAccountContext } from "hooks/useCurrentAccount/CurrentAccountContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { Account } from "api/account";
import React, { ReactElement, ReactNode } from "react";
import { Router } from "react-router-dom";
import { MemoryHistory } from "history";
import { render, RenderOptions } from "@testing-library/react";
import { SetupServerApi } from "msw/node";
import { rest } from "msw";
import { ApiHost } from "constants/urls";

type CustomWrapperProps = {
  account?: Account;
  children: ReactElement;
  history: MemoryHistory;
};

const customWrapper = ({ account, children, history }: CustomWrapperProps) => {
  const queryClient = new QueryClient();
  return (
    <CurrentAccountContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{ account, setAccount: jest.fn }}
    >
      <QueryClientProvider client={queryClient}>
        <Router location={history.location} navigator={history}>
          {children}
        </Router>
      </QueryClientProvider>
    </CurrentAccountContext.Provider>
  );
};

export const customRender = (
  ui: ReactElement,
  customValue: Omit<CustomWrapperProps, "children"> & {
    server: SetupServerApi;
  },
  options?: Omit<RenderOptions, "wrapper">
) => {
  return render(ui, {
    wrapper: ({ children }) =>
      customWrapper({
        children: children,
        account: customValue.account,
        history: customValue.history,
      }),
    ...options,
  });
};

/* eslint-enable */
