'use client';

import { Typography, Card, Table, Button, Space, Input, Tag, Modal } from 'antd';
import type { TableProps } from 'antd';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

const { Title } = Typography;

interface Category {
  key: string;
  id: string;
  name: string;
  slug: string;
  description: string;
  propertyCount: number;
  status: string;
}

const placeholderData: Category[] = [
  {
    key: '1',
    id: 'CAT-001',
    name: 'Residential',
    slug: 'residential',
    description: 'Residential properties including houses and apartments',
    propertyCount: 45,
    status: 'Active',
  },
  {
    key: '2',
    id: 'CAT-002',
    name: 'Commercial',
    slug: 'commercial',
    description: 'Commercial properties for business use',
    propertyCount: 23,
    status: 'Active',
  },
  {
    key: '3',
    id: 'CAT-003',
    name: 'Land',
    slug: 'land',
    description: 'Raw land and plots',
    propertyCount: 12,
    status: 'Active',
  },
  {
    key: '4',
    id: 'CAT-004',
    name: 'Luxury',
    slug: 'luxury',
    description: 'Premium luxury properties',
    propertyCount: 8,
    status: 'Active',
  },
];

const columns: TableProps<Category>['columns'] = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 100,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 150,
  },
  {
    title: 'Slug',
    dataIndex: 'slug',
    key: 'slug',
    width: 120,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Properties',
    dataIndex: 'propertyCount',
    key: 'propertyCount',
    width: 100,
    align: 'center',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: (status: string) => <Tag color={status === 'Active' ? 'green' : 'red'}>{status}</Tag>,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 120,
    render: () => (
      <Space size="small">
        <Button type="text" icon={<Edit size={16} />} size="small" />
        <Button type="text" danger icon={<Trash2 size={16} />} size="small" />
      </Space>
    ),
  },
];

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          Property Categories
        </Title>
        <Button type="primary" icon={<Plus size={16} />} onClick={() => setIsModalOpen(true)}>
          Add Category
        </Button>
      </div>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search categories..."
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

      <Modal
        title="Add New Category"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      >
        <p>Category form will be implemented here.</p>
      </Modal>
    </div>
  );
}
