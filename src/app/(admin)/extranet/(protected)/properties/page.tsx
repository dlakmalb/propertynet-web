'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Typography,
  Card,
  Table,
  Button,
  Space,
  Input,
  Tag,
  message,
  Popconfirm,
  Dropdown,
  Checkbox,
} from 'antd';
import type { TableProps, TablePaginationConfig } from 'antd';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { Plus, Search, Eye, Edit, Trash2, Settings2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProperties, useDeleteProperty } from '@/modules/admin/hooks/useProperties';
import type { Property, PropertyFilters, PropertyStatus, PropertyPurpose } from '@/lib/api/properties';

const { Title } = Typography;

const statusOptions: { text: string; value: PropertyStatus }[] = [
  { text: 'Published', value: 'published' },
  { text: 'Draft', value: 'draft' },
  { text: 'Sold', value: 'sold' },
  { text: 'Rented', value: 'rented' },
  { text: 'Archived', value: 'archived' },
];

const purposeOptions: { text: string; value: PropertyPurpose }[] = [
  { text: 'For Sale', value: 'sale' },
  { text: 'For Rent', value: 'rent' },
];

const getStatusColor = (status: PropertyStatus): string => {
  const colors: Record<PropertyStatus, string> = {
    published: 'green',
    draft: 'default',
    sold: 'blue',
    rented: 'purple',
    archived: 'red',
  };
  return colors[status] || 'default';
};

const formatPrice = (price: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'LKR',
    maximumFractionDigits: 0,
  }).format(price);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default function PropertiesPage() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [filters, setFilters] = useState<PropertyFilters>({
    page: 1,
    limit: 10,
  });
  const [searchValue, setSearchValue] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'referenceCode',
    'title',
    'purpose',
    'type',
    'status',
    'price',
    'location',
    'createdAt',
    'actions',
  ]);

  const { data, isLoading, error } = useProperties(filters);
  const deleteProperty = useDeleteProperty();

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    tableFilters: Record<string, FilterValue | null>,
    sorter: SorterResult<Property> | SorterResult<Property>[],
  ) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    setFilters((prev) => ({
      ...prev,
      page: pagination.current || 1,
      limit: pagination.pageSize || 10,
      purpose: (tableFilters.purpose?.[0] as PropertyPurpose) || undefined,
      status: (tableFilters.status?.[0] as PropertyStatus) || undefined,
      sortBy: singleSorter?.field as string | undefined,
      sortOrder: singleSorter?.order === 'ascend' ? 'ASC' : singleSorter?.order === 'descend' ? 'DESC' : undefined,
    }));
  };

  const toggleColumn = (columnKey: string) => {
    setVisibleColumns((prev) =>
      prev.includes(columnKey) ? prev.filter((k) => k !== columnKey) : [...prev, columnKey],
    );
  };

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteProperty.mutateAsync(id);
        messageApi.success('Property deleted successfully');
      } catch {
        messageApi.error('Failed to delete property');
      }
    },
    [deleteProperty, messageApi],
  );

  const allColumns: TableProps<Property>['columns'] = useMemo(
    () => [
      {
        title: 'Ref',
        dataIndex: 'referenceCode',
        key: 'referenceCode',
        width: 100,
        sorter: true,
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        ellipsis: true,
        sorter: true,
      },
      {
        title: 'Purpose',
        dataIndex: 'purpose',
        key: 'purpose',
        width: 100,
        filters: purposeOptions,
        filterMultiple: false,
        filteredValue: filters.purpose ? [filters.purpose] : null,
        render: (purpose: PropertyPurpose) => (
          <Tag>{purpose === 'sale' ? 'Sale' : 'Rent'}</Tag>
        ),
      },
      {
        title: 'Type',
        key: 'type',
        width: 150,
        ellipsis: true,
        render: (_, record) =>
          record.typeMappers?.map((tm) => tm.mainType.type).join(', ') || '-',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 110,
        filters: statusOptions,
        filterMultiple: false,
        filteredValue: filters.status ? [filters.status] : null,
        render: (status: PropertyStatus) => (
          <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
        ),
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        width: 130,
        sorter: true,
        render: (_, record) => formatPrice(record.price, record.currency),
      },
      {
        title: 'Location',
        key: 'location',
        width: 180,
        ellipsis: true,
        render: (_, record) =>
          record.location ? `${record.location.city}, ${record.location.district}` : '-',
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
        width: 150,
        fixed: 'right' as const,
        render: (_, record) => (
          <Space size="small">
            <Button
              type="text"
              icon={<Eye size={16} />}
              size="small"
              onClick={() => router.push(`/extranet/properties/${record.id}`)}
            />
            <Button
              type="text"
              icon={<Edit size={16} />}
              size="small"
              onClick={() => router.push(`/extranet/properties/${record.id}/edit`)}
            />
            <Popconfirm
              title="Delete property"
              description="Are you sure you want to delete this property?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                danger
                icon={<Trash2 size={16} />}
                size="small"
                loading={deleteProperty.isPending}
              />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [router, handleDelete, deleteProperty.isPending, filters.purpose, filters.status],
  );

  // Column labels for visibility dropdown
  const columnLabels: Record<string, string> = {
    referenceCode: 'Ref',
    title: 'Title',
    purpose: 'Purpose',
    type: 'Type',
    status: 'Status',
    price: 'Price',
    location: 'Location',
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
          Failed to load properties: {error.message}
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
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <Input.Search
            placeholder="Search properties..."
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
              `${range[0]}-${range[1]} of ${total} properties`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
}
