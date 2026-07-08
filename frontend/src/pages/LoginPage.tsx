import { useState } from "react";
import { Alert, Form, Input } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import BrandButton from "../components/BrandButton";
import PageLayout from "../components/PageLayout";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const onFinish = async (values: { email: string; password: string }) => {
    setError(null);
    setSubmitting(true);
    try {
      await login(values.email, values.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="mx-auto max-w-md px-6 py-20">
        <p className="brand-label mb-3 text-xs text-maroon">Members</p>
        <h1 className="mb-8 text-3xl font-medium tracking-tight">
          Log in to your tools
        </h1>

        {error && (
          <Alert className="!mb-6" type="error" showIcon message={error} />
        )}

        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email", message: "Enter your email" }]}
          >
            <Input placeholder="you@venue.com.au" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Enter your password" }]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>
          <BrandButton htmlType="submit" loading={submitting} block>
            Log in
          </BrandButton>
        </Form>

        <p className="mt-6 text-sm text-ink/70">
          No account yet?{" "}
          <Link to="/register" className="font-medium !text-maroon underline">
            Create a free account
          </Link>
        </p>
      </div>
    </PageLayout>
  );
}
