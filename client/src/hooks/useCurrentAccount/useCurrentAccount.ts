import { useContext } from "react";
import { PersistKeys } from "constants/persistKeys";
import { getAccount } from "api/account/getAccount";
import { useNavigate } from "react-router-dom";
import { routes } from "constants/routes";
import { CurrentAccountContext } from "./CurrentAccountContext";

export const useCurrentAccount = () => {
  const { account, setAccount } = useContext(CurrentAccountContext);
  const navigate = useNavigate();

  const getCurrentAccount = async (id?: number) => {
    let accountId = id;
    if (!accountId && account) {
      accountId = account.id;
    }
    if (!accountId) return;

    try {
      const res = await getAccount(accountId);
      setAccount(res);
    } catch (e) {
      throw new Error("エラー");
    }
  };

  const logout = () => {
    localStorage.clear();
    setAccount(undefined);
    navigate(routes.login());
  };

  return {
    account,
    getAccount: getCurrentAccount,
    logout,
  };
};
