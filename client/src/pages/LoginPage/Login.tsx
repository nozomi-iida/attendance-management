import { FC } from "react";
import { LoginForm, ProFormText } from "@ant-design/pro-form";
import { Button, notification } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { login, LoginRequestBody } from "api/auth/login";
import { routes } from "constants/routes";
import { PersistKeys } from "constants/persistKeys";
import { useCurrentAccount } from "hooks/useCurrentAccount/useCurrentAccount";
import { useMutation } from "react-query";
import Logo from "../../assets/images/logo.png";

export const Login: FC = () => {
  const { getAccount } = useCurrentAccount();
  const navigate = useNavigate();
  const { mutate } = useMutation(login, {
    onSuccess: async (data) => {
      localStorage.setItem(PersistKeys.AuthToken, data.token);
      await getAccount(data.account.id);
      navigate(routes.managements());
      notification.success({ message: "ログインしました" });
    },
  });
  return (
    <LoginForm<LoginRequestBody>
      onFinish={async (params) => {
        mutate({ requestBody: params });
      }}
      logo={Logo}
      title="SIMULA.Labs"
      subTitle="勤怠管理"
      submitter={{
        render: (props) => (
          <Button
            key="submit"
            block
            type="primary"
            // eslint-disable-next-line react/prop-types
            onClick={() => props.form?.submit?.()}
          >
            ログイン
          </Button>
        ),
      }}
    >
      <ProFormText
        name="email"
        fieldProps={{
          size: "large",
          prefix: <UserOutlined className="prefixIcon" />,
        }}
        placeholder="メールアドレス"
        rules={[
          {
            required: true,
            message: "メールアドレスを入力してください",
          },
          {
            pattern: /[a-zA-Z0-9._-]*@[a-zA-Z]*\.[a-zA-Z]{2,3}/,
            message: "正しいメールアドレスを入力してください",
          },
        ]}
      />
      <ProFormText.Password
        name="password"
        fieldProps={{
          size: "large",
          prefix: <LockOutlined className="prefixIcon" />,
        }}
        placeholder="パスワード"
        rules={[
          {
            required: true,
            message: "パスワードを入力してください",
          },
        ]}
      />
    </LoginForm>
  );
};
