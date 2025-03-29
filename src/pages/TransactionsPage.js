import React, { useState, useEffect, useCallback } from "react";
import Layout from "../component/Layouts";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Input,
  Button,
  Space,
  Card,
  Tag,
  Typography,
  Spin,
  DatePicker,
  message,
} from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";

const { Text } = Typography;
const { RangePicker } = DatePicker;

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("");
  const [valueToSearch, setValueToSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const applyFilters = useCallback(
    (data) => {
      return data.filter((transaction) => {
        const matchesSearch = Object.values(transaction).some((value) =>
          String(value).toLowerCase().includes(valueToSearch.toLowerCase())
        );
        const matchesDate =
          dateRange.length === 0 ||
          (new Date(transaction.date) >= dateRange[0] &&
            new Date(transaction.date) <= dateRange[1]);
        return matchesSearch && matchesDate;
      });
    },
    [valueToSearch, dateRange]
  );

  useEffect(() => {
    const getTransactions = async () => {
      setLoading(true);
      try {
        const transactionData = await ApiService.getTransactions(); // Use getTransactions instead of getAllTransactions
        if (transactionData) {
          const filteredData = applyFilters(transactionData);
          setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
          setTransactions(
            filteredData.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )
          );
        }
      } catch (error) {
        message.error(
          error.response?.data?.message ||
            "Error getting transactions: " + error.message
        );
      } finally {
        setLoading(false);
      }
    };

    getTransactions();
  }, [currentPage, applyFilters, itemsPerPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    setValueToSearch(filter);
  };

  const handleDateChange = (dates) => {
    setDateRange(dates || []);
    setCurrentPage(1);
  };

  const navigateToTransactionDetailsPage = (transactionId) => {
    navigate(`/transaction/${transactionId}`);
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => (text ? new Date(text).toLocaleDateString() : "-"),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text) => (
        <Tag color="geekblue">{(text || "N/A").toUpperCase()}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusText = status || "unknown";
        const color =
          {
            completed: "green",
            pending: "orange",
            unknown: "red",
          }[statusText.toLowerCase()] || "red";

        return <Tag color={color}>{statusText.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Amount",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text) => (
        <Text strong>${text ? parseFloat(text).toFixed(2) : "0.00"}</Text>
      ),
      align: "right",
    },
    {
      title: "Products",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => navigateToTransactionDetailsPage(record.id)}
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <Layout>
      <div className="transactions-page" style={{ padding: 24 }}>
        <Card
          title="Transaction History"
          extra={
            <RangePicker onChange={handleDateChange} style={{ width: 250 }} />
          }
          style={{ marginBottom: 24 }}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Space style={{ marginBottom: 16 }}>
              <Input
                placeholder="Search transactions..."
                prefix={<SearchOutlined />}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{ width: 300 }}
                onPressEnter={handleSearch}
              />
              <Button
                type="primary"
                onClick={handleSearch}
                icon={<SearchOutlined />}
              >
                Search
              </Button>
            </Space>

            <Spin spinning={loading}>
              <Table
                columns={columns}
                dataSource={transactions}
                pagination={{
                  current: currentPage,
                  pageSize: itemsPerPage,
                  total: totalPages * itemsPerPage, // This needs to be corrected
                  onChange: (page) => setCurrentPage(page),
                  showSizeChanger: false,
                  position: ["bottomCenter"],
                }}
                rowKey="id"
                bordered
                rowClassName={(record, index) =>
                  index % 2 === 0 ? "even-row" : "odd-row"
                }
                scroll={{ x: 800 }}
              />
            </Spin>
          </Space>
        </Card>
      </div>
    </Layout>
  );
};

export default TransactionsPage;
