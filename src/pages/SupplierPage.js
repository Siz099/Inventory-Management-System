import React, { useState, useEffect } from "react";
import Layout from "../component/Layouts";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import { Collapse } from "antd"; // Import Collapse from Ant Design

const { Panel } = Collapse; // Extract Panel component from Collapse

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch suppliers on component mount
  useEffect(() => {
    const getSuppliers = async () => {
      try {
        const responseData = await ApiService.getAllSuppliers();
        console.log("Fetched Suppliers:", responseData); // ✅ Debugging log
        setSuppliers(responseData); // ✅ Corrected
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Getting Suppliers: " + error
        );
        console.error("Fetching suppliers error:", error);
      }
    };
    getSuppliers();
  }, []);

  // Display message for a short time
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  // Handle delete supplier action
  const handleDeleteSupplier = async (supplierId) => {
    try {
      if (window.confirm("Are you sure you want to delete this supplier? ")) {
        await ApiService.deleteSupplier(supplierId);
        setSuppliers((prev) => prev.filter((sup) => sup.id !== supplierId)); // ✅ Update state instead of reloading
      }
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error Deleting Supplier: " + error
      );
    }
  };

  return (
    <Layout>
      {message && <div className="message">{message}</div>}
      <div className="supplier-page">
        <div className="supplier-header">
          <h1>Suppliers</h1>
          <button onClick={() => navigate("/add-supplier")}>
            Add Supplier
          </button>
        </div>

        {/* Display collapse only if suppliers exist */}
        {Array.isArray(suppliers) && suppliers.length > 0 ? (
          <Collapse accordion>
            {suppliers.map((supplier) => (
              <Panel header={supplier.name} key={supplier.id}>
                <div className="supplier-actions">
                  {/* Edit and delete buttons */}
                  <button
                    onClick={() => navigate(`/edit-supplier/${supplier.id}`)}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDeleteSupplier(supplier.id)}>
                    Delete
                  </button>
                </div>
                <div className="supplier-details">
                  {/* Display supplier details in a table */}
                  <table>
                    <tbody>
                      <tr>
                        <th>Name:</th>
                        <td>{supplier.name}</td>
                      </tr>
                      <tr>
                        <th>Contact Info:</th>
                        <td>{supplier.contactInfo}</td>
                      </tr>
                      <tr>
                        <th>Address:</th>
                        <td>{supplier.address}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Panel>
            ))}
          </Collapse>
        ) : (
          <p>No suppliers found.</p>
        )}
      </div>
    </Layout>
  );
};

export default SupplierPage;
