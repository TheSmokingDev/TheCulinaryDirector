import { useState } from "react";
import { Alert, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import BrandButton from "../components/BrandButton";
import PageLayout from "../components/PageLayout";

interface RegisterValues {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values: RegisterValues) => {
    setError(null);
    setSubmitting(true);
    try {
      await register(values);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="mx-auto max-w-md px-6 py-20">
        <p className="brand-label mb-3 text-xs text-maroon">Members</p>
        <h1 className="mb-8 text-3xl font-medium tracking-tight">
          Create a free account
        </h1>

        {error && (
          <Alert className="!mb-6" type="error" showIcon message={error} />
        )}

        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="First name"
              name="first_name"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Jamie" />
            </Form.Item>
            <Form.Item
              label="Last name"
              name="last_name"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="Smith" />
            </Form.Item>
          </div>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email", message: "Enter a valid email" }]}
          >
            <Input placeholder="you@venue.com.au" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, min: 8, message: "At least 8 characters" }]}
          >
            <Input.Password placeholder="At least 8 characters" />
          </Form.Item>
          <BrandButton htmlType="submit" loading={submitting} block>
            Create account
          </BrandButton>
        </Form>

        <p className="mt-6 text-sm text-ink/70">
          Already a member?{" "}
          <Link to="/login" className="font-medium !text-maroon underline">
            Log in
          </Link>
        </p>
      </div>
    </PageLayout>
  );
}
