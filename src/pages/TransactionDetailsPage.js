import React, { useState, useEffect } from "react";
import Layout from "../component/Layouts";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const TransactionDetailsPage = () => {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getTransaction = async () => {
      try {
        const transactionData = await ApiService.getTransactionById(
          transactionId
        );
        console.log(transactionData); // Log the response to verify if transaction data is available

        if (transactionData) {
          setTransaction(transactionData); // Set the whole transaction data
        } else {
          showMessage("Transaction not found.");
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message ||
            "Error Getting the transaction: " + error
        );
      }
    };

    getTransaction();
  }, [transactionId]);

  // Method to show message or errors
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  return (
    <Layout>
      {message && <p className="message">{message}</p>}
      <div className="transaction-details-page">
        {transaction ? (
          <>
            {/* Transaction base information */}
            <div className="section-card">
              <h2>Transaction Information</h2>
              <p>Type: {transaction.type}</p>
              <p>Status: {transaction.status}</p>
              <p>Description: {transaction.description}</p>
              <p>Note: {transaction.note}</p>
              <p>Total Products: {transaction.quantity}</p>
              <p>Total Price: {transaction.totalPrice.toFixed(2)}</p>
              <p>Created At: {new Date(transaction.date).toLocaleString()}</p>
              {transaction.updatedAt && (
                <p>
                  Updated At: {new Date(transaction.updatedAt).toLocaleString()}
                </p>
              )}
            </div>
          </>
        ) : (
          <p>Loading transaction details...</p>
        )}
      </div>
    </Layout>
  );
};

export default TransactionDetailsPage;
