import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Spin,
  message,
  Space,
} from "antd";
import {
  ShoppingOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import Layout from "../component/Layouts";
import ApiService from "../service/ApiService";

const { Title } = Typography;
const { Option } = Select;

const PurchasePage = () => {
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const fetchData = async () => {
    setDataLoading(true);
    try {
      const [productData, supplierData] = await Promise.all([
        ApiService.getProducts(),
        ApiService.getAllSuppliers(),
      ]);

      setProducts(productData || []);
      setSuppliers(supplierData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error(error.message || "Error fetching initial data");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await ApiService.purchaseProduct(
        values.productId,
        parseInt(values.quantity)
      );
      if (response.success) {
        message.success("Purchase successful!");
        // Optionally update the local product list for real-time reflection
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === values.productId
              ? {
                  ...product,
                  stockQuantity: product.stockQuantity + values.quantity,
                }
              : product
          )
        );
        form.resetFields();
      } else {
        message.error(response.message || "Error processing purchase");
      }
    } catch (error) {
      message.error(error.message || "Error processing purchase");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => window.history.back()}
          style={{ marginBottom: 16 }}
        >
          Back
        </Button>
        <Title level={3} style={{ marginBottom: 24 }}>
          <ShoppingOutlined /> Receive Inventory
        </Title>
        <Card bordered={false}>
          <Spin spinning={dataLoading}>
            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              initialValues={{
                productId: undefined,
                supplierId: undefined,
                quantity: 1,
                description: "",
                note: "",
              }}
            >
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Product"
                    name="productId"
                    rules={[
                      { required: true, message: "Please select a product" },
                    ]}
                  >
                    <Select
                      placeholder="Select product"
                      showSearch
                      optionFilterProp="children"
                      suffixIcon={<AppstoreOutlined />}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {products.length > 0 ? (
                        products.map((product) => (
                          <Option key={product.id} value={product.id}>
                            {product.name} (Stock: {product.stockQuantity})
                          </Option>
                        ))
                      ) : (
                        <Option disabled>No products available</Option>
                      )}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Supplier"
                    name="supplierId"
                    rules={[
                      { required: true, message: "Please select a supplier" },
                    ]}
                  >
                    <Select
                      placeholder="Select supplier"
                      showSearch
                      optionFilterProp="children"
                      suffixIcon={<UserOutlined />}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {suppliers.length > 0 ? (
                        suppliers.map((supplier) => (
                          <Option key={supplier.id} value={supplier.id}>
                            {supplier.name} ({supplier.contactInfo})
                          </Option>
                        ))
                      ) : (
                        <Option disabled>No suppliers available</Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Quantity"
                    name="quantity"
                    rules={[
                      { required: true, message: "Please enter quantity" },
                    ]}
                  >
                    <InputNumber
                      min={1}
                      max={1000}
                      placeholder="Quantity"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                  <Form.Item label="Description" name="description">
                    <Input.TextArea
                      placeholder="Optional description"
                      maxLength={500}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<ShoppingOutlined />}
                  loading={loading}
                  style={{ width: "100%" }}
                >
                  Receive Product
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </Card>
      </Space>
    </Layout>
  );
};

export default PurchasePage;
