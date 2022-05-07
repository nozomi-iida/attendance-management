import { HttpClient } from "lib/axios";
import { MutationVariables } from "api/index";
import { Attendance } from ".";

export async function createAttendance({
  urlParams,
}: MutationVariables<{ id: number }, undefined>) {
  const res = await HttpClient.post<Attendance>(
    `/accounts/${urlParams.id}/attendances`
  );
  return res.data;
}
