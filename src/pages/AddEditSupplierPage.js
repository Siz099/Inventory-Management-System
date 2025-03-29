import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Typography,
  Row,
  Col,
  Card,
  Space,
  Spin,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import Layout from "../component/Layouts";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const { Title } = Typography;
const { TextArea } = Input;

const AddEditSupplierPage = () => {
  const { supplierId } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (supplierId) {
      setIsEditing(true);
      const fetchSupplier = async () => {
        setLoading(true);
        try {
          const supplierData = await ApiService.getSupplierById(supplierId);
          form.setFieldsValue(supplierData);
        } catch (error) {
          message.error(
            error.response?.data?.message || "Error fetching supplier details"
          );
        }
        setLoading(false);
      };
      fetchSupplier();
    }
  }, [supplierId, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (isEditing) {
        await ApiService.updateSupplier(supplierId, values);
        message.success("Supplier updated successfully");
      } else {
        await ApiService.createSupplier(values);
        message.success("Supplier added successfully");
      }
      navigate("/supplier");
    } catch (error) {
      message.error(
        error.response?.data?.message || "Error saving supplier details"
      );
    }
    setLoading(false);
  };

  return (
    <Layout>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/supplier")}
          style={{ marginBottom: 16 }}
        >
          Back to Suppliers
        </Button>

        <Title level={3} style={{ marginBottom: 24 }}>
          {isEditing ? "Edit Supplier Details" : "Create New Supplier"}
        </Title>

        <Card bordered={false}>
          <Spin spinning={loading}>
            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              initialValues={{ name: "", contactInfo: "", address: "" }}
            >
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Supplier Name"
                    name="name"
                    rules={[
                      { required: true, message: "Please enter supplier name" },
                      { min: 3, message: "Name must be at least 3 characters" },
                    ]}
                    hasFeedback
                  >
                    <Input
                      placeholder="Enter supplier name"
                      prefix={<UserOutlined />}
                      allowClear
                      size="large"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Contact Information"
                    name="contactInfo"
                    rules={[
                      {
                        required: true,
                        message: "Please enter contact details",
                      },
                      {
                        min: 5,
                        message: "Contact info must be at least 5 characters",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input
                      placeholder="Phone number or email"
                      prefix={<PhoneOutlined />}
                      allowClear
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Address"
                name="address"
                rules={[
                  { required: true, message: "Please enter address" },
                  {
                    min: 10,
                    message: "Address must be at least 10 characters",
                  },
                ]}
                hasFeedback
              >
                <TextArea
                  placeholder="Full business address"
                  prefix={<EnvironmentOutlined />}
                  rows={3}
                  allowClear
                  showCount
                  maxLength={200}
                  autoSize={{ minRows: 2, maxRows: 5 }}
                />
              </Form.Item>

              <Form.Item style={{ marginTop: 32 }}>
                <Row justify="end">
                  <Space>
                    <Button onClick={() => navigate("/supplier")} size="large">
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SaveOutlined />}
                      loading={loading}
                      size="large"
                    >
                      {isEditing ? "Update Supplier" : "Create Supplier"}
                    </Button>
                  </Space>
                </Row>
              </Form.Item>
            </Form>
          </Spin>
        </Card>
      </Space>
    </Layout>
  );
};

export default AddEditSupplierPage;
