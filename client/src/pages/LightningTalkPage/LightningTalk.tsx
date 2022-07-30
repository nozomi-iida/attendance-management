import { FC, useState } from "react";
import { PageContainer } from "@ant-design/pro-layout";
import { Calendar } from "antd";
import { CreateLightningTalkModal } from "pages/LightningTalkPage/CreateLightningTalkModal";

export const LightningTalk: FC = () => {
  const [selectedTalkDate, setSelectedTalkDate] = useState<string>();
  return (
    <PageContainer>
      <Calendar
        onSelect={(date) => {
          setSelectedTalkDate(date.toString());
        }}
      />
      <CreateLightningTalkModal
        visible={!!selectedTalkDate}
        onCancel={() => setSelectedTalkDate(undefined)}
        talkDate={selectedTalkDate ?? ""}
      />
    </PageContainer>
  );
};
