import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Use Routes instead of Switch in React Router v6+
import { AuthGuard, AdminGuard } from "./service/Guard"; // Updated imports
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CategoryPage from "./pages/CategoryPage";
import SupplierPage from "./pages/SupplierPage";
import AddEditSupplierPage from "./pages/AddEditSupplierPage";
import ProductPage from "./pages/ProductPage";
import AddEditProductPage from "./pages/AddEditProductPage";
import PurchasePage from "./pages/PurchasePage";
import SellPage from "./pages/SellPage";
import TransactionsPage from "./pages/TransactionsPage";
import TransactionDetailsPage from "./pages/TransactionDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import UserListPage from "./pages/UserListPage"; // Import UserListPage
import AddEditUserPage from "./pages/AddEditUserPage"; // Import AddEditUserPage
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes Inside Layout */}
          {/* Admin Routes */}
          <Route
            path="/category"
            element={
              <AdminGuard>
                <CategoryPage />
              </AdminGuard>
            }
          />
          <Route
            path="/supplier"
            element={
              <AdminGuard>
                <SupplierPage />
              </AdminGuard>
            }
          />
          <Route
            path="/add-supplier"
            element={
              <AdminGuard>
                <AddEditSupplierPage />
              </AdminGuard>
            }
          />
          <Route
            path="/edit-supplier/:supplierId"
            element={
              <AdminGuard>
                <AddEditSupplierPage />
              </AdminGuard>
            }
          />
          <Route
            path="/product"
            element={
              <AdminGuard>
                <ProductPage />
              </AdminGuard>
            }
          />
          <Route
            path="/add-product"
            element={
              <AdminGuard>
                <AddEditProductPage />
              </AdminGuard>
            }
          />
          <Route
            path="/edit-product/:productId"
            element={
              <AdminGuard>
                <AddEditProductPage />
              </AdminGuard>
            }
          />

          {/* User Management (Admin Routes) */}
          <Route
            path="/users"
            element={
              <AdminGuard>
                <UserListPage />
              </AdminGuard>
            }
          />
          <Route
            path="/add-user"
            element={
              <AdminGuard>
                <AddEditUserPage />
              </AdminGuard>
            }
          />
          <Route
            path="/edit-user/:userId"
            element={
              <AdminGuard>
                <AddEditUserPage />
              </AdminGuard>
            }
          />

          {/* Authenticated Routes (for all users) */}
          <Route
            path="/purchase"
            element={
              <AuthGuard>
                <PurchasePage />
              </AuthGuard>
            }
          />
          <Route
            path="/sell"
            element={
              <AuthGuard>
                <SellPage />
              </AuthGuard>
            }
          />
          <Route
            path="/transaction"
            element={
              <AuthGuard>
                <TransactionsPage />
              </AuthGuard>
            }
          />
          <Route
            path="/transaction/:transactionId"
            element={
              <AuthGuard>
                <TransactionDetailsPage />
              </AuthGuard>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthGuard>
                <ProfilePage />
              </AuthGuard>
            }
          />
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <DashboardPage />
              </AuthGuard>
            }
          />

          {/* Default Route */}
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
