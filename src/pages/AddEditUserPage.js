import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  message,
  Spin,
  Row,
  Col,
  Card,
  Typography,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../service/ApiService";
import AdminLayout from "../component/Layouts";

const { Option } = Select;
const { Title } = Typography;

const AddEditUserPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [roles] = useState(["admin", "user"]);
  const [user, setUser] = useState(null);

  const { userId } = useParams();
  const isEditMode = userId !== undefined;
  const navigate = useNavigate();

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const userData = await ApiService.getUserById(userId);
      setUser(userData);
      form.setFieldsValue(userData);
    } catch (error) {
      message.error("Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEditMode) fetchUserData();
  }, [isEditMode, userId]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (isEditMode) {
        await ApiService.updateUser(userId, values);
        message.success("User updated successfully!");
      } else {
        await ApiService.addUser(values);
        message.success("User added successfully!");
      }
      navigate("/users");
    } catch (error) {
      message.error(error.message || "Failed to save user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: "24px" }}>
        <Card
          title={
            <Title level={4} style={{ margin: 0 }}>
              {isEditMode ? "Edit User" : "Add New User"}
            </Title>
          }
          bordered={false}
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
        >
          <Spin spinning={loading} tip="Processing...">
            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              initialValues={{ role: "user" }}
              hideRequiredMark
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the user's name",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter name"
                      prefix={
                        <UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                      }
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the user's email",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter email"
                      prefix={
                        <MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Phone Number"
                    name="phoneNumber"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the user's phone number",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter phone number"
                      prefix={
                        <PhoneOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                      }
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the user's password",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input.Password
                      placeholder="Enter password"
                      prefix={
                        <LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Role"
                    name="role"
                    rules={[
                      { required: true, message: "Please select a role" },
                    ]}
                  >
                    <Select
                      placeholder="Select role"
                      dropdownRender={(menu) => (
                        <div style={{ padding: 8 }}>{menu}</div>
                      )}
                    >
                      {roles.map((role) => (
                        <Option key={role} value={role}>
                          <span style={{ textTransform: "capitalize" }}>
                            {role}
                          </span>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item style={{ marginTop: 24 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: 16 }}
                  loading={loading}
                >
                  {isEditMode ? "Update User" : "Add User"}
                </Button>
                <Button onClick={() => navigate("/users")}>Cancel</Button>
              </Form.Item>
            </Form>
          </Spin>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AddEditUserPage;
