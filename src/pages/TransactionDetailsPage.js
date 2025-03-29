import React, { useState, useEffect } from "react";
import Layout from "../component/Layouts";
import ApiService from "../service/ApiService";
import { useParams } from "react-router-dom";
import { Card, Tag, Typography, Spin, Alert, Row, Col, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Text } = Typography;

const TransactionDetailsPage = () => {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getTransaction = async () => {
      setLoading(true);
      try {
        const transactionData = await ApiService.getTransactionById(
          transactionId
        );
        if (transactionData) {
          setTransaction(transactionData);
        } else {
          setError("Transaction not found");
        }
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Error fetching transaction details: " + error.message
        );
      } finally {
        setLoading(false);
      }
    };

    getTransaction();
  }, [transactionId]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "green";
      case "pending":
        return "orange";
      case "failed":
        return "red";
      default:
        return "gray";
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "sale":
        return "blue";
      case "purchase":
        return "purple";
      case "return":
        return "volcano";
      default:
        return "geekblue";
    }
  };

  return (
    <Layout>
      <div style={{ padding: 24 }}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => window.history.back()}
          style={{ marginBottom: 16 }}
        >
          Back to Transactions
        </Button>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        <Spin spinning={loading}>
          {transaction ? (
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Card title="Transaction Overview">
                  <Row gutter={[24, 16]}>
                    <Col xs={24} md={12}>
                      <Text strong>Transaction ID: </Text>
                      <Text>{transaction.id}</Text>
                    </Col>
                    <Col xs={24} md={12}>
                      <Text strong>Type: </Text>
                      <Tag color={getTypeColor(transaction.type)}>
                        {transaction.type?.toUpperCase() || "N/A"}
                      </Tag>
                    </Col>
                    <Col xs={24} md={12}>
                      <Text strong>Status: </Text>
                      <Tag color={getStatusColor(transaction.status)}>
                        {transaction.status?.toUpperCase() || "N/A"}
                      </Tag>
                    </Col>
                    <Col xs={24} md={12}>
                      <Text strong>Total Price: </Text>
                      <Text>
                        ${transaction.totalPrice?.toFixed(2) || "0.00"}
                      </Text>
                    </Col>
                    <Col xs={24} md={12}>
                      <Text strong>Total Products: </Text>
                      <Text>{transaction.quantity || "0"}</Text>
                    </Col>
                    <Col xs={24} md={12}>
                      <Text strong>Transaction Date: </Text>
                      <Text>
                        {transaction.date
                          ? new Date(transaction.date).toLocaleString()
                          : "N/A"}
                      </Text>
                    </Col>
                    {transaction.updatedAt && (
                      <Col xs={24} md={12}>
                        <Text strong>Last Updated: </Text>
                        <Text>
                          {new Date(transaction.updatedAt).toLocaleString()}
                        </Text>
                      </Col>
                    )}
                  </Row>
                </Card>
              </Col>

              <Col span={24}>
                <Card title="Additional Information">
                  <Row gutter={[24, 16]}>
                    <Col span={24}>
                      <Text strong>Description: </Text>
                      <Text>
                        {transaction.description || "No description available"}
                      </Text>
                    </Col>
                    <Col span={24}>
                      <Text strong>Notes: </Text>
                      <Text>{transaction.note || "No notes available"}</Text>
                    </Col>
                  </Row>
                </Card>
              </Col>

              {/* Add products section if your transaction data includes products */}
              {/* {transaction.products && (
                <Col span={24}>
                  <Card title="Products">
                    // Add product list/table component here
                  </Card>
                </Col>
              )} */}
            </Row>
          ) : (
            !loading &&
            !error && (
              <Alert
                message="Info"
                description="No transaction details found"
                type="info"
                showIcon
              />
            )
          )}
        </Spin>
      </div>
    </Layout>
  );
};

export default TransactionDetailsPage;
