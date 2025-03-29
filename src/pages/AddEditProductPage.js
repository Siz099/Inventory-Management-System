import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  message,
  Row,
  Col,
  Typography,
  Card,
  Space,
} from "antd";
import {
  SaveOutlined,
  ArrowLeftOutlined,
  DollarOutlined,
  BarcodeOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import Layout from "../component/Layouts";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const { TextArea } = Input;

const AddEditProductPage = () => {
  const { productId } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await ApiService.getAllCategory();
        setCategories(categoriesData);
      } catch (error) {
        message.error("Error fetching categories");
      }
    };

    const fetchProductById = async () => {
      if (productId) {
        setIsEditing(true);
        try {
          const productData = await ApiService.getProductById(productId);
          if (productData.status === 200) {
            form.setFieldsValue({
              ...productData.product,
              price: parseFloat(productData.product.price),
            });
          } else {
            message.error(productData.message);
          }
        } catch (error) {
          message.error("Error fetching product details");
        }
      }
    };

    fetchCategories();
    if (productId) fetchProductById();
  }, [productId, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (isEditing) {
        await ApiService.updateProduct(productId, values);
        message.success("Product updated successfully");
      } else {
        await ApiService.addProduct(values);
        message.success("Product added successfully");
      }
      navigate("/product");
    } catch (error) {
      message.error(error.response?.data?.message || "Error saving product");
    }
    setLoading(false);
  };

  return (
    <Layout>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/product")}
          style={{ marginBottom: 16 }}
        >
          Back to Products
        </Button>

        <Typography.Title level={3} style={{ marginBottom: 24 }}>
          {isEditing ? "Edit Product Details" : "Create New Product"}
        </Typography.Title>

        <Card bordered={false}>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Product Name"
                  name="name"
                  rules={[
                    { required: true, message: "Please enter product name" },
                  ]}
                  hasFeedback
                >
                  <Input
                    placeholder="Enter product name"
                    allowClear
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="SKU"
                  name="sku"
                  rules={[
                    { required: true, message: "Please enter product SKU" },
                  ]}
                  hasFeedback
                >
                  <Input
                    placeholder="Enter unique SKU"
                    allowClear
                    prefix={<BarcodeOutlined />}
                  />
                </Form.Item>

                <Form.Item
                  label="Category"
                  name="categoryId"
                  rules={[
                    { required: true, message: "Please select a category" },
                  ]}
                  hasFeedback
                >
                  <Select
                    placeholder="Select category"
                    suffixIcon={<AppstoreAddOutlined />}
                    optionFilterProp="children"
                    showSearch
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {categories.map((category) => (
                      <Select.Option key={category.id} value={category.id}>
                        {category.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Price"
                  name="price"
                  rules={[
                    {
                      required: true,
                      message: "Please enter product price",
                      type: "number",
                      min: 0,
                    },
                  ]}
                  hasFeedback
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="0.00"
                    min={0}
                    step={0.01}
                    prefix={<DollarOutlined />}
                    formatter={(value) =>
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>

                <Form.Item
                  label="Stock Quantity"
                  name="stockQuantity"
                  rules={[
                    {
                      required: true,
                      message: "Please enter stock quantity",
                      type: "number",
                      min: 0,
                    },
                  ]}
                  hasFeedback
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="0"
                    min={0}
                    step={1}
                  />
                </Form.Item>

                <Form.Item label="Description" name="description" hasFeedback>
                  <TextArea
                    rows={4}
                    placeholder="Enter product description..."
                    showCount
                    maxLength={500}
                    autoSize={{ minRows: 3, maxRows: 6 }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item style={{ marginTop: 24 }}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loading}
                  size="large"
                >
                  {isEditing ? "Update Product" : "Create Product"}
                </Button>
                <Button onClick={() => navigate("/product")} size="large">
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </Layout>
  );
};

export default AddEditProductPage;
