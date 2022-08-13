import { FC, MouseEvent, useEffect } from "react";
import { Form, Modal, ModalProps } from "antd";
import { LightningTalkForm } from "components/model/lightningTalk/LightningTalkForm/LightningTalkForm";
import { CreateLightningTalkRequestBody } from "api/lightningTalk/createLightningTalk";
import moment from "moment";

type CreateLightningTalkModalProps = ModalProps & { talkDate: string };

export const CreateLightningTalkModal: FC<CreateLightningTalkModalProps> = ({
  talkDate,
  onCancel: onCancelProps,
  ...props
}) => {
  const [form] = Form.useForm();
  const onSubmit = async (params: CreateLightningTalkRequestBody) => {
    console.log(params);
  };

  const onCancel = (e: MouseEvent<HTMLElement>) => {
    onCancelProps?.(e);
  };

  useEffect(() => {
    form.resetFields();

    // eslint-disable-next-line
  }, [props.visible]);

  return (
    <Modal {...props} onOk={() => form.submit()} onCancel={onCancel}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{ talkDay: moment(talkDate) }}
        onFinish={async (params) => {
          await onSubmit(params);
        }}
      >
        <LightningTalkForm />
      </Form>
    </Modal>
  );
};
