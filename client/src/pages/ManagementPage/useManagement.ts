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
  const { mutate: createMutate } = useMutation(createAttendance, {
    onSuccess: async () => {
      notification.success({ message: "出勤しました" });
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
  const onDeleteAttendance = async (id: number) => {
    if (!account) return;
    deleteMutate({ urlParams: { id, accountId: account.id } });
  };

  return {
    attendances: data?.attendances,
    selectedMonth,
    onChangeMonth,
    onAttendance,
    onUpdateAttendance,
    onDeleteAttendance,
  };
};
