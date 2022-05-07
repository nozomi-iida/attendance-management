import {createContext, FC, ReactNode, useEffect, useState} from "react";
import {Account, mockAccount} from "api/account";
import {PersistKeys} from "constants/persistKeys";
import {getAccount} from "api/account/getAccount";

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
    const token = localStorage.getItem(PersistKeys.AuthToken)
    if(!token) return;

    const [, p] = token.split(".");
    const {id} = JSON.parse(window.atob(p));

    if (id) {
      getAccount(id).then((data) => {
        setAccount(data);
      });
    }
  }, []);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <currentAccountContext.Provider value={{ account, setAccount }}>
      {children}
    </currentAccountContext.Provider>
  );
};
