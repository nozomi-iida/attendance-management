import { FC } from "react";
import { LightningTalk } from "pages/LightningTalkPage/LightningTalk";
import { PageLayout } from "components/ui/PageLayout/PageLayout";

export const LightningTalkPage: FC = () => {
  return (
    <PageLayout>
      <LightningTalk />
    </PageLayout>
  );
};
