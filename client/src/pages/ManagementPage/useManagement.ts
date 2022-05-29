import { useMutation, useQuery } from "react-query";
import { getAttendances } from "api/attendance/getAttendances";
import { useState } from "react";
import {
  updateAttendance,
  UpdateAttendanceRequestBody,
} from "api/attendance/updateAttendance";
import { useCurrentAccount } from "hooks/useCurrentAccount/useCurrentAccount";
import { notification } from "antd";
import { deleteAttendance } from "api/attendance/deleteAttendance";
import { createAttendance } from "api/attendance/createAttendance";
import moment, { Moment } from "moment";
import {
  leaveAttendance,
  LeaveAttendanceRequestBody,
} from "api/attendance/leaveAttendance";
import {breakAttendance} from "api/attendance/breakAttendance";

export const useManagement = () => {
  const { account, getAccount } = useCurrentAccount();
  const [selectedMonth, setSelectedMonth] = useState(moment(new Date()));
  const { data, refetch } = useQuery(["attendances", selectedMonth], () =>
    getAttendances({
      urlParams: { accountId: account?.id ?? 0 },
      queryParams: { month: selectedMonth.format("YYYY-MM") },
    })
  );

  const { mutate: updateMutate } = useMutation(updateAttendance, {
    onSuccess: async () => {
      notification.success({ message: "勤怠を更新しました" });
      await getAccount();
      await refetch();
    },
  });
  const { mutate: leaveMutate } = useMutation(leaveAttendance, {
    onSuccess: async () => {
      notification.success({
        message: "退勤しました。今日も一日お疲れ様です！",
      });
      await getAccount();
      await refetch();
    },
  });
  const { mutate: createMutate } = useMutation(createAttendance, {
    onSuccess: async () => {
      notification.success({ message: "出勤しました" });
      await getAccount();
      await refetch();
    },
  });
  const { mutate: breakMutate } = useMutation(breakAttendance, {
    onSuccess: async () => {
      notification.success({ message: "休憩を開始しました" });
      await getAccount();
      await refetch();
    },
  });

  const { mutate: deleteMutate } = useMutation(deleteAttendance, {
    onSuccess: async () => {
      notification.success({ message: "勤怠を削除しました" });
      await getAccount();
      await refetch();
    },
  });

  const onChangeMonth = (month: Moment) => {
    setSelectedMonth(month);
  };

  const onAttendance = () => {
    if (!account) return;

    createMutate({ urlParams: { accountId: account.id } });
  };

  const onUpdateAttendance = async (
    id: number,
    params: UpdateAttendanceRequestBody
  ) => {
    if (!account) return;
    updateMutate({
      urlParams: { id, accountId: account.id },
      requestBody: params,
    });
  };

  const onLeaveAttendance = () => {
    if (!account?.currentAttendance) return;

    leaveMutate({
      urlParams: { accountId: account.id, id: account.currentAttendance.id },
      requestBody: {
        endedAt: new Date().toISOString(),
      },
    });
  };

  const onDeleteAttendance = async (id: number) => {
    if (!account) return;
    deleteMutate({ urlParams: { id, accountId: account.id } });
  };

  const onStartBreakAttendance = async () => {
    if(!account?.currentAttendance) return;
    await breakMutate({urlParams: {accountId: account.id, id: account.currentAttendance.id}, requestBody: {breakStartTime: new Date().toISOString()}})
  }

  return {
    attendances: data?.attendances,
    selectedMonth,
    onChangeMonth,
    onAttendance,
    onUpdateAttendance,
    onDeleteAttendance,
    onLeaveAttendance,
    onStartBreakAttendance
  };
};
