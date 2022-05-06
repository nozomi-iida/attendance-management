import { FC } from "react";
import { PageContainer } from "@ant-design/pro-layout";
import { AttendanceTable } from "../../components/model/attendance/AttendanceTable/AttendanceTable";

export const Management: FC = () => {
  return (
    <PageContainer>
      <AttendanceTable />
    </PageContainer>
  );
};
