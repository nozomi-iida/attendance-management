import ProLayout, { MenuDataItem } from "@ant-design/pro-layout";
import { FC, ReactNode, useMemo } from "react";
import Logo from "assets/images/logo.png";
import { ClockCircleOutlined } from "@ant-design/icons";
import { routes } from "constants/routes";
import { useCurrentAccount } from "hooks/useCurrentAccount/useCurrentAccount";
import { Button, Popover, Typography } from "antd";

type PageLayoutProps = {
  children: ReactNode;
};

const menu: MenuDataItem[] = [
  {
    path: routes.managements(),
    name: "勤怠管理",
    icon: <ClockCircleOutlined />,
  },
];

export const PageLayout: FC<PageLayoutProps> = ({ children }) => {
  const { account, logout } = useCurrentAccount();
  const rightContentRender = useMemo(
    () =>
      account && (
        <Popover
          placement="bottomRight"
          title="アカウントサービス"
          content={
            <Button type="link" danger onClick={logout}>
              ログアウト
            </Button>
          }
        >
          <Button type="text">{account.handleName}</Button>
        </Popover>
      ),
    [account, logout]
  );

  return (
    <ProLayout
      menuDataRender={() => menu}
      title="SIMULA.Labs"
      logo={Logo}
      rightContentRender={() => rightContentRender}
    >
      {children}
    </ProLayout>
  );
};
