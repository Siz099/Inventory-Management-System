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
import { ShoppingCartOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import Layout from "../component/Layouts";
import ApiService from "../service/ApiService";

const { Title } = Typography;
const { Option } = Select;

const SellPage = () => {
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const productData = await ApiService.getProducts();
      setProducts(productData);
      if (productData.length === 0) {
        message.warning("No products available. Please add products first.");
      }
    } catch (error) {
      message.error(error.message);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const selectedProduct = products.find((p) => p.id === values.productId);
      if (!selectedProduct) throw new Error("Selected product not found");

      if (values.quantity > selectedProduct.stockQuantity) {
        throw new Error("Insufficient stock for this product");
      }

      // Logging to verify values and stock
      console.log("Selected Product:", selectedProduct);
      console.log("Quantity Sold:", values.quantity);

      // Call the API service to handle the sale
      const result = await ApiService.sellProduct(
        selectedProduct.id,
        values.quantity
      );

      if (result.success) {
        message.success("Sale processed successfully!");
        form.resetFields();
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error(error.message);
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
          <ShoppingCartOutlined /> Sell Product
        </Title>
        <Card bordered={false}>
          <Spin spinning={productsLoading} tip="Loading products...">
            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              initialValues={{
                productId: undefined,
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
                      loading={productsLoading}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {products.map((product) => (
                        <Option key={product.id} value={product.id}>
                          {product.name} (Stock: {product.stockQuantity})
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Quantity"
                    name="quantity"
                    rules={[
                      { required: true, message: "Please enter quantity" },
                      {
                        type: "number",
                        min: 1,
                        message: "Minimum quantity is 1",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const productId = getFieldValue("productId");
                          const product = products.find(
                            (p) => p.id === productId
                          );
                          if (!product || value <= product.stockQuantity) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Insufficient stock")
                          );
                        },
                      }),
                    ]}
                  >
                    <InputNumber
                      min={1}
                      max={
                        products.find(
                          (p) => p.id === form.getFieldValue("productId")
                        )?.stockQuantity
                      }
                      style={{ width: "100%" }}
                      placeholder="Enter quantity"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                      { required: true, message: "Please enter description" },
                    ]}
                  >
                    <Input.TextArea
                      rows={3}
                      placeholder="Enter sale description"
                      showCount
                      maxLength={200}
                    />
                  </Form.Item>
                  <Form.Item label="Note" name="note">
                    <Input.TextArea
                      rows={2}
                      placeholder="Additional notes (optional)"
                      showCount
                      maxLength={100}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item style={{ marginTop: 32 }}>
                <Row justify="end">
                  <Space>
                    <Button
                      onClick={() => form.resetFields()}
                      disabled={loading}
                    >
                      Reset
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      icon={<ShoppingCartOutlined />}
                    >
                      Process Sale
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

export default SellPage;
