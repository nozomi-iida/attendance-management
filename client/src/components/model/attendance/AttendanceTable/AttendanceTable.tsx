import { FC, Fragment, useMemo } from "react";
import { Attendance, mockAttendance } from "api/attendance";
import {
  Button,
  DatePicker,
  Popconfirm,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import { numberToTime } from "helpers/helpers";
import { useCurrentAccount } from "hooks/useCurrentAccount/useCurrentAccount";
import { UpdateAttendanceRequestBody } from "api/attendance/updateAttendance";
import { ColumnProps } from "antd/es/table";
import moment, { Moment } from "moment";
import styles from "./AttendanceTable.module.scss";

type AttendanceTableProps = {
  data?: Attendance[];
  selectedMonth: Moment;
  onChangeMonth: (month: Moment) => void;
  onAttendance: () => void;
  onUpdateAttendance: (id: number, params: UpdateAttendanceRequestBody) => void;
  onLeaveAttendance: () => void;
  onDeleteAttendance: (id: number) => void;
};

type AttendanceTableDataItem = {
  date: Date;
} & Partial<Attendance>;

const getAllDaysInMonth = (date: Moment) => {
  const year = date.toDate().getFullYear();
  const month = date.toDate().getMonth() + 1;
  return Array.from(
    { length: new Date(year, month, 0).getDate() },
    (_, i) => new Date(year, month - 1, i + 1)
  );
};

// TODO: 間違えて退勤を押してしまった場合の導線考えてない
export const AttendanceTable: FC<AttendanceTableProps> = ({
  data = [mockAttendance()],
  selectedMonth,
  onAttendance,
  onChangeMonth,
  onUpdateAttendance,
  onDeleteAttendance,
  onLeaveAttendance,
}) => {
  const { account } = useCurrentAccount();
  console.log(account?.currentAttendance && !account.currentAttendance.endedAt);
  const dataSource: AttendanceTableDataItem[] = useMemo(() => {
    return getAllDaysInMonth(selectedMonth).map((date) => {
      const attendance = data?.find((el) => {
        return moment(el.startedAt).toDate().getDate() === date.getDate();
      });
      return {
        date,
        ...attendance,
      };
    });
  }, [data, selectedMonth]);

  const columns: ColumnProps<AttendanceTableDataItem>[] = [
    {
      title: "日付",
      dataIndex: "date",
      render: (_, entity) => (
        <Typography.Text>
          {moment(entity.date).format("MM/D(dd)")}
        </Typography.Text>
      ),
    },
    {
      title: "出勤時刻",
      dataIndex: "startedAt",
      render: (_, entity) =>
        entity.startedAt && (
          <Typography.Text>
            {moment(entity.startedAt).format("H:m")}
          </Typography.Text>
        ),
    },
    {
      title: "退勤時刻",
      dataIndex: "endedAt",
      render: (_, entity) =>
        entity.endedAt && (
          <Typography.Text>
            {moment(entity.endedAt).format("H:m")}
          </Typography.Text>
        ),
    },
    {
      title: "総労働時間",
      dataIndex: "workTime",
      render: (_, entity) =>
        entity.workTime && (
          <Typography.Text>{numberToTime(entity.workTime)}</Typography.Text>
        ),
    },
    {
      title: "休憩時間",
      dataIndex: "breakTime",
      render: (_, entity) =>
        entity.breakTime && (
          <Typography.Text>{numberToTime(entity.breakTime)}</Typography.Text>
        ),
    },
    {
      title: "アクション",
      render: (_, entity) =>
        entity.id && (
          <Space>
            <Button type="primary">編集</Button>
            <Popconfirm
              title="本当に削除しますか?"
              onConfirm={() => onDeleteAttendance(entity.id ?? 0)}
            >
              <Button type="primary" danger>
                削除
              </Button>
            </Popconfirm>
          </Space>
        ),
    },
  ];
  return (
    <div className={styles.flexBox}>
      <Row justify="space-between" className={styles.searchBox}>
        <DatePicker
          size="large"
          defaultValue={moment(selectedMonth)}
          picker="month"
          onChange={(date) => date && onChangeMonth(date)}
        />
        <Space>
          {account?.currentAttendance && !account.currentAttendance.endedAt ? (
            <>
              {account?.currentAttendance.breakTime ? (
                <Button size="large">休憩終了</Button>
              ) : (
                <Button size="large">休憩</Button>
              )}
              <Button size="large" danger onClick={onLeaveAttendance}>
                退勤
              </Button>
            </>
          ) : (
            <Button
              size="large"
              type="primary"
              disabled={!!account?.currentAttendance}
              onClick={onAttendance}
            >
              出勤
            </Button>
          )}
        </Space>
      </Row>
      <Table
        rowKey="date"
        pagination={false}
        dataSource={dataSource}
        columns={columns}
      />
    </div>
  );
};
