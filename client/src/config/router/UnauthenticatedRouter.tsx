import { FC, ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useCurrentAccount } from "hooks/useCurrentAccount/useCurrentAccount";
import { routes } from "constants/routes";
import { PersistKeys } from "constants/persistKeys";

type UnauthenticatedRouterProps = {
  children: ReactElement;
};

export const UnauthenticatedRouter: FC<UnauthenticatedRouterProps> = ({
  children,
}) => {
  const token = localStorage.getItem(PersistKeys.AuthToken);
  return token ? children : <Navigate to={routes.login()} />;
};
