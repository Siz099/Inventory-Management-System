import React, { useEffect, useState } from "react";
import { Table, Input, Button, Modal, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Layout from "../component/Layouts";
import ApiService from "../service/ApiService";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ visible: false, id: null });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await ApiService.getAllCategory();
        setCategories(data);
      } catch (error) {
        message.error("Error fetching categories");
      }
    };
    fetchCategories();
  }, []);

  // Add or edit category
  const handleCategorySubmit = async () => {
    if (!categoryName) {
      message.warning("Category name cannot be empty");
      return;
    }

    try {
      if (isEditing) {
        await ApiService.updateCategory(editingCategoryId, {
          name: categoryName,
        });
        message.success("Category updated successfully");
      } else {
        await ApiService.createCategory({ name: categoryName });
        message.success("Category added successfully");
      }

      setCategoryName("");
      setIsEditing(false);
      setEditingCategoryId(null);
      const updatedData = await ApiService.getAllCategory();
      setCategories(updatedData);
    } catch (error) {
      message.error("Error saving category");
    }
  };

  // Open edit mode
  const handleEdit = (category) => {
    setIsEditing(true);
    setEditingCategoryId(category.id);
    setCategoryName(category.name);
  };

  // Open delete confirmation modal
  const handleDeleteConfirm = (categoryId) => {
    setDeleteModal({ visible: true, id: categoryId });
  };

  // Delete category
  const handleDelete = async () => {
    try {
      await ApiService.deleteCategory(deleteModal.id);
      message.success("Category deleted successfully");
      setCategories(categories.filter((cat) => cat.id !== deleteModal.id));
    } catch (error) {
      message.error("Error deleting category");
    } finally {
      setDeleteModal({ visible: false, id: null });
    }
  };

  const columns = [
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteConfirm(record.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Layout>
      <h1>Categories</h1>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <Input
          value={categoryName}
          placeholder="Enter category name"
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <Button type="primary" onClick={handleCategorySubmit}>
          {isEditing ? "Update Category" : "Add Category"}
        </Button>
      </div>

      <Table dataSource={categories} columns={columns} rowKey="id" />

      <Modal
        title="Confirm Delete"
        open={deleteModal.visible}
        onOk={handleDelete}
        onCancel={() => setDeleteModal({ visible: false, id: null })}
      >
        <p>Are you sure you want to delete this category?</p>
      </Modal>
    </Layout>
  );
};

export default CategoryPage;
