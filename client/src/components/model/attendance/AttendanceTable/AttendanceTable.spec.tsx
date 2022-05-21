import { render, screen, waitFor, within } from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { ApiHost } from "constants/urls";
import {Attendance, mockAttendance} from "api/attendance";
import { useManagement } from "pages/ManagementPage/useManagement";
import { Account, mockAccount } from "api/account";
import userEvent from "@testing-library/user-event";
import { CurrentAccountContext } from "hooks/useCurrentAccount/CurrentAccountContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactNode } from "react";
import { createMemoryHistory } from "history";
import { routes } from "constants/routes";
import { Router } from "react-router-dom";
import { AttendanceTable } from "./AttendanceTable";

// it("should match snapshot", () => {
//   const { container } = render(<AttendanceTable />, { wrapper: BrowserRouter });
//
//   // eslint-disable-next-line testing-library/no-node-access
//   expect(container.firstChild).toMatchSnapshot();
// });

describe("Attendance table", () => {
  const account = mockAccount({ currentAttendance: null });
  const attendance = mockAttendance();
  const mockAttendanceForDelete = mockAttendance({
    startedAt: new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      14
    ).toISOString(),
  });
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const TestAttendanceTable = ({attendance}: {attendance?: Attendance[]}) => {
    const {
      selectedMonth,
      onChangeMonth,
      onUpdateAttendance,
      onAttendance,
      onLeaveAttendance,
      onDeleteAttendance,
    } = useManagement();
    return (
      <AttendanceTable
        selectedMonth={selectedMonth}
        onChangeMonth={onChangeMonth}
        onAttendance={onAttendance}
        onUpdateAttendance={onUpdateAttendance}
        onDeleteAttendance={onDeleteAttendance}
        onLeaveAttendance={onLeaveAttendance}
        data={[mockAttendanceForDelete]}
      />
    );
  };
  const server = setupServer(
    rest.get(
      `${ApiHost}/accounts/${account.id}/attendances`,
      (req, res, ctx) => {
        return res(
          ctx.json({
            attendances: [
              mockAttendance(),
              mockAttendance(),
              mockAttendanceForDelete,
            ],
          })
        );
      }
    )
  );
  server.use(
    rest.post(
      `${ApiHost}/accounts/${account.id}/attendances`,
      (req, res, ctx) => {
        return res(ctx.json(mockAttendance()));
      }
    )
  );
  server.use(
    rest.patch(
      `${ApiHost}/accounts/${account.id}/attendances/${attendance.id}/leave`,
      (req, res, ctx) => {
        return res(ctx.json(mockAttendance()));
      }
    )
  );

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  const queryClient = new QueryClient();

  const customRender = (customAccount = account) => {
    const history = createMemoryHistory();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <CurrentAccountContext.Provider
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        value={{ account: customAccount, setAccount: jest.fn }}
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </CurrentAccountContext.Provider>
    );
    render(
      <Router location={history.location} navigator={history}>
        <TestAttendanceTable />
      </Router>,
      { wrapper }
    );
  };

  it.skip("should change month", () => {});

  it("should attendance", async () => {
    customRender();
    userEvent.click(screen.getByRole("button", { name: "出 勤" }));
    await waitFor(() => screen.findByText("出勤しました"));
    expect(screen.getByText("出勤しました")).toBeInTheDocument();
  });

  it.skip("should get attendances in april", async () => {});

  it.skip("should start break", () => {});

  it.skip("should finish break", () => {});

  // テスト毎に渡す値はcustomできるようにする必要がある
  // テストごとにmswを定義し直せるようにもしたい
  it("should finish work", async () => {
    const attendanceAccount = mockAccount({ currentAttendance: attendance });
    customRender(attendanceAccount);
    userEvent.click(screen.getByRole("button", { name: "退 勤" }));
    await waitFor(() =>
      screen.findByText("退勤しました。今日も一日お疲れ様です！")
    );
    expect(
      screen.getByText("退勤しました。今日も一日お疲れ様です！")
    ).toBeInTheDocument();
  });

  it.skip("should edit attendance", () => {});
  // 日付を指定したmockのattendanceを作成
  // 日付をしていした勤怠一覧取得のエンドポイントを叩く
  // 削除ボタンする
  it("should delete attendance", async () => {
    server.use(
      rest.delete(
        `${ApiHost}/accounts/${account.id}/attendances/${mockAttendanceForDelete.id}`,
        (req, res, ctx) => {
          return res(ctx.json(mockAttendance()));
        }
      )
    );
    customRender();
    const attendanceForDeleteRow = within(screen.getByRole("row", {name: /14/i}))
    userEvent.click(
      attendanceForDeleteRow.getByRole("button", { name: "削 除" })
    );
    await waitFor(() => screen.findByText("本当に削除しますか?"));
    userEvent.click(screen.getByRole("button", {name: "OK"}))
      await waitFor(() =>
        screen.findByText("勤怠を削除しました")
      );
      expect(
        screen.getByText("勤怠を削除しました")
      ).toBeInTheDocument();
  });
});
