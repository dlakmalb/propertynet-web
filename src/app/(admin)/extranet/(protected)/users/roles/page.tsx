'use client';

import { Typography, Card, Table, Button, Space, Tag, Modal, Switch, Collapse } from 'antd';
import type { TableProps } from 'antd';
import { Plus, Edit, Trash2, Shield, Check, X } from 'lucide-react';
import { useState } from 'react';

const { Title, Text } = Typography;
const { Panel } = Collapse;

interface Role {
  key: string;
  id: string;
  name: string;
  description: string;
  userCount: number;
  isSystem: boolean;
  permissions: string[];
}

const placeholderData: Role[] = [
  {
    key: '1',
    id: 'ROLE-001',
    name: 'Admin',
    description: 'Full system access with all permissions',
    userCount: 2,
    isSystem: true,
    permissions: ['all'],
  },
  {
    key: '2',
    id: 'ROLE-002',
    name: 'Editor',
    description: 'Can manage properties and content',
    userCount: 5,
    isSystem: false,
    permissions: ['properties.read', 'properties.write', 'categories.read', 'categories.write'],
  },
  {
    key: '3',
    id: 'ROLE-003',
    name: 'Viewer',
    description: 'Read-only access to properties',
    userCount: 10,
    isSystem: false,
    permissions: ['properties.read', 'categories.read'],
  },
];

const allPermissions = {
  properties: ['read', 'write', 'delete'],
  categories: ['read', 'write', 'delete'],
  users: ['read', 'write', 'delete'],
  settings: ['read', 'write'],
};

const columns: TableProps<Role>['columns'] = [
  {
    title: 'Role',
    key: 'role',
    render: (_, record) => (
      <Space>
        <Shield size={18} style={{ color: record.isSystem ? '#ff4d4f' : '#1677ff' }} />
        <div>
          <div style={{ fontWeight: 500 }}>
            {record.name}
            {record.isSystem && (
              <Tag color="red" style={{ marginLeft: 8 }}>
                System
              </Tag>
            )}
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.description}
          </Text>
        </div>
      </Space>
    ),
  },
  {
    title: 'Users',
    dataIndex: 'userCount',
    key: 'userCount',
    width: 100,
    align: 'center',
    render: (count: number) => <Tag>{count} users</Tag>,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 120,
    render: (_, record) => (
      <Space size="small">
        <Button type="text" icon={<Edit size={16} />} size="small" disabled={record.isSystem} />
        <Button
          type="text"
          danger
          icon={<Trash2 size={16} />}
          size="small"
          disabled={record.isSystem}
        />
      </Space>
    ),
  },
];

export default function RolesPage() {
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
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Roles & Permissions
          </Title>
          <Text type="secondary">Manage user roles and their permissions</Text>
        </div>
        <Button type="primary" icon={<Plus size={16} />} onClick={() => setIsModalOpen(true)}>
          Add Role
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={placeholderData}
          pagination={false}
          scroll={{ x: 'max-content' }}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ padding: '16px 0' }}>
                <Title level={5}>Permissions</Title>
                {record.permissions.includes('all') ? (
                  <Tag color="green" icon={<Check size={12} />}>
                    All Permissions
                  </Tag>
                ) : (
                  <Collapse ghost>
                    {Object.entries(allPermissions).map(([category, perms]) => (
                      <Panel header={category.charAt(0).toUpperCase() + category.slice(1)} key={category}>
                        <Space direction="vertical">
                          {perms.map((perm) => {
                            const hasPermission = record.permissions.includes(
                              `${category}.${perm}`
                            );
                            return (
                              <Space key={perm}>
                                <Switch size="small" checked={hasPermission} disabled />
                                <Text>{perm.charAt(0).toUpperCase() + perm.slice(1)}</Text>
                                {hasPermission ? (
                                  <Check size={14} color="green" />
                                ) : (
                                  <X size={14} color="#999" />
                                )}
                              </Space>
                            );
                          })}
                        </Space>
                      </Panel>
                    ))}
                  </Collapse>
                )}
              </div>
            ),
          }}
        />
      </Card>

      <Modal
        title="Add New Role"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        width={600}
      >
        <p>Role configuration form will be implemented here.</p>
      </Modal>
    </div>
  );
}
