import { HttpClient } from "lib/axios";
import { Attendance } from "api/attendance/index";

type IndexAttendancesQueryParams = {
  month: Date;
};

export async function getAttendances(queryParams: IndexAttendancesQueryParams) {
  // FIXME: accountIdを取ったほうが良いかも
  const res = await HttpClient.get<Attendance[]>("/attendances", {
    params: queryParams,
  });
  return { attendances: res.data };
}
