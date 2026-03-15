'use client';

import { useState, useMemo } from 'react';
import {
  Typography,
  Card,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Row,
  Col,
  message,
  Spin,
  Divider,
  Space,
} from 'antd';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useProperty, useUpdateProperty } from '@/modules/admin/hooks/useProperties';
import { usePropertyTypesTree } from '@/modules/admin/hooks/usePropertyTypes';
import type {
  UpdatePropertyDto,
  CreatePropertyDwellingDto,
  PropertyPurpose,
  PropertyStatus,
  LandSizeUnit,
} from '@/lib/api/properties';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface PropertyTypeSelection {
  mainType: string;
  subType?: string | null;
}

interface PropertyFormValues {
  title: string;
  description?: string;
  purpose: PropertyPurpose;
  price: number;
  currency?: string;
  status?: PropertyStatus;
  // Location
  province: string;
  district: string;
  city: string;
  address: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  // Land
  landSize?: number;
  landSizeUnit?: LandSizeUnit;
}

const PURPOSE_OPTIONS = [
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
];

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'sold', label: 'Sold' },
  { value: 'rented', label: 'Rented' },
  { value: 'archived', label: 'Archived' },
];

const CURRENCY_OPTIONS = [
  { value: 'LKR', label: 'LKR' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
];

const LAND_SIZE_UNIT_OPTIONS = [
  { value: 'perch', label: 'Perch' },
  { value: 'acre', label: 'Acre' },
  { value: 'hectare', label: 'Hectare' },
  { value: 'sqft', label: 'Sq. Ft.' },
  { value: 'sqm', label: 'Sq. M.' },
];

const DWELLING_SIZE_UNIT_OPTIONS = [
  { value: 'sqft', label: 'Sq. Ft.' },
  { value: 'sqm', label: 'Sq. M.' },
];

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;

  const [form] = Form.useForm<PropertyFormValues>();
  const [messageApi, contextHolder] = message.useMessage();

  const { data: property, isLoading, error } = useProperty(propertyId);
  const { data: propertyTypes, isLoading: typesLoading } = usePropertyTypesTree();
  const updateProperty = useUpdateProperty();

  // Track if we've initialized the form
  const [initialized, setInitialized] = useState(false);

  // Property types selection (multiple types allowed)
  const [typeSelections, setTypeSelections] = useState<PropertyTypeSelection[]>([
    { mainType: '', subType: null },
  ]);

  // Dwellings (multiple dwellings allowed)
  const [dwellings, setDwellings] = useState<CreatePropertyDwellingDto[]>([{}]);

  // Initialize form data once when property loads
  if (property && !initialized) {
    form.setFieldsValue({
      title: property.title,
      description: property.description || undefined,
      purpose: property.purpose,
      price: property.price,
      currency: property.currency,
      status: property.status,
      province: property.location?.province || '',
      district: property.location?.district || '',
      city: property.location?.city || '',
      address: property.location?.address || '',
      country: property.location?.country,
      latitude: property.location?.latitude ?? undefined,
      longitude: property.location?.longitude ?? undefined,
      landSize: property.land?.size,
      landSizeUnit: property.land?.sizeUnit ?? undefined,
    });

    // Set type selections from property
    if (property.typeMappers && property.typeMappers.length > 0) {
      setTypeSelections(
        property.typeMappers.map((tm) => ({
          mainType: tm.mainType.id,
          subType: tm.subType?.id || null,
        })),
      );
    }

    // Set dwellings from property
    if (property.dwellings && property.dwellings.length > 0) {
      setDwellings(
        property.dwellings.map((d) => ({
          name: d.name,
          size: d.size,
          sizeUnit: d.sizeUnit,
          bedroomCount: d.bedroomCount,
          bathroomCount: d.bathroomCount,
          kitchenCount: d.kitchenCount,
          parkingSpaces: d.parkingSpaces,
        })),
      );
    }

    setInitialized(true);
  }

  // Get main types (parent types)
  const mainTypeOptions = useMemo(() => {
    return (
      propertyTypes?.map((type) => ({
        value: type.id,
        label: type.type,
      })) ?? []
    );
  }, [propertyTypes]);

  // Get sub types for a given main type
  const getSubTypeOptions = (mainTypeId: string) => {
    const mainType = propertyTypes?.find((t) => t.id === mainTypeId);
    return (
      mainType?.subTypes?.map((subType) => ({
        value: subType.id,
        label: subType.type,
      })) ?? []
    );
  };

  const handleAddType = () => {
    setTypeSelections([...typeSelections, { mainType: '', subType: null }]);
  };

  const handleRemoveType = (index: number) => {
    setTypeSelections(typeSelections.filter((_, i) => i !== index));
  };

  const handleTypeChange = (index: number, field: 'mainType' | 'subType', value: string) => {
    const updated = [...typeSelections];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'mainType') {
      updated[index].subType = null;
    }
    setTypeSelections(updated);
  };

  const handleAddDwelling = () => {
    setDwellings([...dwellings, {}]);
  };

  const handleRemoveDwelling = (index: number) => {
    setDwellings(dwellings.filter((_, i) => i !== index));
  };

  const handleDwellingChange = (
    index: number,
    field: keyof CreatePropertyDwellingDto,
    value: string | number | null,
  ) => {
    const updated = [...dwellings];
    updated[index] = { ...updated[index], [field]: value };
    setDwellings(updated);
  };

  const handleSubmit = async (values: PropertyFormValues) => {
    // Validate at least one type with mainType selected
    const validTypes = typeSelections.filter((t) => t.mainType);
    if (validTypes.length === 0) {
      messageApi.error('Please select at least one property type');
      return;
    }

    const payload: UpdatePropertyDto = {
      title: values.title,
      description: values.description || null,
      purpose: values.purpose,
      types: validTypes.map((t) => ({
        mainType: t.mainType,
        subType: t.subType || null,
      })),
      price: values.price,
      currency: values.currency || 'LKR',
      status: values.status,
      location: {
        province: values.province,
        district: values.district,
        city: values.city,
        address: values.address,
        country: values.country,
        latitude: values.latitude || null,
        longitude: values.longitude || null,
      },
      dwellings: dwellings.some((d) => Object.values(d).some((v) => v != null))
        ? dwellings.filter((d) => Object.values(d).some((v) => v != null))
        : undefined,
      land:
        values.landSize != null
          ? {
              size: values.landSize,
              sizeUnit: values.landSizeUnit || null,
            }
          : null,
    };

    try {
      await updateProperty.mutateAsync({ id: propertyId, data: payload });
      messageApi.success('Property updated successfully');
      router.push('/extranet/properties');
    } catch {
      messageApi.error('Failed to update property');
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <Typography.Text type="danger">Failed to load property: {error.message}</Typography.Text>
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
          onClick={() => router.back()}
          style={{ marginBottom: 8 }}
        >
          Back to Properties
        </Button>
        <Title level={2} style={{ margin: 0 }}>
          Edit Property
        </Title>
        <Text type="secondary">Update the property details</Text>
      </div>

      <Card>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* Basic Information */}
          <Title level={5}>Basic Information</Title>
          <Row gutter={24}>
            <Col xs={24} md={16}>
              <Form.Item
                name="title"
                label="Property Title"
                rules={[
                  { required: true, message: 'Please enter property title' },
                  { min: 5, message: 'Title must be at least 5 characters' },
                  { max: 200, message: 'Title must not exceed 200 characters' },
                ]}
              >
                <Input placeholder="e.g. Luxury Villa in Colombo 07" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="purpose"
                label="Purpose"
                rules={[{ required: true, message: 'Please select purpose' }]}
              >
                <Select placeholder="Select purpose" options={PURPOSE_OPTIONS} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Description">
            <TextArea
              rows={4}
              placeholder="Beautiful 4-bedroom villa with ocean view and modern amenities"
            />
          </Form.Item>

          {/* Property Types */}
          <Divider />
          <div style={{ marginBottom: 16 }}>
            <Title level={5} style={{ marginBottom: 8 }}>
              Property Types
            </Title>
            <Text type="secondary">Select at least one property type</Text>
          </div>

          {typeSelections.map((selection, index) => (
            <Row gutter={24} key={index} align="middle">
              <Col xs={24} md={10}>
                <Form.Item label={index === 0 ? 'Main Type' : undefined}>
                  <Select
                    placeholder="Select main type"
                    options={mainTypeOptions}
                    loading={typesLoading}
                    value={selection.mainType || undefined}
                    onChange={(value) => handleTypeChange(index, 'mainType', value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={10}>
                <Form.Item label={index === 0 ? 'Sub Type (Optional)' : undefined}>
                  <Select
                    placeholder="Select sub type"
                    options={getSubTypeOptions(selection.mainType)}
                    disabled={!selection.mainType}
                    value={selection.subType || undefined}
                    onChange={(value) => handleTypeChange(index, 'subType', value)}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={4}>
                {typeSelections.length > 1 && (
                  <Button
                    type="text"
                    danger
                    icon={<Trash2 size={16} />}
                    onClick={() => handleRemoveType(index)}
                    style={{ marginTop: index === 0 ? 0 : -24 }}
                  />
                )}
              </Col>
            </Row>
          ))}
          <Button type="dashed" icon={<Plus size={16} />} onClick={handleAddType}>
            Add Another Type
          </Button>

          {/* Pricing */}
          <Divider />
          <Title level={5}>Pricing</Title>
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: 'Please enter price' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => Number(value?.replace(/,/g, '') || 0) as 1}
                  placeholder="e.g. 50,000,000"
                  min={1}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="currency" label="Currency">
                <Select options={CURRENCY_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="status" label="Status">
                <Select options={STATUS_OPTIONS} />
              </Form.Item>
            </Col>
          </Row>

          {/* Location */}
          <Divider />
          <Title level={5}>Location</Title>
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item
                name="province"
                label="Province"
                rules={[{ required: true, message: 'Please enter province' }]}
              >
                <Input placeholder="e.g. Western" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="district"
                label="District"
                rules={[{ required: true, message: 'Please enter district' }]}
              >
                <Input placeholder="e.g. Colombo" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: 'Please enter city' }]}
              >
                <Input placeholder="e.g. Colombo 07" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={24} md={16}>
              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: 'Please enter address' }]}
              >
                <Input placeholder="e.g. 123, Galle Road, Colombo 07" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="country" label="Country">
                <Input placeholder="Sri Lanka" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item name="latitude" label="Latitude">
                <InputNumber style={{ width: '100%' }} min={-90} max={90} step={0.000001} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="longitude" label="Longitude">
                <InputNumber style={{ width: '100%' }} min={-180} max={180} step={0.000001} />
              </Form.Item>
            </Col>
          </Row>

          {/* Land Details */}
          <Divider />
          <Title level={5}>Land Details</Title>
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item name="landSize" label="Land Size">
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  step={0.01}
                  placeholder="e.g. 10.5"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="landSizeUnit" label="Size Unit">
                <Select placeholder="Select unit" options={LAND_SIZE_UNIT_OPTIONS} allowClear />
              </Form.Item>
            </Col>
          </Row>

          {/* Dwellings */}
          <Divider />
          <div style={{ marginBottom: 16 }}>
            <Title level={5} style={{ marginBottom: 8 }}>
              Dwelling Details
            </Title>
            <Text type="secondary">Add details for buildings/units on this property</Text>
          </div>

          {dwellings.map((dwelling, index) => (
            <Card
              key={index}
              size="small"
              style={{ marginBottom: 16 }}
              title={`Dwelling ${index + 1}`}
              extra={
                dwellings.length > 1 && (
                  <Button
                    type="text"
                    danger
                    icon={<Trash2 size={16} />}
                    onClick={() => handleRemoveDwelling(index)}
                  />
                )
              }
            >
              <Row gutter={24}>
                <Col xs={24} md={8}>
                  <Form.Item label="Name">
                    <Input
                      placeholder="e.g. Main House"
                      value={dwelling.name || ''}
                      onChange={(e) => handleDwellingChange(index, 'name', e.target.value || null)}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Size">
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      step={0.01}
                      value={dwelling.size}
                      onChange={(value) => handleDwellingChange(index, 'size', value)}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Size Unit">
                    <Select
                      placeholder="Select unit"
                      options={DWELLING_SIZE_UNIT_OPTIONS}
                      value={dwelling.sizeUnit}
                      onChange={(value) => handleDwellingChange(index, 'sizeUnit', value)}
                      allowClear
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col xs={12} md={6}>
                  <Form.Item label="Bedrooms">
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      value={dwelling.bedroomCount}
                      onChange={(value) => handleDwellingChange(index, 'bedroomCount', value)}
                    />
                  </Form.Item>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Item label="Bathrooms">
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      value={dwelling.bathroomCount}
                      onChange={(value) => handleDwellingChange(index, 'bathroomCount', value)}
                    />
                  </Form.Item>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Item label="Kitchens">
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      value={dwelling.kitchenCount}
                      onChange={(value) => handleDwellingChange(index, 'kitchenCount', value)}
                    />
                  </Form.Item>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Item label="Parking Spaces">
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      value={dwelling.parkingSpaces}
                      onChange={(value) => handleDwellingChange(index, 'parkingSpaces', value)}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          ))}
          <Button type="dashed" icon={<Plus size={16} />} onClick={handleAddDwelling}>
            Add Another Dwelling
          </Button>

          {/* Submit */}
          <Divider />
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={updateProperty.isPending}
            >
              Update Property
            </Button>
            <Button onClick={() => router.back()} disabled={updateProperty.isPending}>
              Cancel
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}
