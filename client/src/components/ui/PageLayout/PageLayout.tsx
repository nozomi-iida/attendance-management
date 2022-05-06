import ProLayout, { MenuDataItem } from "@ant-design/pro-layout";
import { FC, ReactNode } from "react";
import Logo from "assets/images/logo.png";
import { ClockCircleOutlined } from "@ant-design/icons";
import { routes } from "../../../constants/routes";

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
  return (
    <ProLayout menuDataRender={() => menu} title="SIMULA.Labs" logo={Logo}>
      {children}
    </ProLayout>
  );
};
