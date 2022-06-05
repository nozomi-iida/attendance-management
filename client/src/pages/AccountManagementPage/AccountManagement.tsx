import { FC } from "react";
import { PageContainer } from "@ant-design/pro-layout";
import { AccountTable } from "components/model/account/AccountTable/AccountTable";
import { mockAccount } from "api/account";

export const AccountManagement: FC = () => {
  return (
    <PageContainer>
      <AccountTable data={[mockAccount({currentAttendance: undefined})]} />
    </PageContainer>
  );
};
