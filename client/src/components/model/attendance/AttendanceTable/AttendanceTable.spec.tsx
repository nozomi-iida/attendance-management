import { screen, waitFor, within } from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { ApiHost } from "constants/urls";
import { Attendance, mockAttendance } from "api/attendance";
import { useManagement } from "pages/ManagementPage/useManagement";
import { Account, mockAccount } from "api/account";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import moment from "moment";
import { customRender } from "helpers/specHelpers";
import { AttendanceTable } from "./AttendanceTable";

// it("should match snapshot", () => {
//   const { container } = render(<AttendanceTable />, { wrapper: BrowserRouter });
//
//   // eslint-disable-next-line testing-library/no-node-access
//   expect(container.firstChild).toMatchSnapshot();
// });

describe("Attendance table", () => {
  const server = setupServer();

  beforeAll(() => {
    server.listen({
      onUnhandledRequest: "warn",
    });
  });

  afterEach(() => {
    server.resetHandlers();
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
      onStartBreakAttendance,
      onEndBreakAttendance,
    } = useManagement();
    return (
      <AttendanceTable
        selectedMonth={moment(new Date())}
        onChangeMonth={onChangeMonth}
        onAttendance={onAttendance}
        onUpdateAttendance={onUpdateAttendance}
        onDeleteAttendance={onDeleteAttendance}
        onLeaveAttendance={onLeaveAttendance}
        onStartBreakAttendance={onStartBreakAttendance}
        onEndBreakAttendance={onEndBreakAttendance}
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
    customRender(<TestAttendanceTable account={account} attendances={[]} />, {
      account,
      history,
      server,
    });
    userEvent.click(screen.getByRole("button", { name: "??? ???" }));
    await waitFor(() => screen.findByText("??????????????????"));
    expect(screen.getByText("??????????????????")).toBeInTheDocument();
  });

  it.skip("should get attendances in april", async () => {});

  it("should start break", async () => {
    let attendance = mockAttendance({ breakStartTime: null });
    const account = mockAccount({ currentAttendance: attendance });
    server.use(
      rest.patch(
        `${ApiHost}/accounts/${account.id}/attendances/${attendance.id}/break`,
        (req, res, ctx) => {
          return res(ctx.json(attendance));
        }
      )
    );
    server.use(
      rest.get(`${ApiHost}/accounts/${account.id}`, (req, res, ctx) => {
        attendance = mockAttendance({ breakStartTime: new Date().toString() });
        return res(
          ctx.json(
            mockAccount({
              currentAttendance: mockAttendance({
                breakStartTime: new Date().toString(),
              }),
            })
          )
        );
      })
    );
    customRender(
      <TestAttendanceTable account={account} attendances={[attendance]} />,
      {
        account,
        history,
        server,
      }
    );
    userEvent.click(screen.getByRole("button", { name: "??? ???" }));
    // server.printHandlers()
    await waitFor(() => screen.findByText("????????????"));
  });

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

    customRender(<TestAttendanceTable account={account} attendances={[]} />, {
      account,
      history,
      server,
    });

    userEvent.click(screen.getByRole("button", { name: "??? ???" }));
    await waitFor(() =>
      screen.findByText("?????????????????????????????????????????????????????????")
    );
    expect(
      screen.getByText("?????????????????????????????????????????????????????????")
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
    customRender(
      <TestAttendanceTable account={account} attendances={[attendance]} />,
      { account, history, server }
    );

    const attendanceForDeleteRow = within(
      screen.getByRole("row", { name: /14/i })
    );
    userEvent.click(
      attendanceForDeleteRow.getByRole("button", { name: "??? ???" })
    );
    await waitFor(() => screen.findByText("????????????????????????????"));
    userEvent.click(screen.getByRole("button", { name: "OK" }));
    await waitFor(() => screen.findByText("???????????????????????????"));
    expect(screen.getByText("???????????????????????????")).toBeInTheDocument();
  });
});
