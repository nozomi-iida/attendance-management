import { FC } from "react";
import { LoginForm, ProFormText } from "@ant-design/pro-form";
import { Button, notification } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { login, LoginRequestBody } from "api/auth/login";
import { routes } from "constants/routes";
import { PersistKeys } from "constants/persistKeys";
import { useCurrentAccount } from "hooks/useCurrentAccount/useCurrentAccount";
import Logo from "../../assets/images/logo.png";

export const Login: FC = () => {
  const { getAccount } = useCurrentAccount();
  const navigate = useNavigate();
  return (
    <LoginForm<LoginRequestBody>
      onFinish={async (params) => {
        login(params).then((data) => {
          notification.success({ message: "ログインしました" });
          localStorage.setItem(PersistKeys.AuthToken, data.token);
          navigate(routes.managements());
          // getAccount();
        });
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
