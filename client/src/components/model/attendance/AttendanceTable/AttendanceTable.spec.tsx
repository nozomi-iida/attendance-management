import {screen, waitFor, within} from "@testing-library/react";
import {setupServer} from "msw/node";
import {rest} from "msw";
import {ApiHost} from "constants/urls";
import {Attendance, mockAttendance} from "api/attendance";
import {useManagement} from "pages/ManagementPage/useManagement";
import {Account, mockAccount} from "api/account";
import userEvent from "@testing-library/user-event";
import {createMemoryHistory} from "history";
import moment from "moment";
import {customRender} from "helpers/specHelpers";
import {AttendanceTable} from "./AttendanceTable";

// it("should match snapshot", () => {
//   const { container } = render(<AttendanceTable />, { wrapper: BrowserRouter });
//
//   // eslint-disable-next-line testing-library/no-node-access
//   expect(container.firstChild).toMatchSnapshot();
// });

describe("Attendance table", () => {
  const server = setupServer();

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });
  const history = createMemoryHistory();

  type TestAttendanceTableProps = {
    account: Account;
    attendances: Attendance[];
  };

  const TestAttendanceTable = ({
    account,
    attendances,
  }: TestAttendanceTableProps) => {
    server.use(
      rest.get(
        `${ApiHost}/accounts/${account.id}/attendances`,
        (req, res, ctx) => {
          return res(ctx.json([mockAttendance()]));
        }
      )
    );

    const {
      onChangeMonth,
      onUpdateAttendance,
      onAttendance,
      onLeaveAttendance,
      onDeleteAttendance,
    } = useManagement();
    return (
        <AttendanceTable
          selectedMonth={moment(new Date())}
          onChangeMonth={onChangeMonth}
          onAttendance={onAttendance}
          onUpdateAttendance={onUpdateAttendance}
          onDeleteAttendance={onDeleteAttendance}
          onLeaveAttendance={onLeaveAttendance}
          data={attendances}
        />
    );
  };

  it.skip("should change month", () => {});

  it("should attendance", async () => {
    const account = mockAccount({ currentAttendance: null });
    server.use(
      rest.post(
        `${ApiHost}/accounts/${account.id}/attendances`,
        (req, res, ctx) => {
          return res(ctx.json(mockAttendance()));
        }
      )
    );
    customRender(<TestAttendanceTable account={account} attendances={[]} />, {account, history, server});
    userEvent.click(screen.getByRole("button", { name: "出 勤" }));
    await waitFor(() => screen.findByText("出勤しました"));
    expect(screen.getByText("出勤しました")).toBeInTheDocument();
  });

  it.skip("should get attendances in april", async () => {});

  it.skip("should start break", () => {});

  it.skip("should finish break", () => {});

  it("should leave work", async () => {
    const account = mockAccount();
    const attendance = mockAttendance();
    server.use(
      rest.patch(
        `${ApiHost}/accounts/${account.id}/attendances/${attendance.id}/leave`,
        (req, res, ctx) => {
          return res(ctx.json(mockAttendance()));
        }
      )
    );

    customRender(<TestAttendanceTable account={account} attendances={[]} />, {account, history, server});

    userEvent.click(screen.getByRole("button", { name: "退 勤" }));
    await waitFor(() =>
      screen.findByText("退勤しました。今日も一日お疲れ様です！")
    );
    expect(
      screen.getByText("退勤しました。今日も一日お疲れ様です！")
    ).toBeInTheDocument();
  });

  it.skip("should edit attendance", () => {});
  it("should delete attendance", async () => {
    const account = mockAccount();
    const attendance = mockAttendance({
      startedAt: new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        14
      ).toISOString(),
    });

    server.use(
      rest.delete(
        `${ApiHost}/accounts/${account.id}/attendances/${attendance.id}`,
        (req, res, ctx) => {
          return res(ctx.json(mockAttendance()));
        }
      )
    );
    customRender(<TestAttendanceTable account={account} attendances={[attendance]} />, {account, history, server});

    const attendanceForDeleteRow = within(
      screen.getByRole("row", { name: /14/i })
    );
    userEvent.click(
      attendanceForDeleteRow.getByRole("button", { name: "削 除" })
    );
    await waitFor(() => screen.findByText("本当に削除しますか?"));
    userEvent.click(screen.getByRole("button", { name: "OK" }));
    await waitFor(() => screen.findByText("勤怠を削除しました"));
    expect(screen.getByText("勤怠を削除しました")).toBeInTheDocument();
  });
});
