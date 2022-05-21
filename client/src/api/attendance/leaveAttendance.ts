import { HttpClient } from "lib/axios";
import { Attendance } from "api/attendance";
import { MutationVariables } from "api/index";

export type LeaveAttendanceUrlParams = {
  accountId: number;
  id: number;
};

export type LeaveAttendanceRequestBody = {
  endedAt: string;
};

export async function leaveAttendance({
  urlParams,
  requestBody,
}: MutationVariables<LeaveAttendanceUrlParams, LeaveAttendanceRequestBody>) {
  const res = await HttpClient.patch<Attendance>(
    `/accounts/${urlParams.accountId}/attendances/${urlParams.id}/leave`,
    requestBody
  );
  return res.data;
}
