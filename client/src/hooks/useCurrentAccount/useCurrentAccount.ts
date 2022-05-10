import { useContext } from "react";
import { PersistKeys } from "constants/persistKeys";
import { getAccount } from "api/account/getAccount";
import { useNavigate } from "react-router-dom";
import { routes } from "constants/routes";
import { CurrentAccountContext } from "./CurrentAccountContext";

export const useCurrentAccount = () => {
  const { account, setAccount } = useContext(CurrentAccountContext);
  const navigate = useNavigate();

  const getCurrentAccount = () => {
    const token = localStorage.getItem(PersistKeys.AuthToken);
    if (!token) return;

    const [, p] = token.split(".");
    const { id } = JSON.parse(window.atob(p));
    if (!id) return;
    getAccount(id).then((data) => {
      setAccount(data);
    });
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
