import { HttpClient } from "lib/axios";
import { MutationVariables } from "api/index";
import { Attendance } from ".";

export async function createAttendance({
  urlParams,
}: MutationVariables<{ accountId: number }, undefined>) {
  const res = await HttpClient.post<Attendance>(
    `accounts/${urlParams.accountId}/attendances`
  );
  return res.data;
}
