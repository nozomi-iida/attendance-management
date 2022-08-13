import { FC } from "react";
import { DatePicker, Form, Input } from "antd";

export const LightningTalkForm: FC = () => {
  return (
    <>
      <Form.Item label="発表日" name="talkDay" required>
        <DatePicker placeholder="" showNow={false} />
      </Form.Item>
      <Form.Item label="タイトル" name="title" required>
        <Input />
      </Form.Item>
      <Form.Item label="メモ" name="description">
        <Input.TextArea rows={10} />
      </Form.Item>
    </>
  );
};
