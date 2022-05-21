export type Attendance = {
  id: number;
  breakStartTime: string;
  workingTime: number;
  breakTime: number;
  startedAt: string;
  endedAt: string;
};

export const mockAttendance = (modification?: Attendance): Attendance => {
  return {
    id: 1,
    breakStartTime: new Date().toISOString(),
    workingTime: 180,
    breakTime: 30,
    startedAt: new Date().toISOString(),
    endedAt: new Date().toISOString(),
    ...modification,
  };
};
