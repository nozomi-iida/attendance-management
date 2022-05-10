import {FC, useState} from "react";
import {Button, notification} from "antd";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {LockOutlined} from "@ant-design/icons";
import {LoginForm, ProFormText} from "@ant-design/pro-form";
import {signUp} from "api/auth/signUp";
import {routes} from "constants/routes";
import {PersistKeys} from "constants/persistKeys";
import {useCurrentAccount} from "hooks/useCurrentAccount/useCurrentAccount";
import {useMutation} from "react-query";
import Logo from "assets/images/logo.png";

type SignUpFormData = {
  password: string;
  confirmationPassword: string;
};

export const SignUp: FC = () => {
  const { getAccount } = useCurrentAccount();
  const [password, setPassword] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {mutate} = useMutation(signUp, {
    onSuccess: async (data) => {
      console.log("onSuccess")
      localStorage.setItem(PersistKeys.AuthToken, data.token);
      await getAccount(data.account.id);
      navigate(routes.managements());
      notification.success({ message: "新規登録に成功しました" });
    }
  })
  return (
    <LoginForm<SignUpFormData>
      onFinish={async (params) => {
        const token = searchParams.get("token");
        console.log("token", token)
        if (token) {
          mutate({requestBody: {token, password: params.password}})
        } else {
          notification.error({
            message: "招待リンクからのみ新規登録を行うことができます",
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
