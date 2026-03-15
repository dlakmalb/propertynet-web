'use client';

import { Alert, Button, Card, Checkbox, Form, Input, Space, Typography } from 'antd';
import styles from './adminLoginForm.module.css';
import { Lock, User } from 'lucide-react';
import { useState } from 'react';
import { login } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/lib/api/client';
import { meQueryKey } from '@/modules/auth/hooks/useMe';
import { useQueryClient } from '@tanstack/react-query';

type LoginFormValues = {
  email: string;
  password: string;
  remember?: boolean;
};

export default function AdminLoginForm() {
  const router = useRouter();
  const qc = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm<LoginFormValues>();

  const clearErrors = () => {
    if (error) setError(null);

    form.setFields([
      { name: 'email', errors: [] },
      { name: 'password', errors: [] },
    ]);
  };

  const onFinish = async (values: LoginFormValues) => {
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await login(values.email, values.password);
      qc.setQueryData(meQueryKey, res.user);
      router.replace('/extranet/dashboard');
    } catch (e: unknown) {
      if (e instanceof ApiError) {
        if (e.status === 401) {
          setError('Invalid credentials. Please check your email and password.');
          form.setFields([
            { name: 'email', errors: [' '] },
            { name: 'password', errors: [' '] },
          ]);
          return;
        }
        setError(e.message);
        return;
      }

      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.container}>
      <Card className={styles.card}>
        <Space orientation="vertical" size={16} style={{ width: '100%' }}>
          <div className={styles.header}>
            <Typography.Title level={2} style={{ margin: 0 }}>
              Admin Login
            </Typography.Title>
          </div>

          {error ? <Alert type="error" showIcon title={error} /> : null}

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            onValuesChange={clearErrors}
          >
            <Form.Item name="email" rules={[{ required: true, message: 'Please enter email' }]}>
              <Input
                disabled={submitting}
                size="large"
                placeholder="Enter your Email"
                prefix={<User size={16} />}
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please enter password' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <Input.Password
                disabled={submitting}
                size="large"
                placeholder="Enter your Password"
                prefix={<Lock size={16} />}
                autoComplete="current-password"
              />
            </Form.Item>

            <div className={styles.row}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox disabled={submitting}>Remember me</Checkbox>
              </Form.Item>
              <Typography.Link href="#">Forgot password?</Typography.Link>
            </div>

            <Button type="primary" htmlType="submit" size="large" block loading={submitting}>
              Login
            </Button>
          </Form>
        </Space>
      </Card>
    </main>
  );
}
