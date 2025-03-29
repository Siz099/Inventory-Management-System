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
  EnvironmentOutlined,
  PhoneOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import Layout from "../component/Layouts";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    supplierId: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      try {
        const response = await ApiService.getAllSuppliers();
        setSuppliers(response);
      } catch (error) {
        message.error(
          error.response?.data?.message || "Error fetching suppliers"
        );
      }
      setLoading(false);
    };
    fetchSuppliers();
  }, []);

  const handleDelete = async () => {
    if (!deleteModal.supplierId) return;
    try {
      await ApiService.deleteSupplier(deleteModal.supplierId);
      message.success("Supplier deleted successfully");
      setSuppliers((prev) =>
        prev.filter((sup) => sup.id !== deleteModal.supplierId)
      );
      setDeleteModal({ visible: false, supplierId: null });
    } catch (error) {
      message.error(error.response?.data?.message || "Error deleting supplier");
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
            <Title level={3}>Supplier Directory</Title>
            <Text type="secondary">
              Manage your suppliers and vendor relationships
            </Text>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/add-supplier")}
            >
              Add Supplier
            </Button>
          </Col>
        </Row>

        <Spin spinning={loading}>
          {suppliers.length > 0 ? (
            <Row gutter={[16, 16]}>
              {suppliers.map((supplier) => (
                <Col key={supplier.id} xs={24} sm={12} lg={8}>
                  <Card
                    hoverable
                    title={
                      <Space>
                        <Text strong>{supplier.name}</Text>
                        <Tag color="blue">ID: {supplier.id}</Tag>
                      </Space>
                    }
                    extra={
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() =>
                          navigate(`/edit-supplier/${supplier.id}`)
                        }
                      />
                    }
                    actions={[
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() =>
                          setDeleteModal({
                            visible: true,
                            supplierId: supplier.id,
                          })
                        }
                      >
                        Delete
                      </Button>,
                    ]}
                  >
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <div>
                        <PhoneOutlined style={{ marginRight: 8 }} />
                        <Text>
                          {supplier.contactInfo || "No contact information"}
                        </Text>
                      </div>
                      <div>
                        <EnvironmentOutlined style={{ marginRight: 8 }} />
                        <Text>{supplier.address || "No address provided"}</Text>
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
                  <Text>No suppliers found</Text>
                  <Text type="secondary">
                    Start by adding your first supplier
                  </Text>
                </Space>
              }
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate("/add-supplier")}
              >
                Add New Supplier
              </Button>
            </Empty>
          )}
        </Spin>

        <Modal
          title={
            <Space>
              <InfoCircleOutlined style={{ color: "#ff4d4f" }} />
              Confirm Supplier Deletion
            </Space>
          }
          visible={deleteModal.visible}
          onOk={handleDelete}
          onCancel={() => setDeleteModal({ visible: false, supplierId: null })}
          okText="Delete"
          okButtonProps={{ danger: true }}
          cancelButtonProps={{ type: "text" }}
          centered
        >
          <Space direction="vertical">
            <Text>Are you sure you want to delete this supplier?</Text>
            <Text type="secondary">This action cannot be undone.</Text>
          </Space>
        </Modal>
      </Space>
    </Layout>
  );
};

export default SupplierPage;
