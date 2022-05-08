import { HttpClient } from "lib/axios";
import { MutationVariables } from "api/index";

export type DeleteAttendanceUrlParams = {
  accountId: number;
  id: number;
};

export async function deleteAttendance({
  urlParams,
}: MutationVariables<DeleteAttendanceUrlParams, undefined>) {
  await HttpClient.delete(
    `/accounts/${urlParams.accountId}/attendances/${urlParams.id}`
  );
}
