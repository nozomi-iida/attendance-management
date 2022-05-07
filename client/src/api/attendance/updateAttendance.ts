import { HttpClient } from "lib/axios";
import { Attendance } from "api/attendance";
import { MutationVariables } from "api/index";

export type UpdateAttendanceUrlParams = {
  accountId: number;
  id: number;
};

export type UpdateAttendanceRequestBody = Partial<Attendance>;

export async function updateAttendance({
  urlParams,
  requestBody,
}: MutationVariables<UpdateAttendanceUrlParams, UpdateAttendanceRequestBody>) {
  const res = await HttpClient.patch<Attendance>(
    `/accounts/${urlParams.accountId}/attendances/${urlParams.id}`,
    requestBody
  );
  return res.data;
}
