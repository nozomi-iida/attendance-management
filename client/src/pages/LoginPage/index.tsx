import { LoginForm, ProFormText } from "@ant-design/pro-form";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import type { FC } from "react";
import { Button } from "antd";
import Logo from "../../assets/images/logo.png";

export const LoginPage: FC = () => (
  <div>
    <LoginForm
      logo={Logo}
      title="SIMULA.Labs"
      subTitle="勤怠管理"
      submitter={{
        render: () => (
          <Button key="submit" block type="primary">
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
            message: "メールアドレスを入力してください!",
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
            message: "パスワードを入力してください！",
          },
        ]}
      />
    </LoginForm>
  </div>
);
