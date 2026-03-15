'use client';

import { Typography, Row, Col, Card, Statistic, Table, Tag, Space, Progress } from 'antd';
import type { TableProps } from 'antd';
import { Building2, Users, Eye, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

const { Title, Text } = Typography;

// Placeholder data for recent properties
interface RecentProperty {
  key: string;
  title: string;
  status: string;
  views: number;
  createdAt: string;
}

const recentProperties: RecentProperty[] = [
  {
    key: '1',
    title: 'Modern Apartment in Downtown',
    status: 'Active',
    views: 234,
    createdAt: '2024-01-15',
  },
  {
    key: '2',
    title: 'Luxury Villa with Pool',
    status: 'Pending',
    views: 156,
    createdAt: '2024-01-14',
  },
  {
    key: '3',
    title: 'Cozy Studio Near Beach',
    status: 'Active',
    views: 89,
    createdAt: '2024-01-13',
  },
  {
    key: '4',
    title: 'Family Home in Suburbs',
    status: 'Active',
    views: 67,
    createdAt: '2024-01-12',
  },
];

const recentPropertiesColumns: TableProps<RecentProperty>['columns'] = [
  {
    title: 'Property',
    dataIndex: 'title',
    key: 'title',
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
    title: 'Views',
    dataIndex: 'views',
    key: 'views',
    width: 80,
    align: 'right',
  },
  {
    title: 'Created',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 100,
  },
];

// Stats card component
interface StatsCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color: string;
}

function StatsCard({ title, value, prefix, suffix, icon, trend, color }: StatsCardProps) {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Text type="secondary">{title}</Text>
          <Statistic
            value={value}
            prefix={prefix}
            suffix={suffix}
            styles={{ content: { fontSize: 28, fontWeight: 600 } }}
          />
          {trend && (
            <Space size={4}>
              {trend.isUp ? (
                <ArrowUp size={14} color="#52c41a" />
              ) : (
                <ArrowDown size={14} color="#ff4d4f" />
              )}
              <Text style={{ color: trend.isUp ? '#52c41a' : '#ff4d4f', fontSize: 12 }}>
                {trend.value}%
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                vs last month
              </Text>
            </Space>
          )}
        </div>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 8,
            background: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}

export default function AdminDashboardPage() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          Dashboard
        </Title>
        <Text type="secondary">Welcome back! Here&apos;s what&apos;s happening with your properties.</Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Total Properties"
            value={156}
            icon={<Building2 size={24} color="white" />}
            trend={{ value: 12, isUp: true }}
            color="#1677ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Total Users"
            value={1234}
            icon={<Users size={24} color="white" />}
            trend={{ value: 8, isUp: true }}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Total Views"
            value={45600}
            icon={<Eye size={24} color="white" />}
            trend={{ value: 23, isUp: true }}
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Conversion Rate"
            value={3.2}
            suffix="%"
            icon={<TrendingUp size={24} color="white" />}
            trend={{ value: 2, isUp: false }}
            color="#fa8c16"
          />
        </Col>
      </Row>

      {/* Content Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Recent Properties" extra={<a href="/extranet/properties">View All</a>}>
            <Table
              columns={recentPropertiesColumns}
              dataSource={recentProperties}
              pagination={false}
              size="small"
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Property Types">
            <Space direction="vertical" style={{ width: '100%' }} size={16}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text>Apartments</Text>
                  <Text>45%</Text>
                </div>
                <Progress percent={45} showInfo={false} strokeColor="#1677ff" />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text>Houses</Text>
                  <Text>30%</Text>
                </div>
                <Progress percent={30} showInfo={false} strokeColor="#52c41a" />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text>Villas</Text>
                  <Text>15%</Text>
                </div>
                <Progress percent={15} showInfo={false} strokeColor="#722ed1" />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text>Commercial</Text>
                  <Text>10%</Text>
                </div>
                <Progress percent={10} showInfo={false} strokeColor="#fa8c16" />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
