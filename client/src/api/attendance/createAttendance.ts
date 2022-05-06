import { HttpClient } from "lib/axios";
import { Attendance } from ".";

export async function createAttendance(id: string) {
  const res = await HttpClient.post<Attendance>(`/accounts/${id}/attendances`);
  return res.data;
}
