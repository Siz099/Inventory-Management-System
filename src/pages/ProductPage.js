import React, { useState, useEffect } from "react";
import { Table, Button, Modal, message, Pagination } from "antd";
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
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "SKU", dataIndex: "sku", key: "sku" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Quantity", dataIndex: "stockQuantity", key: "stockQuantity" },
    {
      title: "Actions",
      key: "actions",
      render: (_, product) => (
        <>
          <Button
            type="link"
            onClick={() => navigate(`/edit-product/${product.id}`)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            onClick={() =>
              setDeleteModal({ visible: true, productId: product.id })
            }
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Layout>
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h1>Products</h1>
        <Button type="primary" onClick={() => navigate("/add-product")}>
          Add Product
        </Button>
      </div>

      <Table
        dataSource={products}
        columns={columns}
        loading={loading}
        pagination={false}
        rowKey="id"
      />

      <Pagination
        current={currentPage}
        total={totalProducts}
        pageSize={itemsPerPage}
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: "16px", textAlign: "center" }}
      />

      <Modal
        title="Confirm Delete"
        visible={deleteModal.visible}
        onOk={confirmDelete}
        onCancel={() => setDeleteModal({ visible: false, productId: null })}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        Are you sure you want to delete this product?
      </Modal>
    </Layout>
  );
};

export default ProductPage;
