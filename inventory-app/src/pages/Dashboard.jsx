import { Card, Col, Row, Statistic, Table, Tag } from 'antd';
import {
  ShoppingCartOutlined,
  AppstoreOutlined,
  UserOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';

const Dashboard = () => {
  // Sample data for statistics
  const statisticsData = [
    {
      title: 'Total Products',
      value: 1234,
      icon: <AppstoreOutlined />,
      color: '#1890ff',
      trend: 'up',
      percentage: 12.5,
    },
    {
      title: 'Total Orders',
      value: 856,
      icon: <ShoppingCartOutlined />,
      color: '#52c41a',
      trend: 'up',
      percentage: 8.3,
    },
    {
      title: 'Total Revenue',
      value: 45678,
      prefix: '$',
      icon: <DollarOutlined />,
      color: '#faad14',
      trend: 'up',
      percentage: 15.2,
    },
    {
      title: 'Active Users',
      value: 234,
      icon: <UserOutlined />,
      color: '#722ed1',
      trend: 'down',
      percentage: 2.1,
    },
  ];

  // Sample data for recent orders table
  const recentOrdersData = [
    {
      key: '1',
      orderId: 'ORD001',
      customer: 'John Doe',
      product: 'Laptop',
      quantity: 2,
      total: 2500,
      status: 'Completed',
      date: '2024-01-15',
    },
    {
      key: '2',
      orderId: 'ORD002',
      customer: 'Jane Smith',
      product: 'Mouse',
      quantity: 10,
      total: 250,
      status: 'Pending',
      date: '2024-01-14',
    },
    {
      key: '3',
      orderId: 'ORD003',
      customer: 'Bob Johnson',
      product: 'Keyboard',
      quantity: 5,
      total: 375,
      status: 'Processing',
      date: '2024-01-13',
    },
  ];

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (value) => `$${value}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          Completed: 'green',
          Pending: 'orange',
          Processing: 'blue',
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '24px', color: '#1890ff' }}>Dashboard</h2>
      
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {statisticsData.map((stat, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.prefix}
                valueStyle={{ color: stat.color }}
                suffix={
                  <div style={{ fontSize: '14px', marginLeft: '8px' }}>
                    {stat.trend === 'up' ? (
                      <ArrowUpOutlined style={{ color: '#52c41a' }} />
                    ) : (
                      <ArrowDownOutlined style={{ color: '#ff4d4f' }} />
                    )}
                    <span style={{ marginLeft: '4px' }}>
                      {stat.percentage}%
                    </span>
                  </div>
                }
              />
              <div style={{ marginTop: '16px', fontSize: '32px', color: stat.color }}>
                {stat.icon}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Recent Orders Table */}
      <Card title="Recent Orders" style={{ marginBottom: '24px' }}>
        <Table
          columns={columns}
          dataSource={recentOrdersData}
          pagination={false}
          size="small"
        />
      </Card>

      {/* Additional Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Low Stock Items" size="small">
            <p>Items that need restocking soon:</p>
            <ul>
              <li>Laptop Stand - 5 units remaining</li>
              <li>USB Cable - 8 units remaining</li>
              <li>Wireless Mouse - 12 units remaining</li>
            </ul>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Quick Actions" size="small">
            <p>Frequently used actions:</p>
            <ul>
              <li>Add New Product</li>
              <li>Create Purchase Order</li>
              <li>Generate Report</li>
              <li>Manage Categories</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;