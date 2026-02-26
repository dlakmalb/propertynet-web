'use client';

import { Card, Typography, Button, Space } from 'antd';
import styles from './page.module.css';

const { Title, Paragraph } = Typography;

export default function Home() {
  return (
    <main className={styles.container}>
      <Card className={styles.card}>
        <Space orientation="vertical" size={12} style={{ width: '100%' }}>
          <Title level={1} style={{ margin: 0 }}>
            Propertynet
          </Title>

          <Paragraph type="secondary" style={{ margin: 0 }}>
            Find properties, compare locations, and manage listings - coming soon.
          </Paragraph>

          <Space style={{ justifyContent: 'center', width: '100%', marginTop: 8 }}>
            <Button type="primary" href="/extranet/login">
              Sign in
            </Button>
          </Space>
        </Space>
      </Card>
    </main>
  );
}
