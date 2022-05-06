import { FC, ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useCurrentAccount } from "hooks/useCurrentAccount/useCurrentAccount";
import { routes } from "constants/routes";

type UnauthenticatedRouterProps = {
  children: ReactElement;
};

export const UnauthenticatedRouter: FC<UnauthenticatedRouterProps> = ({
  children,
}) => {
  const { account } = useCurrentAccount();
  return account ? children : <Navigate to={routes.login()} />;
};
