import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { Account } from "api/account";
import { PersistKeys } from "constants/persistKeys";
import { getAccount } from "api/account/getAccount";

type CurrentAccountContextUseCase = {
  account?: Account;
  setAccount: (account?: Account) => void;
};

type CurrentAccountProviderProps = {
  children: ReactNode;
};

export const CurrentAccountContext =
  createContext<CurrentAccountContextUseCase>({
    account: undefined,
    setAccount: () => undefined,
  });

export const CurrentAccountProvider: FC<CurrentAccountProviderProps> = ({
  children,
}) => {
  const [account, setAccount] = useState<Account>();
  useEffect(() => {
    const token = localStorage.getItem(PersistKeys.AuthToken);
    if (!token) return;

    const [, p] = token.split(".");
    const { id } = JSON.parse(window.atob(p));

    if (id !== undefined) {
      getAccount(id).then((data) => {
        setAccount(data);
      });
    }
  }, []);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <CurrentAccountContext.Provider value={{ account, setAccount }}>
      {children}
    </CurrentAccountContext.Provider>
  );
};
