import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Tag,
  Space,
  Modal,
  Spin,
  Empty,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import Layout from "../component/Layouts";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    userId: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await ApiService.getUsers(); // Adjust based on your API method
        setUsers(response); // Assuming response is an array of users
      } catch (error) {
        message.error(error.response?.data?.message || "Error fetching users");
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (!deleteModal.userId) return;
    try {
      await ApiService.deleteUser(deleteModal.userId); // Adjust the delete method
      message.success("User deleted successfully");
      setUsers((prev) => prev.filter((user) => user.id !== deleteModal.userId));
      setDeleteModal({ visible: false, userId: null });
    } catch (error) {
      message.error(error.response?.data?.message || "Error deleting user");
    }
  };

  return (
    <Layout>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 24 }}
        >
          <Col>
            <Title level={3}>Users</Title>
            <Text type="secondary">Manage your users and their accounts</Text>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/add-user")}
            >
              Add User
            </Button>
          </Col>
        </Row>

        <Spin spinning={loading}>
          {users.length > 0 ? (
            <Row gutter={[16, 16]}>
              {users.map((user) => (
                <Col key={user.id} xs={24} sm={12} lg={8}>
                  <Card
                    hoverable
                    title={
                      <Space>
                        <Text strong>{user.name}</Text>
                        <Tag color="blue">ID: {user.id}</Tag>
                      </Space>
                    }
                    extra={
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/edit-user/${user.id}`)}
                      />
                    }
                    actions={[
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() =>
                          setDeleteModal({
                            visible: true,
                            userId: user.id,
                          })
                        }
                      >
                        Delete
                      </Button>,
                    ]}
                  >
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <div>
                        <Text>Email: {user.email}</Text>
                      </div>
                      <div>
                        <Text>
                          Phone: {user.phoneNumber || "No phone number"}
                        </Text>
                      </div>
                      <div>
                        <Text>Role: {user.role || "No role assigned"}</Text>
                      </div>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Space direction="vertical">
                  <Text>No users found</Text>
                  <Text type="secondary">Start by adding your first user</Text>
                </Space>
              }
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate("/add-user")}
              >
                Add New User
              </Button>
            </Empty>
          )}
        </Spin>

        {/* Delete Confirmation Modal */}
        <Modal
          title={
            <Space>
              <InfoCircleOutlined style={{ color: "#ff4d4f" }} />
              Confirm User Deletion
            </Space>
          }
          visible={deleteModal.visible}
          onOk={handleDelete}
          onCancel={() => setDeleteModal({ visible: false, userId: null })}
          okText="Delete"
          okButtonProps={{ danger: true }}
          cancelButtonProps={{ type: "text" }}
          centered
        >
          <Space direction="vertical">
            <Text>Are you sure you want to delete this user?</Text>
            <Text type="secondary">This action cannot be undone.</Text>
          </Space>
        </Modal>
      </Space>
    </Layout>
  );
};

export default UserListPage;
