import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { ApiHost } from "constants/urls";
import { mockAttendance } from "api/attendance";
import { AttendanceTable } from "./AttendanceTable";

// it("should match snapshot", () => {
//   const { container } = render(<AttendanceTable />, { wrapper: BrowserRouter });
//
//   // eslint-disable-next-line testing-library/no-node-access
//   expect(container.firstChild).toMatchSnapshot();
// });

describe("Attendance table", () => {
  const server = setupServer(
    rest.get(`${ApiHost}/attendances`, (req, res, ctx) => {
      return res(
        ctx.json({
          attendances: [mockAttendance(), mockAttendance()],
        })
      );
    })
  );
  server.use(
    rest.post(`${ApiHost}/attendances`, (req, res, ctx) => {
      return res(ctx.json(mockAttendance()));
    })
  );

  beforeAll(() => {
    server.listen();
  });
  afterAll(() => {
    server.close();
  });

  it("should change month", () => {});

  it("should attendance", () => {});

  it("should start break", () => {});

  it("should finish break", () => {});

  it("should finish work", () => {});

  it("should edit attendance", () => {});
  it("should delete attendance", () => {});
});
