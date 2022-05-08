import { HttpClient } from "lib/axios";
import { Attendance } from "api/attendance/index";

type IndexAttendancesQueryParams = {
  month: string;
};

export async function getAttendances(queryParams: IndexAttendancesQueryParams) {
  // FIXME: accountIdを取ったほうが良いかも
  const res = await HttpClient.get<{attendances: Attendance[]}>("/attendances", {
    params: queryParams,
  });
  return res.data;
}
