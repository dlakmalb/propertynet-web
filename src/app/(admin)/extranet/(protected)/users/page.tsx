'use client';

import { Typography, Card, Table, Button, Space, Input, Tag, Avatar, Dropdown } from 'antd';
import type { TableProps, MenuProps } from 'antd';
import { Plus, Search, MoreVertical, Edit, Trash2, Lock, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

interface User {
  key: string;
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  createdAt: string;
}

const placeholderData: User[] = [
  {
    key: '1',
    id: 'USR-001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2024-01-20 09:30',
    createdAt: '2024-01-01',
  },
  {
    key: '2',
    id: 'USR-002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Editor',
    status: 'Active',
    lastLogin: '2024-01-19 14:20',
    createdAt: '2024-01-05',
  },
  {
    key: '3',
    id: 'USR-003',
    name: 'Mike Johnson',
    email: 'mike.j@example.com',
    role: 'Viewer',
    status: 'Inactive',
    lastLogin: '2024-01-10 11:00',
    createdAt: '2024-01-08',
  },
  {
    key: '4',
    id: 'USR-004',
    name: 'Sarah Wilson',
    email: 'sarah.w@example.com',
    role: 'Editor',
    status: 'Active',
    lastLogin: '2024-01-20 08:15',
    createdAt: '2024-01-10',
  },
];

const getActionMenuItems = (): MenuProps['items'] => [
  {
    key: 'edit',
    icon: <Edit size={14} />,
    label: 'Edit User',
  },
  {
    key: 'reset-password',
    icon: <Lock size={14} />,
    label: 'Reset Password',
  },
  {
    key: 'send-email',
    icon: <Mail size={14} />,
    label: 'Send Email',
  },
  {
    type: 'divider',
  },
  {
    key: 'delete',
    icon: <Trash2 size={14} />,
    label: 'Delete User',
    danger: true,
  },
];

const getRoleColor = (role: string) => {
  switch (role) {
    case 'Admin':
      return 'red';
    case 'Editor':
      return 'blue';
    case 'Viewer':
      return 'default';
    default:
      return 'default';
  }
};

const columns: TableProps<User>['columns'] = [
  {
    title: 'User',
    key: 'user',
    render: (_, record) => (
      <Space>
        <Avatar style={{ backgroundColor: '#1677ff' }}>
          {record.name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </Avatar>
        <div>
          <div style={{ fontWeight: 500 }}>{record.name}</div>
          <div style={{ fontSize: 12, color: '#888' }}>{record.email}</div>
        </div>
      </Space>
    ),
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    width: 100,
    render: (role: string) => <Tag color={getRoleColor(role)}>{role}</Tag>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: (status: string) => (
      <Tag color={status === 'Active' ? 'green' : 'default'}>{status}</Tag>
    ),
  },
  {
    title: 'Last Login',
    dataIndex: 'lastLogin',
    key: 'lastLogin',
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
    width: 80,
    align: 'center',
    render: () => (
      <Dropdown menu={{ items: getActionMenuItems() }} trigger={['click']}>
        <Button type="text" icon={<MoreVertical size={16} />} />
      </Dropdown>
    ),
  },
];

export default function UsersPage() {
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
          Users
        </Title>
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => router.push('/extranet/users/new')}
        >
          Add User
        </Button>
      </div>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search users..."
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
