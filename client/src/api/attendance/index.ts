export type Attendance = {
  id: number;
  breakStartTime: string | null;
  workTime: number;
  breakTime: number;
  startedAt: string;
  endedAt: string | null;
};

export const mockAttendance = (
  modification?: Partial<Attendance>
): Attendance => {
  return {
    id: 1,
    breakStartTime: null,
    workTime: 180,
    breakTime: 30,
    startedAt: new Date().toISOString(),
    endedAt: null,
    ...modification,
  };
};
