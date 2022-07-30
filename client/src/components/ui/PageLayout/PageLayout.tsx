import ProLayout, { MenuDataItem } from "@ant-design/pro-layout";
import { FC, ReactNode, useMemo } from "react";
import Logo from "assets/images/logo.png";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { routes } from "constants/routes";
import { useCurrentAccount } from "hooks/useCurrentAccount/useCurrentAccount";
import { Button, Popover } from "antd";
import { Link } from "react-router-dom";

type PageLayoutProps = {
  children: ReactNode;
};

const menu: MenuDataItem[] = [
  {
    path: routes.managements(),
    name: "勤怠管理",
    icon: <ClockCircleOutlined />,
  },
  {
    path: routes.accountManagement(),
    name: "社員の勤怠状況",
    icon: <UserOutlined />,
  },
  {
    path: routes.lightningTalks(),
    name: "LTアドベントカレンダー",
    icon: <CalendarOutlined />,
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
      fixSiderbar
      // eslint-disable-next-line react/no-unstable-nested-components
      menuItemRender={(item: MenuDataItem, defaultDom: ReactNode) => (
        <Link to={item.path ?? ""}>{defaultDom}</Link>
      )}
    >
      {children}
    </ProLayout>
  );
};
