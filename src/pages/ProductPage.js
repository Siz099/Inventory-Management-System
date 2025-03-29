import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  message,
  Pagination,
  Row,
  Col,
  Typography,
  Space,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Layout from "../component/Layouts";
import ApiService from "../service/ApiService";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    productId: null,
  });

  const navigate = useNavigate();
  const itemsPerPage = 10;

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productData = await ApiService.getProducts();
        setTotalProducts(productData.length);
        setProducts(
          productData.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
          )
        );
      } catch (error) {
        message.error("Error fetching products");
      }
      setLoading(false);
    };
    fetchProducts();
  }, [currentPage]);

  // Delete product
  const confirmDelete = async () => {
    if (!deleteModal.productId) return;
    try {
      await ApiService.deleteProduct(deleteModal.productId);
      message.success("Product deleted successfully");
      setDeleteModal({ visible: false, productId: null });
      setProducts(
        products.filter((product) => product.id !== deleteModal.productId)
      );
    } catch (error) {
      message.error("Error deleting product");
    }
  };

  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      ellipsis: true,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${parseFloat(price).toFixed(2)}`,
      align: "right",
    },
    {
      title: "Quantity",
      dataIndex: "stockQuantity",
      key: "stockQuantity",
      align: "right",
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 120,
      render: (_, product) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => navigate(`/edit-product/${product.id}`)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              danger
              onClick={() =>
                setDeleteModal({ visible: true, productId: product.id })
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Product Management
          </Typography.Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/add-product")}
          >
            Add Product
          </Button>
        </Col>
      </Row>

      <Table
        dataSource={products}
        columns={columns}
        loading={loading}
        pagination={false}
        rowKey="id"
        scroll={{ x: true }}
        size="middle"
        bordered
      />

      <Pagination
        current={currentPage}
        total={totalProducts}
        pageSize={itemsPerPage}
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: 24, textAlign: "center" }}
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} of ${total} items`
        }
      />

      <Modal
        title={
          <Space>
            <ExclamationCircleOutlined style={{ color: "#faad14" }} />
            Confirm Delete
          </Space>
        }
        visible={deleteModal.visible}
        onOk={confirmDelete}
        onCancel={() => setDeleteModal({ visible: false, productId: null })}
        okText="Delete"
        okButtonProps={{ danger: true, type: "primary" }}
        cancelButtonProps={{ type: "text" }}
        centered
      >
        <Typography.Text>
          Are you sure you want to delete this product? This action cannot be
          undone.
        </Typography.Text>
      </Modal>
    </Layout>
  );
};

export default ProductPage;
