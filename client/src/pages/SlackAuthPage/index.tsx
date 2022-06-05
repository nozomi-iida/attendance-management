import { FC, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PersistKeys } from "constants/persistKeys";
import { routes } from "constants/routes";
import { useCurrentAccount } from "hooks/useCurrentAccount/useCurrentAccount";

export const SlackAuthPage: FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getAccount } = useCurrentAccount();
  useEffect(() => {
    (async () => {
      const token = searchParams.get("token");
      if (token) {
        localStorage.setItem(PersistKeys.AuthToken, token);
        getAccount();
        navigate(routes.managements());
      }
    })();
  }, []);
  return <div />;
};
