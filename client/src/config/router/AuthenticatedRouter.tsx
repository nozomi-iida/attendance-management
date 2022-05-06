import { FC, ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useCurrentAccount } from "hooks/useCurrentAccount/useCurrentAccount";
import { routes } from "constants/routes";

type UnauthenticatedRouterProps = {
  children: ReactElement;
};

export const AuthenticatedRouter: FC<UnauthenticatedRouterProps> = ({
  children,
}) => {
  const { account } = useCurrentAccount();
  return account ? <Navigate to={routes.managements()} /> : children;
};
