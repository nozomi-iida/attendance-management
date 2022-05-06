import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { Account, mockAccount } from "api/account";
import { getCurrentAccount } from "api/auth/currentAccount";

type CurrentAccountContext = {
  account?: Account;
  setAccount: (account: Account) => void;
};

type CurrentAccountProviderProps = {
  children: ReactNode;
};

export const currentAccountContext = createContext<CurrentAccountContext>({
  account: undefined,
  setAccount: () => undefined,
});

export const CurrentAccountProvider: FC<CurrentAccountProviderProps> = ({
  children,
}) => {
  // TODO
  const [account, setAccount] = useState<Account>(mockAccount);
  useEffect(() => {
    getCurrentAccount().then((data) => {
      setAccount(data);
    });
  }, []);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <currentAccountContext.Provider value={{ account, setAccount }}>
      {children}
    </currentAccountContext.Provider>
  );
};
