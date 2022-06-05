import { FC } from "react";
import { PageLayout } from "components/ui/PageLayout/PageLayout";
import { AccountManagement } from "pages/AccountManagementPage/AccountManagement";

export const AccountManagementPage: FC = () => {
  return (
    <PageLayout>
      <AccountManagement />
    </PageLayout>
  );
};
