import { Button, Result } from "antd";
import { useCurrentApp } from "../context/app.context";
import { useNavigate } from "react-router";

interface IProp {
  children: React.ReactNode;
}

const ProtectedRoute = (props: IProp) => {
  const { isAuthenticated } = useCurrentApp();
  const navigate = useNavigate();
  if (!isAuthenticated) {
    return (
      <Result
        style={{ marginTop: -64 }}
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={() => navigate("/login")}>
            Login
          </Button>
        }
      />
    );
  }
  return <>{props.children}</>;
};

export default ProtectedRoute;
