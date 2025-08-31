import React from "react";
import type { FormProps } from "antd";
import { App, Button, Checkbox, Form, Input } from "antd";
import "@/pages/auth/login.scss";
import { loginApi } from "@/services/api";
import { useNavigate } from "react-router";
import { useCurrentApp } from "components/context/app.context";

type FieldType = {
  email?: string;
  password?: string;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useCurrentApp();
  const { message, notification } = App.useApp();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { email, password } = values;
    const res = await loginApi(email as string, password as string);

    if (res.data) {
      const access_token = res.data.access_token;
      message.success("Đăng nhập thành công");
      localStorage.setItem("access_token", access_token);
      navigate("/");
      setUser(res.data.user);
      setIsAuthenticated(true);
    } else {
      notification.error({
        message: "Lỗi đăng nhập",
        description: res.message || "Vui lòng thử lại sau.",
      });
    }
  };
  return (
    <div className="login-container">
      <div className="login-header">
        <h1>Đăng Nhập</h1>
      </div>
      <Form
        name="basic"
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "The input is not valid E-mail!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
