import { FC } from "react";
import { PageLayout } from "components/ui/PageLayout/PageLayout";
import { Management } from "./Management";

export const ManagementPage: FC = () => {
  return (
    <PageLayout>
      <Management />
    </PageLayout>
  );
};
