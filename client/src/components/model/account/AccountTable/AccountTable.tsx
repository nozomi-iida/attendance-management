import { FC, useCallback, useMemo } from "react";
import { Account } from "api/account";
import { ColumnProps } from "antd/es/table";
import { Table, Tag, Typography } from "antd";
import { Attendance } from "api/attendance";

export type AccountTableProps = {
  data: Account[];
};

export const AccountTable: FC<AccountTableProps> = ({ data }) => {
  const workStatus = useCallback((currentAttendance: Attendance) => {
    if (currentAttendance.breakStartTime) {
      return <Tag color="red">休憩中</Tag>;
    }
    if (currentAttendance.endedAt) {
      return <Tag color="gold">退勤中</Tag>;
    }
    return <Tag color="green">出勤中</Tag>;
  }, []);
  const columns: ColumnProps<Account>[] = [
    {
      title: "ユーザー名",
      dataIndex: "handleName",
      render: (handleName: string) => (
        <Typography.Text>{handleName}</Typography.Text>
      ),
    },
    {
      title: "ステータス",
      render: (_, entity) =>
        entity.currentAttendance ? (
          <div>{workStatus(entity.currentAttendance)}</div>
        ) : (
          <Tag color="blue">出勤記録なし</Tag>
        ),
    },
  ];
  return (
    <div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};
