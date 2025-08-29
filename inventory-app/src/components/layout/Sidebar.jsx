import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  FileTextOutlined,
  CalendarOutlined,
  ScheduleOutlined,
  TeamOutlined,
  DollarOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = ({ collapsed, onCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'medical-reports',
      icon: <FileTextOutlined />,
      label: 'Medical Reports',
    },
    {
      key: 'appointments',
      icon: <CalendarOutlined />,
      label: 'Appointments',
    },
    {
      key: 'daily-schedule',
      icon: <ScheduleOutlined />,
      label: 'Daily Schedule',
    },
    {
      key: 'family-members',
      icon: <TeamOutlined />,
      label: 'Family Members',
    },
    {
      key: 'financial-tracker',
      icon: <DollarOutlined />,
      label: 'Financial Tracker',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const handleMenuClick = ({ key }) => {
    const routes = {
      'dashboard': '/',
      'medical-reports': '/medical-reports',
      'appointments': '/appointments',
      'daily-schedule': '/daily-schedule',
      'family-members': '/family-members',
      'financial-tracker': '/financial-tracker',
      'settings': '/settings'
    };
    
    if (routes[key]) {
      navigate(routes[key]);
    }
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
        selectedKeys={[location.pathname === '/' ? 'dashboard' : location.pathname.slice(1)]}
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