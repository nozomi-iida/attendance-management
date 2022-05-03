import { LoginForm, ProFormText } from "@ant-design/pro-form";
import { LockOutlined } from "@ant-design/icons";
import type { FC } from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/logo.png";

export const SignUpPage: FC = () => (
  <div>
    <LoginForm
      logo={Logo}
      title="SIMULA.Labs"
      subTitle="勤怠管理"
      submitter={{
        render: () => (
          <Button block type="primary">
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
        }}
        placeholder="パスワード"
        rules={[
          {
            required: true,
            message: "パスワードを入力してください！",
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
        rules={[
          {
            required: true,
            message: "パスワードを入力してください！",
          },
        ]}
      />
    </LoginForm>
  </div>
);
