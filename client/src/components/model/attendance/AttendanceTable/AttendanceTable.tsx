import { FC, useMemo } from "react";
import ProTable, { ProColumns } from "@ant-design/pro-table";
import { Attendance, mockAttendance } from "api/attendance";
import { Button, notification, Typography } from "antd";
import { format } from "date-fns";
import ja from "date-fns/locale/ja";
import { numberToTime } from "helpers/helpers";
import { createAttendance } from "api/attendance/createAttendance";
import { useCurrentAccount } from "hooks/useCurrentAccount/useCurrentAccount";
// eslint-disable-next-line import/no-extraneous-dependencies
import "moment/locale/ja";

type AttendanceTableProps = {
  data?: Attendance[];
};

type AttendanceTableDataItem = {
  date: Date;
} & Partial<Attendance>;

const getAllDaysInMonth = (month: number, year: number = 2022) =>
  Array.from(
    { length: new Date(year, month, 0).getDate() },
    (_, i) => new Date(year, month - 1, i + 1)
  );

export const AttendanceTable: FC<AttendanceTableProps> = ({
  data = [mockAttendance()],
}) => {
  const dataSource: AttendanceTableDataItem[] = useMemo(() => {
    return getAllDaysInMonth(5).map((date) => {
      const attendance = data?.find(
        (el) => el.startedAt.getDate() === date.getDate()
      );
      return {
        date,
        ...attendance,
      };
    });
  }, [data]);
  const { account } = useCurrentAccount();
  const onAttendance = () => {
    if (!account) return;
    createAttendance(account.id).then(() => {
      notification.success({ message: "出勤しました" });
    });
  };

  const columns: ProColumns<AttendanceTableDataItem>[] = [
    {
      title: "日付",
      dataIndex: "date",
      valueType: "dateMonth",
      initialValue: new Date(),
      render: (_, entity) => (
        <Typography.Text>
          {format(entity.date, "MM/dd(E)", { locale: ja })}
        </Typography.Text>
      ),
    },
    {
      title: "出勤時刻",
      dataIndex: "startedAt",
      search: false,
      render: (_, entity) =>
        entity.startedAt && (
          <Typography.Text>
            {format(new Date(entity.startedAt), "H:m")}
          </Typography.Text>
        ),
    },
    {
      title: "退勤時刻",
      dataIndex: "endedAt",
      search: false,
      render: (_, entity) =>
        entity.endedAt && (
          <Typography.Text>
            {format(new Date(entity.endedAt), "H:m")}
          </Typography.Text>
        ),
    },
    {
      title: "総労働時間",
      dataIndex: "workingTime",
      search: false,
      render: (_, entity) =>
        entity.workingTime && (
          <Typography.Text>{numberToTime(entity.workingTime)}</Typography.Text>
        ),
    },
    {
      title: "休憩時間",
      dataIndex: "breakTime",
      search: false,
      render: (_, entity) =>
        entity.breakTime && (
          <Typography.Text>{numberToTime(entity.breakTime)}</Typography.Text>
        ),
    },
    {
      title: "アクション",
      search: false,
      render: () => <Button type="primary">編集</Button>,
    },
  ];
  return (
    <ProTable
      rowKey="id"
      pagination={false}
      toolBarRender={false}
      search={{
        labelWidth: "auto",
        // eslint-disable-next-line react/no-unstable-nested-components
        optionRender: (search, formPrps, dom) => [
          <Button type="primary" onClick={onAttendance}>
            出勤
          </Button>,
        ],
      }}
      dataSource={dataSource}
      columns={columns}
    />
  );
};
