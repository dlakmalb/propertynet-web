'use client';

import { Typography, Card, Form, Input, Select, InputNumber, Button, Row, Col, Upload } from 'antd';
import { Upload as UploadIcon, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function AddPropertyPage() {
  const router = useRouter();
  const [form] = Form.useForm();

  const handleSubmit = (values: Record<string, unknown>) => {
    console.log('Form values:', values);
    // Will implement API call later
  };

  return (
    <div>
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
          Add New Property
        </Title>
        <Text type="secondary">Fill in the details to list a new property</Text>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: 'draft' }}
        >
          <Row gutter={24}>
            <Col span={16}>
              <Form.Item
                name="title"
                label="Property Title"
                rules={[{ required: true, message: 'Please enter property title' }]}
              >
                <Input placeholder="Enter property title" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="type"
                label="Property Type"
                rules={[{ required: true, message: 'Please select property type' }]}
              >
                <Select placeholder="Select type">
                  <Select.Option value="apartment">Apartment</Select.Option>
                  <Select.Option value="house">House</Select.Option>
                  <Select.Option value="villa">Villa</Select.Option>
                  <Select.Option value="studio">Studio</Select.Option>
                  <Select.Option value="commercial">Commercial</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={4} placeholder="Describe the property..." />
          </Form.Item>

          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: 'Please enter price' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  placeholder="Enter price"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="bedrooms" label="Bedrooms">
                <InputNumber style={{ width: '100%' }} min={0} placeholder="Number of bedrooms" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="bathrooms" label="Bathrooms">
                <InputNumber style={{ width: '100%' }} min={0} placeholder="Number of bathrooms" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: 'Please enter address' }]}
              >
                <Input placeholder="Street address" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: 'Please enter city' }]}
              >
                <Input placeholder="City" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="state"
                label="State"
                rules={[{ required: true, message: 'Please enter state' }]}
              >
                <Input placeholder="State" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="images"
            label="Property Images"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload.Dragger multiple listType="picture">
              <p className="ant-upload-drag-icon">
                <UploadIcon size={32} />
              </p>
              <p className="ant-upload-text">Click or drag files to upload</p>
              <p className="ant-upload-hint">Support for single or bulk upload</p>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Select>
              <Select.Option value="draft">Draft</Select.Option>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="pending">Pending Review</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large">
              Create Property
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => router.back()}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
