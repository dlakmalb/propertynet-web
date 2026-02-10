import { Card } from 'antd';
import styles from './page.module.css';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';

export default function Home() {
  return (
    <main className={styles.container}>
      <Card className={styles.card}>
        <Title style={{ marginBottom: 8 }}>Propertynet</Title>

        <Paragraph type="secondary">Next.js 16 + Ant Design </Paragraph>
      </Card>
    </main>
  );
}
