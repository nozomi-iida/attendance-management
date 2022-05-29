import { FC } from "react";
import { PageContainer } from "@ant-design/pro-layout";
import { AttendanceTable } from "components/model/attendance/AttendanceTable/AttendanceTable";
import { useManagement } from "pages/ManagementPage/useManagement";

export const Management: FC = () => {
  const {
    attendances,
    selectedMonth,
    onChangeMonth,
    onAttendance,
    onUpdateAttendance,
    onDeleteAttendance,
    onLeaveAttendance,
    onStartBreakAttendance
  } = useManagement();
  return (
    <PageContainer>
      <AttendanceTable
        selectedMonth={selectedMonth}
        onAttendance={onAttendance}
        onDeleteAttendance={onDeleteAttendance}
        onUpdateAttendance={onUpdateAttendance}
        onLeaveAttendance={onLeaveAttendance}
        onStartBreakAttendance={onStartBreakAttendance}
        data={attendances}
        onChangeMonth={onChangeMonth}
      />
    </PageContainer>
  );
};
