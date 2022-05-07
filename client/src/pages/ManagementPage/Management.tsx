import { FC } from "react";
import { PageContainer } from "@ant-design/pro-layout";
import { AttendanceTable } from "components/model/attendance/AttendanceTable/AttendanceTable";
import { useManagement } from "pages/ManagementPage/useManagement";

export const Management: FC = () => {
  const {
    attendances,
    onChangeMonth,
    onAttendance,
    onUpdateAttendance,
    onDeleteAttendance,
  } = useManagement();
  return (
    <PageContainer>
      <AttendanceTable
        onAttendance={onAttendance}
        onDeleteAttendance={onDeleteAttendance}
        onUpdateAttendance={onUpdateAttendance}
        data={attendances}
        onChangeMonth={onChangeMonth}
      />
    </PageContainer>
  );
};
