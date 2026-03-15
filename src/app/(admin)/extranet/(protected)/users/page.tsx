'use client';

import { useState, useMemo } from 'react';
import {
  Typography,
  Card,
  Table,
  Button,
  Space,
  Input,
  Tag,
  Avatar,
  Dropdown,
  message,
  Popconfirm,
  Checkbox,
} from 'antd';
import type { TableProps, MenuProps, TablePaginationConfig } from 'antd';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { Plus, Search, MoreVertical, Edit, Trash2, Lock, Mail, Settings2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUsers, useDeleteUser } from '@/modules/admin/hooks/useUsers';
import type { User, UserFilters, UserRole, UserStatus } from '@/lib/api/users';

const { Title } = Typography;

const roleOptions: { text: string; value: UserRole }[] = [
  { text: 'Admin', value: 'admin' },
  { text: 'Editor', value: 'editor' },
  { text: 'Viewer', value: 'viewer' },
];

const statusOptions: { text: string; value: UserStatus }[] = [
  { text: 'Active', value: 'active' },
  { text: 'Inactive', value: 'inactive' },
];

const getRoleColor = (role: UserRole): string => {
  const colors: Record<UserRole, string> = {
    admin: 'red',
    editor: 'blue',
    viewer: 'default',
  };
  return colors[role] || 'default';
};

const getStatusColor = (status: UserStatus): string => {
  return status === 'active' ? 'green' : 'default';
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatDateTime = (dateString?: string): string => {
  if (!dateString) return 'Never';
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function UsersPage() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 10,
  });
  const [searchValue, setSearchValue] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'user',
    'role',
    'status',
    'lastLoginAt',
    'createdAt',
    'actions',
  ]);

  const { data, isLoading, error } = useUsers(filters);
  const deleteUser = useDeleteUser();

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    tableFilters: Record<string, FilterValue | null>,
    sorter: SorterResult<User> | SorterResult<User>[],
  ) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    setFilters((prev) => ({
      ...prev,
      page: pagination.current || 1,
      limit: pagination.pageSize || 10,
      role: (tableFilters.role?.[0] as UserRole) || undefined,
      status: (tableFilters.status?.[0] as UserStatus) || undefined,
      sortBy: singleSorter?.field as string | undefined,
      sortOrder: singleSorter?.order === 'ascend' ? 'ASC' : singleSorter?.order === 'descend' ? 'DESC' : undefined,
    }));
  };

  const toggleColumn = (columnKey: string) => {
    setVisibleColumns((prev) =>
      prev.includes(columnKey) ? prev.filter((k) => k !== columnKey) : [...prev, columnKey],
    );
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser.mutateAsync(id);
      messageApi.success('User deleted successfully');
    } catch {
      messageApi.error('Failed to delete user');
    }
  };

  const getActionMenuItems = (user: User): MenuProps['items'] => [
    {
      key: 'edit',
      icon: <Edit size={14} />,
      label: 'Edit User',
      onClick: () => router.push(`/extranet/users/${user.id}/edit`),
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
      onClick: () => handleDelete(user.id),
    },
  ];

  const allColumns: TableProps<User>['columns'] = useMemo(
    () => [
      {
        title: 'User',
        key: 'user',
        render: (_, record) => (
          <Space>
            <Avatar style={{ backgroundColor: '#1677ff' }}>
              {record.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
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
        filters: roleOptions,
        filterMultiple: false,
        filteredValue: filters.role ? [filters.role] : null,
        render: (role: UserRole) => (
          <Tag color={getRoleColor(role)}>{role.toUpperCase()}</Tag>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        filters: statusOptions,
        filterMultiple: false,
        filteredValue: filters.status ? [filters.status] : null,
        render: (status: UserStatus) => (
          <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
        ),
      },
      {
        title: 'Last Login',
        dataIndex: 'lastLoginAt',
        key: 'lastLoginAt',
        width: 180,
        sorter: true,
        render: (date?: string) => formatDateTime(date),
      },
      {
        title: 'Created',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 120,
        sorter: true,
        render: (date: string) => formatDate(date),
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 80,
        align: 'center',
        fixed: 'right' as const,
        render: (_, record) => (
          <Dropdown menu={{ items: getActionMenuItems(record) }} trigger={['click']}>
            <Button type="text" icon={<MoreVertical size={16} />} />
          </Dropdown>
        ),
      },
    ],
    [filters.role, filters.status],
  );

  // Column labels for visibility dropdown
  const columnLabels: Record<string, string> = {
    user: 'User',
    role: 'Role',
    status: 'Status',
    lastLoginAt: 'Last Login',
    createdAt: 'Created',
    actions: 'Actions',
  };

  // Filter columns based on visibility
  const columns = useMemo(
    () => allColumns?.filter((col) => col.key && visibleColumns.includes(col.key as string)) ?? [],
    [allColumns, visibleColumns],
  );

  if (error) {
    return (
      <Card>
        <Typography.Text type="danger">
          Failed to load users: {error.message}
        </Typography.Text>
      </Card>
    );
  }

  return (
    <div>
      {contextHolder}
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
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <Input.Search
            placeholder="Search users..."
            prefix={<Search size={16} />}
            style={{ width: '100%', maxWidth: 300 }}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={handleSearch}
            allowClear
            enterButton
          />
          <Dropdown
            trigger={['click']}
            dropdownRender={() => (
              <Card size="small" style={{ width: 200 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {Object.entries(columnLabels).map(([key, label]) => (
                    <Checkbox
                      key={key}
                      checked={visibleColumns.includes(key)}
                      onChange={() => toggleColumn(key)}
                      disabled={key === 'actions'}
                    >
                      {label}
                    </Checkbox>
                  ))}
                </div>
              </Card>
            )}
          >
            <Button icon={<Settings2 size={16} />}>Columns</Button>
          </Dropdown>
        </div>
        <Table
          columns={columns}
          dataSource={data?.items}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: data?.meta.currentPage || filters.page,
            pageSize: data?.meta.itemsPerPage || filters.limit,
            total: data?.meta.totalItems,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} users`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
}
