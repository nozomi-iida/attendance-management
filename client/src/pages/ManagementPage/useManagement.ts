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

export const useManagement = () => {
  const { account } = useCurrentAccount();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const { data, refetch } = useQuery(["attendances", selectedMonth], () =>
    getAttendances({ month: selectedMonth })
  );
  const { mutate: updateMutate } = useMutation(updateAttendance, {
    onSuccess: async () => {
      notification.success({ message: "勤怠を更新しました" });
      await refetch();
    },
  });
  const { mutate: deleteMutate } = useMutation(deleteAttendance, {
    onSuccess: async () => {
      notification.success({ message: "勤怠を削除しました" });
      await refetch();
    },
  });
  const { mutate: createMutate } = useMutation(createAttendance, {
    onSuccess: async () => {
      notification.success({ message: "出勤しました" });
      await refetch();
    },
  });

  const onChangeMonth = (month: Date) => {
    setSelectedMonth(month);
  };
  const onAttendance = () => {
    if (!account) return;
    createMutate({ urlParams: { id: account.id } });
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
    onChangeMonth,
    onAttendance,
    onUpdateAttendance,
    onDeleteAttendance,
  };
};
