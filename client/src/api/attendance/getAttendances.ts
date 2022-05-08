import { HttpClient } from "lib/axios";
import { Attendance } from "api/attendance/index";
import { QueryVariables } from "api/index";

type IndexAttendancesQueryParams = {
  month: string;
};

export async function getAttendances({
  urlParams,
  queryParams,
}: QueryVariables<{ accountId: number }, IndexAttendancesQueryParams>) {
  const res = await HttpClient.get<{ attendances: Attendance[] }>(
    `accounts/${urlParams.accountId}/attendances`,
    {
      params: queryParams,
    }
  );
  return res.data;
}
