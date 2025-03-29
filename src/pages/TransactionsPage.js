import React, { useState, useEffect } from "react";
import Layout from "../component/Layouts";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import { Table, Input, Button, Space, Pagination, Card } from "antd";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const [filter, setFilter] = useState("");
  const [valueToSearch, setValueToSearch] = useState("");

  const navigate = useNavigate();

  // Pagination Set-Up
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const getTransactions = async () => {
      try {
        // Fetch all transactions from the API
        const transactionData = await ApiService.getAllTransactions();

        // If data exists, paginate and update the state
        if (transactionData) {
          setTotalPages(Math.ceil(transactionData.length / itemsPerPage)); // Adjust pagination based on the data length
          setTransactions(
            transactionData.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )
          );
        }
      } catch (error) {
        // Show error if something goes wrong
        showMessage(
          error.response?.data?.message ||
            "Error Getting transactions: " + error
        );
      }
    };

    getTransactions();
  }, [currentPage, valueToSearch]);

  // Method to show message or errors
  const showMessage = (msg) => {
    setMessageContent(msg);
    setTimeout(() => {
      setMessageContent("");
    }, 4000);
  };

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    setValueToSearch(filter);
  };

  // Navigate to transaction details page
  const navigateToTransactionDetailsPage = (transactionId) => {
    navigate(`/transaction/${transactionId}`);
  };

  // Define table columns for Ant Design
  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
    },
    {
      title: "Total Products",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => (text ? new Date(text).toLocaleString() : "No Date"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => navigateToTransactionDetailsPage(record.id)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <Layout>
      {messageContent && (
        <Card>
          <p>{messageContent}</p>
        </Card>
      )}
      <div className="transactions-page">
        <Card title="Transactions" style={{ marginBottom: 20 }}>
          <Space style={{ marginBottom: 16 }}>
            <Input
              placeholder="Search transaction ..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ width: 250 }}
            />
            <Button type="primary" onClick={handleSearch}>
              Search
            </Button>
          </Space>

          <Table
            columns={columns}
            dataSource={transactions}
            pagination={false}
            rowKey="id"
          />

          <Pagination
            current={currentPage}
            total={totalPages * itemsPerPage}
            onChange={(page) => setCurrentPage(page)}
            pageSize={itemsPerPage}
            showSizeChanger={false}
            style={{ marginTop: 20, textAlign: "center" }}
          />
        </Card>
      </div>
    </Layout>
  );
};

export default TransactionsPage;
