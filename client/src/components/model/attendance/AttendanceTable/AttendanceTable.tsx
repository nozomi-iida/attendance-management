import { FC, useEffect, useMemo, useState } from "react";
import { Attendance, mockAttendance } from "api/attendance";
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
  data = [mockAttendance()],
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
  }, [selectedAttendance]);

  const columns: ColumnProps<AttendanceTableDataItem>[] = [
    {
      title: "??????",
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
      title: "????????????",
      dataIndex: "startedAt",
      render: (_, entity) =>
        entity.startedAt && (
          <Typography.Text>
            {moment(entity.startedAt).format("HH:mm")}
          </Typography.Text>
        ),
    },
    {
      title: "????????????",
      dataIndex: "endedAt",
      render: (_, entity) =>
        entity.endedAt && (
          <Typography.Text>
            {moment(entity.endedAt).format("HH:mm")}
          </Typography.Text>
        ),
    },
    {
      title: "???????????????",
      dataIndex: "workTime",
      render: (_, entity) =>
        entity.workTime && (
          <Typography.Text>{numberToTime(entity.workTime)}</Typography.Text>
        ),
    },
    {
      title: "????????????",
      dataIndex: "breakTime",
      render: (_, entity) =>
        entity.breakTime && (
          <Typography.Text>{numberToTime(entity.breakTime)}</Typography.Text>
        ),
    },
    {
      title: "???????????????",
      render: (_, entity) =>
        entity.id && (
          <Space>
            <Button
              type="primary"
              onClick={() => {
                setSelectedAttendance(entity);
              }}
            >
              ??????
            </Button>
            <Popconfirm
              title="????????????????????????????"
              onConfirm={() => onDeleteAttendance(entity.id ?? 0)}
            >
              <Button type="primary" danger>
                ??????
              </Button>
            </Popconfirm>
          </Space>
        ),
    },
  ];
  const headers = [
    {
      label: "?????????",
      key: "date",
    },
    { label: "????????????", key: "startedAt" },
    { label: "????????????", key: "endedAt" },
    { label: "????????????", key: "breakTime" },
    { label: "????????????", key: "workTime" },
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
      ...attendanceData,
      { date: "????????????", workTime: numberToTime(totalWorkTime) },
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
                  ????????????
                </Button>
              ) : (
                <Button size="large" onClick={onStartBreakAttendance}>
                  ??????
                </Button>
              )}
              <Popconfirm
                title="???????????????????"
                placement="topRight"
                onConfirm={onLeaveAttendance}
              >
                <Button size="large" danger>
                  ??????
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
              ??????
            </Button>
          )}
        </Space>
      </Row>
      <div>
        <CSVLink
          filename={`${selectedMonth.format("MM")}???????????????`}
          data={csvData}
          headers={headers}
        >
          <Button icon={<CloudDownloadOutlined />}>??????????????????</Button>
        </CSVLink>
      </div>
      <Table
        rowKey="date"
        pagination={false}
        dataSource={dataSource}
        columns={columns}
      />

      <Modal
        title="???????????????"
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
            label="????????????"
            name="startedAt"
            rules={[{ required: true, message: "????????????????????????????????????" }]}
          >
            <DatePicker picker="time" showNow={false} />
          </Form.Item>
          <Form.Item label="????????????" name="endedAt">
            <DatePicker
              format="YYYY-MM-DD HH:mm:ss"
              showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
              showNow={false}
            />
          </Form.Item>
          <Form.Item label="????????????" name="breakTime">
            <InputNumber />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
