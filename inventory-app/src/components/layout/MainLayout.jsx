import { useState } from 'react';
import { Layout } from 'antd';
import Header from './Header';
import Sidebar from './Sidebar';

const { Content } = Layout;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} onCollapse={handleCollapse} />
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: 'margin-left 0.2s',
        }}
      >
        <Header />
        <Content
          style={{
            padding: '24px',
            backgroundColor: '#f0f2f5',
            minHeight: 'calc(100vh - 64px)',
            overflow: 'auto',
          }}
        >
          <div
            style={{
              padding: '24px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              minHeight: 'calc(100vh - 152px)',
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;