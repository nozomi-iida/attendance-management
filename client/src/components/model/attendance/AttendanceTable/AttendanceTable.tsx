import { FC, useEffect, useMemo, useState } from "react";
import { Attendance } from "api/attendance";
import {
  Button,
  DatePicker,
  Form,
  InputNumber,
  Modal,
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
import { CSVLink } from "react-csv";
import { CloudDownloadOutlined } from "@ant-design/icons";
import styles from "./AttendanceTable.module.scss";

type AttendanceTableProps = {
  data?: Attendance[];
  selectedMonth: Moment;
  onChangeMonth: (month: Moment) => void;
  onAttendance: () => void;
  onUpdateAttendance: (id: number, params: UpdateAttendanceRequestBody) => void;
  onLeaveAttendance: () => void;
  onDeleteAttendance: (id: number) => void;
  onStartBreakAttendance: () => void;
  onEndBreakAttendance: () => void;
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

export const AttendanceTable: FC<AttendanceTableProps> = ({
  data,
  selectedMonth,
  onAttendance,
  onChangeMonth,
  onUpdateAttendance,
  onDeleteAttendance,
  onLeaveAttendance,
  onStartBreakAttendance,
  onEndBreakAttendance,
}) => {
  const { account } = useCurrentAccount();
  const [selectedAttendance, setSelectedAttendance] =
    useState<AttendanceTableDataItem>();
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
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();

    // eslint-disable-next-line
  }, [selectedAttendance]);

  const columns: ColumnProps<AttendanceTableDataItem>[] = [
    {
      title: "日付",
      dataIndex: "date",
      render: (_, entity) => (
        <Typography.Text
          strong={
            entity.date.getMonth() === new Date().getMonth() &&
            entity.date.getDate() === new Date().getDate()
          }
        >
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
            {moment(entity.startedAt).format("HH:mm")}
          </Typography.Text>
        ),
    },
    {
      title: "退勤時刻",
      dataIndex: "endedAt",
      render: (_, entity) =>
        entity.endedAt && (
          <Typography.Text>
            {moment(entity.endedAt).format("HH:mm")}
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
            <Button
              type="primary"
              onClick={() => {
                setSelectedAttendance(entity);
              }}
            >
              編集
            </Button>
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
  const headers = [
    {
      label: "年月日",
      key: "date",
    },
    { label: "出勤時間", key: "startedAt" },
    { label: "退勤時間", key: "endedAt" },
    { label: "休憩時間", key: "breakTime" },
    { label: "労働時間", key: "workTime" },
  ];
  const csvData = useMemo(() => {
    let totalWorkTime = 0;
    const attendanceData = data?.map((el) => {
      totalWorkTime += el.workTime;
      return {
        date: moment(el.startedAt).format("YYYY-MM-DD"),
        startedAt: moment(el.startedAt).format("YYYY-MM-DD"),
        endedAt: el.endedAt ? moment(el.endedAt).format("YYYY-MM-DD") : "",
        breakTime: numberToTime(el.breakTime),
        workTime: numberToTime(el.workTime),
      };
    });
    return [
      ...(attendanceData ?? []),
      { date: "合計時間", workTime: numberToTime(totalWorkTime) },
    ];
  }, [data]);

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
              {account?.currentAttendance.breakStartTime ? (
                <Button size="large" onClick={onEndBreakAttendance}>
                  休憩終了
                </Button>
              ) : (
                <Button size="large" onClick={onStartBreakAttendance}>
                  休憩
                </Button>
              )}
              <Popconfirm
                title="退勤しますか?"
                placement="topRight"
                onConfirm={onLeaveAttendance}
              >
                <Button size="large" danger>
                  退勤
                </Button>
              </Popconfirm>
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
      <div>
        <CSVLink
          filename={`${selectedMonth.format("MM")}月の勤怠表`}
          data={csvData}
          headers={headers}
        >
          <Button icon={<CloudDownloadOutlined />}>ダウンロード</Button>
        </CSVLink>
      </div>
      <Table
        rowKey="date"
        pagination={false}
        dataSource={dataSource}
        columns={columns}
      />

      <Modal
        title="勤怠を編集"
        visible={!!selectedAttendance}
        onCancel={() => {
          setSelectedAttendance(undefined);
        }}
        onOk={() => {
          form.submit();
        }}
      >
        <Form
          form={form}
          initialValues={{
            startedAt: moment(selectedAttendance?.startedAt),
            endedAt: selectedAttendance?.endedAt
              ? moment(selectedAttendance?.endedAt)
              : undefined,
            breakTime: selectedAttendance?.breakTime,
          }}
          onFinish={(values) => {
            if (selectedAttendance?.id) {
              onUpdateAttendance(selectedAttendance.id, values);
              setSelectedAttendance(undefined);
            }
          }}
        >
          <Form.Item
            label="出勤時刻"
            name="startedAt"
            rules={[{ required: true, message: "出勤時刻の入力は必須です" }]}
          >
            <DatePicker picker="time" showNow={false} />
          </Form.Item>
          <Form.Item label="退勤時刻" name="endedAt">
            <DatePicker
              format="YYYY-MM-DD HH:mm:ss"
              showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
              showNow={false}
            />
          </Form.Item>
          <Form.Item label="休憩時間" name="breakTime">
            <InputNumber />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
