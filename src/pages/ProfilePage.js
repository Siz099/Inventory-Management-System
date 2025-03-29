import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Avatar,
  Tag,
  Spin,
  message,
  Tabs,
  List,
  Button,
  Divider,
  Progress,
  Badge,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyOutlined,
  EditOutlined,
  SettingOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import Layout from "../component/Layouts";
import ApiService from "../service/ApiService";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await ApiService.getLoggedInUserInfo();
        setUser(userInfo || null);
      } catch (error) {
        message.error("Error fetching user data: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  const getRoleColor = (role) => {
    const colors = { admin: "red", user: "blue" };
    return colors[role] || "geekblue";
  };

  return (
    <Layout>
      <Row gutter={[24, 24]} style={{ padding: "24px" }}>
        <Col span={24}>
          <Card
            bordered={false}
            style={{
              borderRadius: "12px",
              background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <Spin spinning={loading} tip="Loading profile..." size="large">
              {user ? (
                <div className="profile-content">
                  <Row gutter={24} align="middle">
                    <Col xs={24} md={6}>
                      <div style={{ textAlign: "center" }}>
                        <Badge
                          count={
                            <SafetyOutlined
                              style={{ color: getRoleColor(user.role) }}
                            />
                          }
                          offset={[-20, 100]}
                        >
                          <Avatar
                            size={128}
                            icon={<UserOutlined />}
                            style={{
                              backgroundColor: "#1890ff",
                              fontSize: "48px",
                              marginBottom: 16,
                              border: "3px solid #fff",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                            src={user.avatar}
                          >
                            {user.name?.charAt(0)}
                          </Avatar>
                        </Badge>
                        <Title level={4} style={{ marginTop: 16 }}>
                          {user.name}
                        </Title>
                        <Tag
                          color={getRoleColor(user.role)}
                          style={{ fontSize: 14 }}
                        >
                          {user.role.toUpperCase()}
                        </Tag>
                      </div>
                    </Col>

                    <Col xs={24} md={18}>
                      <Tabs activeKey={activeTab} onChange={setActiveTab}>
                        <TabPane
                          tab={
                            <span>
                              <UserOutlined />
                              Profile
                            </span>
                          }
                          key="profile"
                        >
                          <List itemLayout="horizontal">
                            <List.Item>
                              <List.Item.Meta
                                avatar={
                                  <MailOutlined style={{ fontSize: 20 }} />
                                }
                                title="Email"
                                description={
                                  <Text strong copyable>
                                    {user.email}
                                  </Text>
                                }
                              />
                            </List.Item>
                            <List.Item>
                              <List.Item.Meta
                                avatar={
                                  <PhoneOutlined style={{ fontSize: 20 }} />
                                }
                                title="Phone Number"
                                description={
                                  user.phoneNumber || (
                                    <Text type="secondary">Not provided</Text>
                                  )
                                }
                              />
                            </List.Item>
                            <List.Item>
                              <List.Item.Meta
                                avatar={
                                  <ClockCircleOutlined
                                    style={{ fontSize: 20 }}
                                  />
                                }
                                title="Account Created"
                                description="January 1, 2023" // Replace with actual date
                              />
                            </List.Item>
                          </List>
                        </TabPane>
                      </Tabs>
                    </Col>
                  </Row>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <Title level={4}>No Profile Found</Title>
                  <Text type="secondary">
                    Please check your connection and try again
                  </Text>
                </div>
              )}
            </Spin>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default ProfilePage;
