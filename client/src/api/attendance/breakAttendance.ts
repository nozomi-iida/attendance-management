import { HttpClient } from "lib/axios";
import { Attendance } from "api/attendance";
import { MutationVariables } from "api/index";

export type BreakAttendanceUrlParams = {
  accountId: number;
  id: number;
};

export type BreakAttendanceRequestBody = {
  breakStartTime?: string;
  breakEndTime?: string;
};

export async function breakAttendance({
  urlParams,
  requestBody,
}: MutationVariables<BreakAttendanceUrlParams, BreakAttendanceRequestBody>) {
  const res = await HttpClient.patch<Attendance>(
    `/accounts/${urlParams.accountId}/attendances/${urlParams.id}/break`,
    requestBody
  );
  return res.data;
}
