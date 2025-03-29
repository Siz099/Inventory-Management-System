import React from "react";
import { Layout, Menu, theme, Typography, Divider } from "antd";
import {
  DashboardOutlined,
  AppstoreAddOutlined,
  TransactionOutlined,
  ProfileOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  ContainerOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  UsergroupAddOutlined, // Added UsergroupAddOutlined for User Management
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ApiService from "../service/ApiService";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const Layouts = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const logout = () => {
    ApiService.logout();
    navigate("/login");
  };

  const isAuth = ApiService.isAuthenticated();
  const isAdmin = ApiService.isAdmin();

  // Get current path for selected menu item
  const getSelectedKey = () => {
    const path = location.pathname;
    const menuItems = {
      "/dashboard": "1",
      "/transaction": "2",
      "/sell": "3",
      "/purchase": "4",
      "/category": "5",
      "/product": "6",
      "/supplier": "7",
      "/profile": "8",
      "/users": "9", // Added users route for selection
    };
    return [menuItems[path] || "1"];
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: colorBgContainer,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <AppstoreOutlined style={{ fontSize: 24, color: "#1890ff" }} />
          <Title level={3} style={{ margin: 0 }}>
            IMS
          </Title>
        </div>
        {isAuth && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ProfileOutlined />
            <span>{ApiService.getLoggedInUserInfo()?.name || "User"}</span>
          </div>
        )}
      </Header>
      <Layout>
        <Sider
          width={250}
          style={{
            background: colorBgContainer,
            borderRight: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={getSelectedKey()}
            style={{ padding: "16px 0", height: "100%" }}
            theme="light"
          >
            {isAuth && (
              <>
                <Menu.Item key="1" icon={<DashboardOutlined />}>
                  <Link to="/dashboard">Dashboard</Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<TransactionOutlined />}>
                  <Link to="/transaction">Transactions</Link>
                </Menu.Item>

                {/* Sell and Purchase as top-level items */}
                <Menu.Item key="3" icon={<ShoppingCartOutlined />}>
                  <Link to="/sell">Sell Product</Link>
                </Menu.Item>
                <Menu.Item key="4" icon={<ShopOutlined />}>
                  <Link to="/purchase">Purchase Product</Link>
                </Menu.Item>

                {isAdmin && (
                  <>
                    <Divider orientation="left" style={{ margin: "16px 0" }}>
                      Management
                    </Divider>
                    <Menu.ItemGroup>
                      <Menu.Item key="5" icon={<AppstoreOutlined />}>
                        <Link to="/category">Categories</Link>
                      </Menu.Item>
                      <Menu.Item key="6" icon={<AppstoreAddOutlined />}>
                        <Link to="/product">Products</Link>
                      </Menu.Item>
                      <Menu.Item key="7" icon={<ContainerOutlined />}>
                        <Link to="/supplier">Suppliers</Link>
                      </Menu.Item>
                    </Menu.ItemGroup>

                    {/* Added User Management menu item for admins */}
                    <Menu.Item key="9" icon={<UsergroupAddOutlined />}>
                      <Link to="/users">Users</Link>
                    </Menu.Item>
                  </>
                )}

                <Divider orientation="left" style={{ margin: "16px 0" }}>
                  Account
                </Divider>
                <Menu.Item key="8" icon={<ProfileOutlined />}>
                  <Link to="/profile">Profile Settings</Link>
                </Menu.Item>
                <Menu.Item
                  key="10"
                  icon={<LogoutOutlined />}
                  onClick={logout}
                  danger
                >
                  Logout
                </Menu.Item>
              </>
            )}
          </Menu>
        </Sider>

        <Layout style={{ padding: "24px" }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
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
