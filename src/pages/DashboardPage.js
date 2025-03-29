import React, { useEffect, useState } from "react";
import Layout from "../component/Layouts";
import ApiService from "../service/ApiService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  Card,
  Row,
  Col,
  Typography,
  Spin,
  Segmented,
  Empty,
  Statistic,
  message,
  ConfigProvider,
} from "antd";
import {
  CalendarOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";

const { Title } = Typography;
const { Option } = Select;

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 },
};

const DashboardPage = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedData, setSelectedData] = useState("amount");
  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(false);

  const dataOptions = [
    { label: "Total Amount", value: "amount", icon: <DollarOutlined /> },
    {
      label: "Product Quantity",
      value: "quantity",
      icon: <ShoppingCartOutlined />,
    },
    { label: "Transactions", value: "count", icon: <CalendarOutlined /> },
  ];

  const transformTransactionData = (transactions, month, year) => {
    const dailyData = {};
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      dailyData[day] = { day, count: 0, quantity: 0, amount: 0 };
    }

    transactions.forEach((transaction) => {
      if (!transaction.date) return;

      const transactionDate = new Date(transaction.date);
      const transactionMonth = transactionDate.getMonth() + 1;
      const transactionYear = transactionDate.getFullYear();

      if (transactionMonth === month && transactionYear === year) {
        const day = transactionDate.getDate();
        dailyData[day].count += 1;
        dailyData[day].quantity += transaction.totalProducts || 0;
        dailyData[day].amount += transaction.totalPrice || 0;
      }
    });

    return Object.values(dailyData);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const transactions = await ApiService.getTransactions();
        const filteredData = transformTransactionData(
          transactions,
          selectedMonth,
          selectedYear
        );

        setTransactionData(filteredData);
        if (filteredData.length === 0) {
          message.info("No transactions found for the selected period");
        }
      } catch (error) {
        message.error("Error fetching transactions: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear, selectedData]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Segmented: {
            itemActiveBg: "#1890ff",
            itemColor: "#1890ff",
            itemHoverColor: "#40a9ff",
            motionDurationSlow: "0.3s",
          },
          Select: {
            optionActiveBg: "#e6f7ff",
            optionSelectedBg: "#bae7ff",
            motionDurationSlow: "0.2s",
          },
        },
      }}
    >
      <Layout>
        <div className="dashboard-page" style={{ padding: 24 }}>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card
                title={
                  <Title level={4} style={{ margin: 0 }}>
                    Transaction Analytics
                  </Title>
                }
                extra={
                  <Select
                    value={selectedYear}
                    onChange={setSelectedYear}
                    style={{ width: 120 }}
                    suffixIcon={<CalendarOutlined />}
                  >
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <Option key={year} value={year}>
                          {year}
                        </Option>
                      );
                    })}
                  </Select>
                }
                style={{
                  marginBottom: 20,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                hoverable
              >
                <Row gutter={[24, 24]}>
                  <Col span={24}>
                    <Segmented
                      options={dataOptions}
                      value={selectedData}
                      onChange={setSelectedData}
                      size="large"
                      block
                    />
                  </Col>

                  <Col span={24}>
                    <Row gutter={[24, 24]} align="middle">
                      <Col flex="none">
                        <Select
                          value={selectedMonth}
                          onChange={setSelectedMonth}
                          style={{ width: 150 }}
                          suffixIcon={<CalendarOutlined />}
                        >
                          {Array.from({ length: 12 }, (_, i) => (
                            <Option key={i + 1} value={i + 1}>
                              {new Date(0, i).toLocaleString("default", {
                                month: "long",
                              })}
                            </Option>
                          ))}
                        </Select>
                      </Col>

                      <Col flex="auto">
                        {loading ? (
                          <Spin tip="Loading data..." />
                        ) : transactionData.length > 0 ? (
                          <motion.div {...fadeIn}>
                            <ResponsiveContainer width="100%" height={400}>
                              <LineChart data={transactionData}>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  opacity={0.5}
                                />
                                <XAxis
                                  dataKey="day"
                                  label={{
                                    value: "Day of Month",
                                    position: "insideBottom",
                                    offset: -10,
                                  }}
                                  tick={{ fill: "#595959" }}
                                />
                                <YAxis
                                  tickFormatter={(value) =>
                                    selectedData === "amount"
                                      ? `$${value}`
                                      : value
                                  }
                                />
                                <Tooltip
                                  contentStyle={{
                                    borderRadius: 8,
                                    boxShadow:
                                      "0 3px 6px -4px rgba(0,0,0,0.12)",
                                  }}
                                  formatter={(value) =>
                                    selectedData === "amount"
                                      ? `$${value.toLocaleString()}`
                                      : value
                                  }
                                />
                                <Legend
                                  verticalAlign="top"
                                  wrapperStyle={{ paddingBottom: 20 }}
                                />
                                <Line
                                  type="monotone"
                                  dataKey={selectedData}
                                  stroke="#1890ff"
                                  strokeWidth={2}
                                  dot={{ fill: "#1890ff", strokeWidth: 2 }}
                                  activeDot={{ r: 6 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </motion.div>
                        ) : (
                          <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="No transaction data available"
                          />
                        )}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
            </motion.div>

            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
              <Col span={8}>
                <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
                  <Card hoverable>
                    <Statistic
                      title="Total Transactions"
                      value={transactionData.reduce(
                        (sum, item) => sum + item.count,
                        0
                      )}
                      prefix={<CalendarOutlined />}
                    />
                  </Card>
                </motion.div>
              </Col>
              <Col span={8}>
                <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
                  <Card hoverable>
                    <Statistic
                      title="Total Products Sold"
                      value={transactionData.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      )}
                      prefix={<ShoppingCartOutlined />}
                    />
                  </Card>
                </motion.div>
              </Col>
              <Col span={8}>
                <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
                  <Card hoverable>
                    <Statistic
                      title="Total Revenue"
                      value={transactionData.reduce(
                        (sum, item) => sum + item.amount,
                        0
                      )}
                      prefix={<DollarOutlined />}
                      precision={2}
                      valueStyle={{ color: "#52c41a" }}
                    />
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </AnimatePresence>
        </div>
      </Layout>
    </ConfigProvider>
  );
};

export default DashboardPage;
