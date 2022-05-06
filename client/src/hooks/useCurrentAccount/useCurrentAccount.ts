import { useContext } from "react";
import { currentAccountContext } from "./CurrentAccountContext";
import { getCurrentAccount } from "../../api/auth/currentAccount";

export const useCurrentAccount = () => {
  const { account, setAccount } = useContext(currentAccountContext);
  const getAccount = () => {
    getCurrentAccount().then((data) => {
      setAccount(data);
    });
  };

  return {
    account,
    getAccount,
  };
};
