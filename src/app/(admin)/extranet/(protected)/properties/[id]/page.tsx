'use client';

import {
  Typography,
  Card,
  Button,
  Row,
  Col,
  Tag,
  Descriptions,
  Space,
  Spin,
  Popconfirm,
  message,
} from 'antd';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useProperty, useDeleteProperty } from '@/modules/admin/hooks/useProperties';
import type { PropertyStatus } from '@/lib/api/properties';

const { Title, Text } = Typography;

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
    month: 'long',
    day: 'numeric',
  });
};

export default function PropertyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;

  const [messageApi, contextHolder] = message.useMessage();
  const { data: property, isLoading, error } = useProperty(propertyId);
  const deleteProperty = useDeleteProperty();

  const handleDelete = async () => {
    try {
      await deleteProperty.mutateAsync(propertyId);
      messageApi.success('Property deleted successfully');
      router.push('/extranet/properties');
    } catch {
      messageApi.error('Failed to delete property');
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <Card>
        <Typography.Text type="danger">
          Failed to load property: {error?.message || 'Property not found'}
        </Typography.Text>
      </Card>
    );
  }

  return (
    <div>
      {contextHolder}
      <div style={{ marginBottom: 24 }}>
        <Button
          type="text"
          icon={<ArrowLeft size={16} />}
          onClick={() => router.push('/extranet/properties')}
          style={{ marginBottom: 8 }}
        >
          Back to Properties
        </Button>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <Title level={2} style={{ margin: 0 }}>
              {property.title}
            </Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
              Ref: {property.referenceCode}
            </Text>
            <Space style={{ marginTop: 8 }} wrap>
              <Tag color={getStatusColor(property.status)}>{property.status.toUpperCase()}</Tag>
              <Tag>{property.purpose === 'sale' ? 'For Sale' : 'For Rent'}</Tag>
              {property.typeMappers?.map((tm, index) => (
                <Tag key={index} color="blue">
                  {tm.mainType.type}
                  {tm.subType && ` - ${tm.subType.type}`}
                </Tag>
              ))}
            </Space>
          </div>
          <Space>
            <Button
              icon={<Edit size={16} />}
              onClick={() => router.push(`/extranet/properties/${propertyId}/edit`)}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete property"
              description="Are you sure you want to delete this property?"
              onConfirm={handleDelete}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<Trash2 size={16} />} loading={deleteProperty.isPending}>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title="Property Details">
            <Descriptions column={{ xs: 1, sm: 2 }} bordered>
              <Descriptions.Item label="Price" span={2}>
                <Text strong style={{ fontSize: 18 }}>
                  {formatPrice(property.price, property.currency)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Purpose">
                {property.purpose === 'sale' ? 'For Sale' : 'For Rent'}
              </Descriptions.Item>
              <Descriptions.Item label="Status">{property.status}</Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>
                {property.description || 'No description provided'}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {property.dwellings && property.dwellings.length > 0 && (
            <Card title="Dwelling Details" style={{ marginTop: 24 }}>
              {property.dwellings.map((dwelling, index) => (
                <div key={index} style={{ marginBottom: index < property.dwellings!.length - 1 ? 16 : 0 }}>
                  {property.dwellings!.length > 1 && (
                    <Text strong style={{ display: 'block', marginBottom: 8 }}>
                      {dwelling.name || `Dwelling ${index + 1}`}
                    </Text>
                  )}
                  <Descriptions column={{ xs: 1, sm: 2 }} bordered size="small">
                    {dwelling.size != null && (
                      <Descriptions.Item label="Size">
                        {dwelling.size} {dwelling.sizeUnit || 'sqft'}
                      </Descriptions.Item>
                    )}
                    {dwelling.bedroomCount != null && (
                      <Descriptions.Item label="Bedrooms">{dwelling.bedroomCount}</Descriptions.Item>
                    )}
                    {dwelling.bathroomCount != null && (
                      <Descriptions.Item label="Bathrooms">{dwelling.bathroomCount}</Descriptions.Item>
                    )}
                    {dwelling.kitchenCount != null && (
                      <Descriptions.Item label="Kitchens">{dwelling.kitchenCount}</Descriptions.Item>
                    )}
                    {dwelling.parkingSpaces != null && (
                      <Descriptions.Item label="Parking Spaces">
                        {dwelling.parkingSpaces}
                      </Descriptions.Item>
                    )}
                  </Descriptions>
                </div>
              ))}
            </Card>
          )}

          {property.land && (
            <Card title="Land Details" style={{ marginTop: 24 }}>
              <Descriptions column={{ xs: 1, sm: 2 }} bordered>
                <Descriptions.Item label="Land Size">
                  {property.land.size} {property.land.sizeUnit || 'perch'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}
        </Col>

        <Col xs={24} lg={8}>
          {property.location && (
            <Card title="Location">
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Address">{property.location.address}</Descriptions.Item>
                <Descriptions.Item label="City">{property.location.city}</Descriptions.Item>
                <Descriptions.Item label="District">{property.location.district}</Descriptions.Item>
                <Descriptions.Item label="Province">{property.location.province}</Descriptions.Item>
                {property.location.country && (
                  <Descriptions.Item label="Country">{property.location.country}</Descriptions.Item>
                )}
                {(property.location.latitude || property.location.longitude) && (
                  <Descriptions.Item label="Coordinates">
                    {property.location.latitude}, {property.location.longitude}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          )}

          <Card title="Timeline" style={{ marginTop: 24 }}>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Created">{formatDate(property.createdAt)}</Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {formatDate(property.updatedAt)}
              </Descriptions.Item>
              {property.publishedAt && (
                <Descriptions.Item label="Published">
                  {formatDate(property.publishedAt)}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
