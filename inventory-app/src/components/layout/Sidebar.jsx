import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  UserOutlined,
  BarChartOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = ({ collapsed, onCollapse }) => {
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'inventory',
      icon: <AppstoreOutlined />,
      label: 'Inventory',
      children: [
        {
          key: 'products',
          label: 'Products',
        },
        {
          key: 'categories',
          label: 'Categories',
        },
        {
          key: 'suppliers',
          label: 'Suppliers',
        },
      ],
    },
    {
      key: 'orders',
      icon: <ShoppingCartOutlined />,
      label: 'Orders',
      children: [
        {
          key: 'purchase-orders',
          label: 'Purchase Orders',
        },
        {
          key: 'sales-orders',
          label: 'Sales Orders',
        },
      ],
    },
    {
      key: 'reports',
      icon: <BarChartOutlined />,
      label: 'Reports',
      children: [
        {
          key: 'inventory-report',
          label: 'Inventory Report',
        },
        {
          key: 'sales-report',
          label: 'Sales Report',
        },
      ],
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Users',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const handleMenuClick = ({ key }) => {
    console.log('Menu item clicked:', key);
    // Handle navigation logic here
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#001529',
      }}
    >
      <div
        style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #2d3748',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            color: '#fff',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
          onClick={onCollapse}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      </div>

      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['dashboard']}
        items={menuItems}
        onClick={handleMenuClick}
        style={{
          border: 'none',
        }}
      />
    </Sider>
  );
};

export default Sidebar;