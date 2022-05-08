import { Attendance, mockAttendance } from "api/attendance";

export enum AccountRole {
  GENERAL = "general",
  ADMIN = "admin",
}

export type Account = {
  id: number;
  handleName: string;
  email: string;
  role: AccountRole;
  currentAttendance: Attendance | null;
};

export const mockAccount = (modification?: Partial<Account>): Account => {
  return {
    id: 1,
    handleName: "test",
    email: "test@test.com",
    role: AccountRole.GENERAL,
    currentAttendance: mockAttendance(),
    ...modification,
  };
};
