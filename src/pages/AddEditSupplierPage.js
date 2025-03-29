import React, { useState, useEffect } from "react";
import Layout from "../component/Layouts";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Button, message } from "antd";

const AddEditSupplierPage = () => {
  const { supplierId } = useParams(); // Destructuring the supplierId from the URL
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const [form] = Form.useForm(); // Create a form instance

  useEffect(() => {
    if (supplierId) {
      setIsEditing(true);

      const fetchSupplier = async () => {
        try {
          const supplierData = await ApiService.getSupplierById(supplierId);
          if (supplierData) {
            form.setFieldsValue({
              name: supplierData.name,
              contactInfo: supplierData.contactInfo,
              address: supplierData.address,
            });
          }
        } catch (error) {
          showMessage("Error fetching supplier: " + error.message);
          console.error(error);
        }
      };
      fetchSupplier();
    }
  }, [supplierId, form]);

  // Handle form submission for both add and edit supplier
  const handleSubmit = async (values) => {
    const { name, contactInfo, address } = values;

    try {
      if (isEditing) {
        await ApiService.updateSupplier(supplierId, {
          name,
          contactInfo,
          address,
        });
        showMessage("Supplier edited successfully");
        navigate("/supplier");
      } else {
        await ApiService.createSupplier({ name, contactInfo, address });
        showMessage("Supplier added successfully");
        navigate("/supplier");
      }
    } catch (error) {
      showMessage("Error submitting supplier: " + error.message);
    }
  };

  // Method to show messages or errors
  const showMessage = (msg) => {
    message.info(msg); // Use Ant Design's message component
  };

  return (
    <Layout>
      <div className="supplier-form-page">
        <h1>{isEditing ? "Edit Supplier" : "Add Supplier"}</h1>

        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={{ name: "", contactInfo: "", address: "" }}
        >
          <Form.Item
            label="Supplier Name"
            name="name"
            rules={[{ required: true, message: "Supplier name is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Contact Info"
            name="contactInfo"
            rules={[{ required: true, message: "Contact info is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Address is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditing ? "Edit Supplier" : "Add Supplier"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  );
};

export default AddEditSupplierPage;
