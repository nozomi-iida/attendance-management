import {useContext} from "react";
import {PersistKeys} from "constants/persistKeys";
import {getAccount} from "api/account/getAccount";
import {currentAccountContext} from "./CurrentAccountContext";

export const useCurrentAccount = () => {
  const { account, setAccount } = useContext(currentAccountContext);

  const getCurrentAccount = () => {
    const token = localStorage.getItem(PersistKeys.AuthToken)
    if(!token) return;

    const [, p] = token.split(".");
    const {id} = JSON.parse(window.atob(p));
    if (!id) return;
      getAccount(id).then((data) => {
      setAccount(data);
    });
  };

  return {
    account,
    getAccount: getCurrentAccount,
  };
};
