import { FC, ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { routes } from "constants/routes";
import { PersistKeys } from "constants/persistKeys";

type UnauthenticatedRouterProps = {
  children: ReactElement;
};

export const AuthenticatedRouter: FC<UnauthenticatedRouterProps> = ({
  children,
}) => {
  const token = localStorage.getItem(PersistKeys.AuthToken);
  return token ? <Navigate to={routes.managements()} /> : children;
};
