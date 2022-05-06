export type Attendance = {
  id: number;
  isBreak: boolean;
  workingTime: number;
  breakTime: number;
  startedAt: Date;
  endedAt: Date;
};

export const mockAttendance = (modification?: Attendance): Attendance => {
  return {
    id: 1,
    isBreak: false,
    workingTime: 180,
    breakTime: 30,
    startedAt: new Date(),
    endedAt: new Date(),
    ...modification,
  };
};
