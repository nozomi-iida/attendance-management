import { FC, useState } from "react";
import { Button, notification } from "antd";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LockOutlined } from "@ant-design/icons";
import { LoginForm, ProFormText } from "@ant-design/pro-form";
import { signUp } from "api/auth/signUp";
import { routes } from "constants/routes";
import { PersistKeys } from "constants/persistKeys";
import { useCurrentAccount } from "hooks/useCurrentAccount/useCurrentAccount";
import Logo from "../../assets/images/logo.png";

type SignUpFormData = {
  password: string;
  confirmationPassword: string;
};

export const SignUp: FC = () => {
  const { getAccount } = useCurrentAccount();
  const [password, setPassword] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  return (
    <LoginForm<SignUpFormData>
      onFinish={async (params) => {
        const token = searchParams.get("token");
        if (token) {
          signUp({ token, password: params.password }).then((data) => {
            notification.success({ message: "新規登録に成功しました" });
            localStorage.setItem(PersistKeys.AuthToken, data.token);
            navigate(routes.managements());
            // FIXME
            // getAccount();
          });
        }
      }}
      logo={Logo}
      title="SIMULA.Labs"
      subTitle="勤怠管理"
      submitter={{
        render: (props) => (
          // eslint-disable-next-line react/prop-types
          <Button block type="primary" onClick={() => props.form?.submit?.()}>
            新規登録
          </Button>
        ),
      }}
      actions={<Link to="/login">ログインページへ</Link>}
    >
      <ProFormText.Password
        name="password"
        fieldProps={{
          size: "large",
          prefix: <LockOutlined className="prefixIcon" />,
          onChange: (e) => setPassword(e.target.value),
          value: password,
        }}
        placeholder="パスワード"
        rules={[
          {
            required: true,
            message: "パスワードを入力してください",
          },
        ]}
      />
      <ProFormText.Password
        name="confirmationPassword"
        fieldProps={{
          size: "large",
          prefix: <LockOutlined className="prefixIcon" />,
        }}
        placeholder="パスワード(確認用)"
        validateTrigger="onSubmit"
        rules={[
          {
            required: true,
            message: "パスワード(確認用)を入力してください",
          },
          {
            pattern: new RegExp(password),
            message: "パスワードが一致していません",
          },
        ]}
      />
    </LoginForm>
  );
};
