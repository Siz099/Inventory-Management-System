import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  AppstoreAddOutlined,
  TransactionOutlined,
  ProfileOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  ContainerOutlined,
  // UserAddOutlined, // Remove if not needed
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import ApiService from "../service/ApiService"; // Ensure correct import path
import { useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const Layouts = ({ children }) => {
  const navigate = useNavigate();
  const logout = () => {
    ApiService.logout();
    navigate("/login"); // Redirect to login after logout
  };

  const isAuth = ApiService.isAuthenticated();
  const isAdmin = ApiService.isAdmin();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header */}
      <Header style={{ background: "#001529", padding: 0 }}>
        <div
          className="logo"
          style={{ color: "#fff", fontSize: "20px", paddingLeft: "20px" }}
        >
          <h1>IMS</h1>
        </div>
      </Header>

      <Layout>
        {/* Sidebar */}
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            style={{ height: "100%", borderRight: 0 }}
          >
            {isAuth && (
              <Menu.Item key="1" icon={<DashboardOutlined />}>
                <Link to="/dashboard">Dashboard</Link>
              </Menu.Item>
            )}

            {isAuth && (
              <Menu.Item key="2" icon={<TransactionOutlined />}>
                <Link to="/transaction">Transactions</Link>
              </Menu.Item>
            )}

            {/* Admin-Only Links */}
            {isAdmin && (
              <>
                <Menu.Item key="3" icon={<AppstoreOutlined />}>
                  <Link to="/category">Category</Link>
                </Menu.Item>
                <Menu.Item key="4" icon={<AppstoreAddOutlined />}>
                  <Link to="/product">Product</Link>
                </Menu.Item>
                <Menu.Item key="5" icon={<ContainerOutlined />}>
                  <Link to="/supplier">Supplier</Link>
                </Menu.Item>
              </>
            )}

            {/* Authenticated User Links */}
            {isAuth && (
              <>
                <Menu.Item key="6" icon={<ProfileOutlined />}>
                  <Link to="/profile">Profile</Link>
                </Menu.Item>
                <Menu.Item key="7" icon={<LogoutOutlined />} onClick={logout}>
                  Logout
                </Menu.Item>
              </>
            )}
          </Menu>
        </Sider>

        {/* Main content */}
        <Layout style={{ padding: "0 24px 24px" }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: "#fff",
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Layouts;
