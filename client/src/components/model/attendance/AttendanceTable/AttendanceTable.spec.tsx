import {render, screen, waitFor} from "@testing-library/react";
import {setupServer} from "msw/node";
import {rest} from "msw";
import {ApiHost} from "constants/urls";
import {mockAttendance} from "api/attendance";
import {useManagement} from "pages/ManagementPage/useManagement";
import {mockAccount} from "api/account";
import userEvent from "@testing-library/user-event";
import {CurrentAccountContext} from "hooks/useCurrentAccount/CurrentAccountContext";
import {QueryClient, QueryClientProvider} from "react-query";
import {ReactNode} from "react";
import {AttendanceTable} from "./AttendanceTable";

// it("should match snapshot", () => {
//   const { container } = render(<AttendanceTable />, { wrapper: BrowserRouter });
//
//   // eslint-disable-next-line testing-library/no-node-access
//   expect(container.firstChild).toMatchSnapshot();
// });

describe("Attendance table", () => {
  const account = mockAccount({currentAttendance: null})
  const TestAttendanceTable = () => {
    const {selectedMonth, onChangeMonth, onUpdateAttendance, onAttendance, onDeleteAttendance} = useManagement()
    return (
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      <AttendanceTable selectedMonth={selectedMonth} onChangeMonth={onChangeMonth} onAttendance={onAttendance} onUpdateAttendance={onUpdateAttendance} onDeleteAttendance={onDeleteAttendance} />
    )
  }
  const server = setupServer(
    rest.get(`${ApiHost}/accounts/${account.id}/attendances`, (req, res, ctx) => {
      return res(
        ctx.json({
          attendances: [mockAttendance(), mockAttendance()],
        })
      );
    })
  );
  server.use(
    rest.post(`${ApiHost}/accounts/${account.id}/attendances`, (req, res, ctx) => {
      return res(ctx.json(mockAttendance()));
    })
  );
  server.use(
    rest.get(`${ApiHost}/accounts/${account.id}`, (req, res, ctx) => {
      return res(ctx.json(mockAccount()))
    })
  )

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  const queryClient = new QueryClient();
  const wrapper = ({ children }: {children: ReactNode}) => (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <CurrentAccountContext.Provider value={{account, setAccount: jest.fn}}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </CurrentAccountContext.Provider>
  );
  beforeEach(() => {
    render(<TestAttendanceTable />, {wrapper})
  })

  it.skip("should change month", () => {});

  it("should attendance", async () => {
    userEvent.click(screen.getByRole('button', {name: "出 勤"}));
    await waitFor(() => screen.findByText("出勤しました"))
    expect(screen.getByText("出勤しました")).toBeInTheDocument()
  });

  it.skip("should start break", () => {});

  it.skip("should finish break", () => {});

  it.skip("should finish work", () => {});

  it.skip("should edit attendance", () => {});
  it.skip("should delete attendance", () => {});
});
