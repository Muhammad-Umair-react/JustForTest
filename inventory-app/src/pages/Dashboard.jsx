import { Card, Col, Row, Statistic, Table, Tag, Spin } from 'antd';
import {
  ShoppingCartOutlined,
  AppstoreOutlined,
  UserOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { useInventory } from '../contexts/Inventory/InventoryContext';

const Dashboard = () => {
  const { 
    items, 
    isLoading, 
    totalItems, 
    totalValue, 
    totalPotentialProfit, 
    profitMargin,
    categories,
    lowStockItems 
  } = useInventory();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Sample data for recent orders table
  const recentOrdersData = [
    {
      key: '1',
      orderId: 'ORD001',
      customer: 'Bike Shop Pro',
      product: 'Mountain Bike Tire',
      quantity: 2,
      total: 90,
      status: 'Completed',
      date: '2024-01-15',
    },
    {
      key: '2',
      orderId: 'ORD002',
      customer: 'Cycle World',
      product: 'Road Bike Chain',
      quantity: 5,
      total: 175,
      status: 'Pending',
      date: '2024-01-14',
    },
    {
      key: '3',
      orderId: 'ORD003',
      customer: 'Speedy Bikes',
      product: 'Disc Brake Pads',
      quantity: 10,
      total: 250,
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

  const lowStockColumns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Stock',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity) => (
        <Tag color={quantity <= 5 ? 'red' : 'orange'}>
          {quantity} units
        </Tag>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price}`,
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '24px', color: '#1890ff' }}>
        🚴‍♂️ Bike Parts Inventory Dashboard
      </h2>
      
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Products"
              value={totalItems}
              valueStyle={{ color: '#1890ff' }}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Value"
              value={totalValue}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#52c41a' }}
              suffix={
                <div style={{ fontSize: '14px', marginLeft: '8px' }}>
                  <ArrowUpOutlined style={{ color: '#52c41a' }} />
                  <span style={{ marginLeft: '4px' }}>8.3%</span>
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Potential Profit"
              value={totalPotentialProfit}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#faad14' }}
              suffix={
                <div style={{ fontSize: '14px', marginLeft: '8px' }}>
                  <ArrowUpOutlined style={{ color: '#52c41a' }} />
                  <span style={{ marginLeft: '4px' }}>15.2%</span>
                </div>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Categories"
              value={categories}
              valueStyle={{ color: '#722ed1' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Profit Margin Card */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Profit Margin"
              value={profitMargin}
              precision={1}
              suffix="%"
              valueStyle={{ color: profitMargin > 25 ? '#52c41a' : '#faad14' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Low Stock Items"
              value={lowStockItems.length}
              valueStyle={{ color: lowStockItems.length > 0 ? '#ff4d4f' : '#52c41a' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Total Quantity"
              value={items.reduce((sum, item) => sum + item.quantity, 0)}
              valueStyle={{ color: '#1890ff' }}
              prefix={<AppstoreOutlined />}
              suffix="units"
            />
          </Card>
        </Col>
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

      {/* Low Stock Items and Product Categories */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card 
            title={
              <span>
                <WarningOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
                Low Stock Items
              </span>
            }
          >
            {lowStockItems.length > 0 ? (
              <Table
                columns={lowStockColumns}
                dataSource={lowStockItems}
                pagination={false}
                size="small"
              />
            ) : (
              <p style={{ color: '#52c41a' }}>✅ All items are well stocked!</p>
            )}
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Product Categories">
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {items.reduce((categories, item) => {
                const category = item.category;
                if (!categories[category]) {
                  categories[category] = [];
                }
                categories[category].push(item);
                return categories;
              }, {})}
              {Object.entries(
                items.reduce((categories, item) => {
                  const category = item.category;
                  if (!categories[category]) {
                    categories[category] = { count: 0, value: 0 };
                  }
                  categories[category].count++;
                  categories[category].value += item.price * item.quantity;
                  return categories;
                }, {})
              ).map(([category, data]) => (
                <div key={category} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold' }}>{category}</span>
                    <Tag color="blue">{data.count} items</Tag>
                  </div>
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    Total Value: ${data.value.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;