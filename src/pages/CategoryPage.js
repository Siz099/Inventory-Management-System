import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Modal,
  message,
  Form,
  Row,
  Col,
  Card,
  Tag,
  Spin,
  Space,
  Tooltip,
  Empty,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import Layout from "../component/Layouts";
import ApiService from "../service/ApiService";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    id: null,
    deleteLoading: false,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getAllCategory();
      setCategories(data);
    } catch (error) {
      message.error("Error fetching categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      if (values.id) {
        await ApiService.updateCategory(values.id, { name: values.name });
        message.success("Category updated successfully");
      } else {
        await ApiService.createCategory({ name: values.name });
        message.success("Category added successfully");
      }
      form.resetFields();
      fetchCategories();
    } catch (error) {
      message.error("Error saving category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteModal((prev) => ({ ...prev, deleteLoading: true }));
      await ApiService.deleteCategory(deleteModal.id);
      message.success("Category deleted successfully");
      setCategories(categories.filter((cat) => cat.id !== deleteModal.id));
    } catch (error) {
      message.error("Error deleting category");
    } finally {
      setDeleteModal({ visible: false, id: null, deleteLoading: false });
    }
  };

  const columns = [
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <Tag color="geekblue">{text}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit category">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => form.setFieldsValue(record)}
            />
          </Tooltip>
          <Tooltip title="Delete category">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => setDeleteModal({ visible: true, id: record.id })}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <Card title="Category Management" style={{ margin: 16 }} bordered={false}>
        <Form form={form} onFinish={handleSubmit} layout="inline">
          <Row gutter={[16, 16]} style={{ width: "100%" }}>
            <Col xs={24} md={18}>
              <Form.Item
                name="name"
                label="Category Name"
                rules={[
                  { required: true, message: "Please enter category name" },
                  {
                    max: 50,
                    message: "Category name must be less than 50 characters",
                  },
                ]}
              >
                <Input
                  placeholder="Enter category name"
                  autoFocus={!!form.getFieldValue("id")}
                  allowClear
                />
              </Form.Item>
              <Form.Item name="id" hidden>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Button
                type={form.getFieldValue("id") ? "default" : "primary"}
                htmlType="submit"
                loading={submitting}
                block
              >
                {form.getFieldValue("id") ? "Update Category" : "Add Category"}
              </Button>
            </Col>
          </Row>
        </Form>

        <Spin spinning={loading} delay={300} style={{ marginTop: 24 }}>
          {categories.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No categories found"
              style={{ margin: "40px 0" }}
            />
          ) : (
            <Table
              dataSource={categories}
              columns={columns}
              rowKey="id"
              pagination={false}
              bordered
              style={{ marginTop: 24 }}
              scroll={{ x: true }}
            />
          )}
        </Spin>

        <Modal
          title={
            <Space>
              <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />
              Delete Category
            </Space>
          }
          open={deleteModal.visible}
          onOk={handleDelete}
          onCancel={() => setDeleteModal({ visible: false, id: null })}
          okText="Delete"
          okButtonProps={{
            danger: true,
            loading: deleteModal.deleteLoading,
          }}
          cancelButtonProps={{ disabled: deleteModal.deleteLoading }}
        >
          <p style={{ marginBottom: 8 }}>
            Are you sure you want to delete this category?
          </p>
          <p style={{ margin: 0 }}>This action cannot be undone.</p>
        </Modal>
      </Card>
    </Layout>
  );
};

export default CategoryPage;
