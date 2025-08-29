import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, DatePicker, Tag, Space, Row, Col, Statistic, Progress, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, DollarOutlined, TrendingUpOutlined, WalletOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

const FinancialTracker = () => {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'Expense',
      category: 'Water',
      amount: 500,
      paidBy: 'Admin (You)',
      paidTo: 'Water Department',
      date: '2024-01-15',
      description: 'Monthly water bill',
      status: 'Paid',
      splitBetween: ['Brother 1', 'Brother 2', 'Brother 3', 'Brother 4'],
    },
    {
      id: 2,
      type: 'Expense',
      category: 'Electricity',
      amount: 800,
      paidBy: 'Brother 1',
      paidTo: 'Electricity Board',
      date: '2024-01-20',
      description: 'Monthly electricity bill',
      status: 'Paid',
      splitBetween: ['Admin (You)', 'Brother 1', 'Brother 2', 'Brother 3', 'Brother 4'],
    },
    {
      id: 3,
      type: 'Expense',
      category: 'Groceries',
      amount: 1200,
      paidBy: 'Sister-in-law 1',
      paidTo: 'Local Market',
      date: '2024-01-25',
      description: 'Weekly groceries',
      status: 'Paid',
      splitBetween: ['Admin (You)', 'Brother 1', 'Brother 2', 'Brother 3', 'Brother 4'],
    },
    {
      id: 4,
      type: 'Income',
      category: 'Salary',
      amount: 5000,
      paidBy: 'Company',
      paidTo: 'Admin (You)',
      date: '2024-01-30',
      description: 'Monthly salary',
      status: 'Received',
      splitBetween: [],
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [form] = Form.useForm();

  const familyMembers = [
    'Admin (You)', 'Brother 1', 'Brother 2', 'Brother 3', 'Brother 4',
    'Sister-in-law 1', 'Sister-in-law 2', 'Nephew', 'Niece', 'Father', 'Mother'
  ];

  const categories = [
    'Water', 'Electricity', 'Groceries', 'Medical', 'Education', 'Entertainment', 'Transport', 'Other'
  ];

  const transactionTypes = [
    'Income', 'Expense'
  ];

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'Income' ? 'green' : 'red'}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => (
        <span style={{ 
          color: record.type === 'Income' ? '#52c41a' : '#f5222d',
          fontWeight: 'bold'
        }}>
          ₹{amount.toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Paid By',
      dataIndex: 'paidBy',
      key: 'paidBy',
    },
    {
      title: 'Paid To',
      dataIndex: 'paidTo',
      key: 'paidTo',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Paid' || status === 'Received' ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Split Between',
      key: 'splitBetween',
      render: (_, record) => (
        <div>
          {record.splitBetween.map((member, index) => (
            <Tag key={index} color="purple" style={{ marginBottom: 2 }}>
              {member}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" icon={<EditOutlined />} size="small">
            Edit
          </Button>
          <Button type="primary" danger icon={<DeleteOutlined />} size="small">
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const getStatistics = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpense;
    const pendingAmount = transactions
      .filter(t => t.status === 'Pending')
      .reduce((sum, t) => sum + t.amount, 0);

    return { totalIncome, totalExpense, balance, pendingAmount };
  };

  const stats = getStatistics();

  const getCategoryData = () => {
    const categoryTotals = {};
    transactions
      .filter(t => t.type === 'Expense')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: amount,
    }));
  };

  const categoryData = getCategoryData();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B'];

  const getMonthlyData = () => {
    const monthlyData = {};
    transactions.forEach(t => {
      const month = dayjs(t.date).format('MMM YYYY');
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }
      if (t.type === 'Income') {
        monthlyData[month].income += t.amount;
      } else {
        monthlyData[month].expense += t.amount;
      }
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense,
    }));
  };

  const monthlyData = getMonthlyData();

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 16 }}>
          <DollarOutlined style={{ marginRight: 8 }} />
          Financial Tracker
        </h1>
        
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic 
                title="Total Income" 
                value={stats.totalIncome} 
                prefix="₹" 
                valueStyle={{ color: '#52c41a' }}
                prefix={<TrendingUpOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="Total Expenses" 
                value={stats.totalExpense} 
                prefix="₹" 
                valueStyle={{ color: '#f5222d' }}
                prefix={<WalletOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="Balance" 
                value={stats.balance} 
                prefix="₹" 
                valueStyle={{ color: stats.balance >= 0 ? '#52c41a' : '#f5222d' }}
                prefix={<DollarOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="Pending Amount" 
                value={stats.pendingAmount} 
                prefix="₹" 
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>

        <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }}>
          Add New Transaction
        </Button>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={16}>
          <Card title="Recent Transactions">
            <Table
              columns={columns}
              dataSource={transactions}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Expense by Category">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Card title="Monthly Income vs Expenses">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="income" 
              stroke="#52c41a" 
              strokeWidth={2}
              name="Income"
            />
            <Line 
              type="monotone" 
              dataKey="expense" 
              stroke="#f5222d" 
              strokeWidth={2}
              name="Expense"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default FinancialTracker;