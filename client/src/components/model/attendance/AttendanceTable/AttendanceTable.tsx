import { FC } from "react";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import {Attendance, mockAttendance} from "api/attendance";
import {Button, Typography} from "antd";
import { format } from "date-fns";
import { numberToTime } from "../../../../helpers/helpers";

export const AttendanceTable: FC = () => {
  const columns: ProColumns<Attendance>[] = [
    {
      title: "日付",
      dataIndex: "startedAt",
      render: (_, entity) => (
        <Typography.Text>
          {format(new Date(entity.startedAt), "MM/dd")}
        </Typography.Text>
      ),
    },
    {
      title: "出勤時刻",
      dataIndex: "startedAt",
      render: (_, entity) => (
        <Typography.Text>
          {format(new Date(entity.startedAt), "H:m")}
        </Typography.Text>
      ),
    },
    {
      title: "退勤時刻",
      dataIndex: "endedAt",
      render: (_, entity) => (
        <Typography.Text>
          {format(new Date(entity.endedAt), "H:m")}
        </Typography.Text>
      ),
    },
    {
      title: "総労働時間",
      dataIndex: "workingTime",
      render: (_, entity) => (
        <Typography.Text>{numberToTime(entity.workingTime)}</Typography.Text>
      ),
    },
    {
      title: "休憩時間",
      dataIndex: "breakTime",
      render: (_, entity) => (
        <Typography.Text>{numberToTime(entity.breakTime)}</Typography.Text>
      ),
    },
    {
      title: "アクション",
      dataIndex: "breakTime",
      render: () => (
        <Button type="primary">編集</Button>
      ),
    },
  ];
  return <ProTable rowKey="id" pagination={false} toolBarRender={false} search={false} dataSource={[mockAttendance()]} columns={columns} />;
};
