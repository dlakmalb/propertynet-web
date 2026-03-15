'use client';

import { Typography, Card, Table, Button, Space, Input, Tag } from 'antd';
import type { TableProps } from 'antd';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

// Placeholder data - will be replaced with actual API data
interface Property {
  key: string;
  id: string;
  title: string;
  type: string;
  status: string;
  price: string;
  location: string;
  createdAt: string;
}

const placeholderData: Property[] = [
  {
    key: '1',
    id: 'PROP-001',
    title: 'Modern Apartment in Downtown',
    type: 'Apartment',
    status: 'Active',
    price: '$250,000',
    location: 'New York, NY',
    createdAt: '2024-01-15',
  },
  {
    key: '2',
    id: 'PROP-002',
    title: 'Luxury Villa with Pool',
    type: 'Villa',
    status: 'Pending',
    price: '$1,200,000',
    location: 'Miami, FL',
    createdAt: '2024-01-10',
  },
  {
    key: '3',
    id: 'PROP-003',
    title: 'Cozy Studio Near Beach',
    type: 'Studio',
    status: 'Active',
    price: '$120,000',
    location: 'San Diego, CA',
    createdAt: '2024-01-08',
  },
];

const columns: TableProps<Property>['columns'] = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 100,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    width: 100,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: (status: string) => (
      <Tag color={status === 'Active' ? 'green' : 'orange'}>{status}</Tag>
    ),
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    width: 120,
  },
  {
    title: 'Location',
    dataIndex: 'location',
    key: 'location',
    width: 150,
  },
  {
    title: 'Created',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 120,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 150,
    render: () => (
      <Space size="small">
        <Button type="text" icon={<Eye size={16} />} size="small" />
        <Button type="text" icon={<Edit size={16} />} size="small" />
        <Button type="text" danger icon={<Trash2 size={16} />} size="small" />
      </Space>
    ),
  },
];

export default function PropertiesPage() {
  const router = useRouter();

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Properties
        </Title>
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => router.push('/extranet/properties/new')}
        >
          Add Property
        </Button>
      </div>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search properties..."
            prefix={<Search size={16} />}
            style={{ width: '100%', maxWidth: 300 }}
          />
        </div>
        <Table
          columns={columns}
          dataSource={placeholderData}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
}
