import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, Select, Button, message } from "antd";
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
              name: productData.product.name,
              sku: productData.product.sku,
              price: productData.product.price,
              stockQuantity: productData.product.stockQuantity,
              categoryId: productData.product.categoryId,
              description: productData.product.description,
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
      message.error("Error saving product");
    }
    setLoading(false);
  };

  return (
    <Layout>
      <h1>{isEditing ? "Edit Product" : "Add Product"}</h1>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Product Name"
          name="name"
          rules={[{ required: true, message: "Please enter product name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="SKU"
          name="sku"
          rules={[{ required: true, message: "Please enter SKU" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Stock Quantity"
          name="stockQuantity"
          rules={[{ required: true, message: "Please enter stock quantity" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please enter price" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Category"
          name="categoryId"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select placeholder="Select a category">
            {categories.map((category) => (
              <Select.Option key={category.id} value={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEditing ? "Update Product" : "Add Product"}
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default AddEditProductPage;
