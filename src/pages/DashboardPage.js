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
import { Button, Select, Card, Space, message } from "antd";

const { Option } = Select;

const DashboardPage = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedData, setSelectedData] = useState("amount");
  const [transactionData, setTransactionData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactions = await ApiService.getAllTransactions();
        if (transactions.length > 0) {
          setTransactionData(
            transformTransactionData(transactions, selectedMonth, selectedYear)
          );
        } else {
          setTransactionData([]);
          message.warning("No transactions found for the selected period.");
        }
      } catch (error) {
        message.error("Error fetching transactions: " + error.message);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear, selectedData]);

  const transformTransactionData = (transactions, month, year) => {
    const dailyData = {};
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      dailyData[day] = { day, count: 0, quantity: 0, amount: 0 };
    }

    transactions.forEach((transaction) => {
      if (!transaction.date) return; // Ensure transaction has a date

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

  return (
    <Layout>
      <div className="dashboard-page">
        <Card title="Dashboard" style={{ marginBottom: 20 }}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Space>
              <Button onClick={() => setSelectedData("count")}>
                Total Transactions
              </Button>
              <Button onClick={() => setSelectedData("quantity")}>
                Product Quantity
              </Button>
              <Button onClick={() => setSelectedData("amount")}>
                Total Amount
              </Button>
            </Space>

            <Space>
              <div>
                <label htmlFor="month-select">Select Month: </label>
                <Select
                  id="month-select"
                  value={selectedMonth}
                  onChange={(value) => setSelectedMonth(value)}
                  style={{ width: 150 }}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <Option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString("default", {
                        month: "long",
                      })}
                    </Option>
                  ))}
                </Select>
              </div>

              <div>
                <label htmlFor="year-select">Select Year: </label>
                <Select
                  id="year-select"
                  value={selectedYear}
                  onChange={(value) => setSelectedYear(value)}
                  style={{ width: 150 }}
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
              </div>
            </Space>
          </Space>
        </Card>

        <div className="chart-section">
          <div className="chart-container">
            <h3>Daily Transactions</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={transactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  label={{
                    value: "Day",
                    position: "insideBottomRight",
                    offset: -5,
                  }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type={"monotone"}
                  dataKey={selectedData}
                  stroke="#008080"
                  fillOpacity={0.3}
                  fill="#008080"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
