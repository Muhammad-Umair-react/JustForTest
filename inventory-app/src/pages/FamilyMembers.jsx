import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, DatePicker, Tag, Space, Row, Col, Statistic, Avatar, Descriptions, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined, UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

const FamilyMembers = () => {
  const [members, setMembers] = useState([
    {
      id: 1,
      name: 'Admin (You)',
      role: 'Admin',
      age: 35,
      phone: '+91 98765 43210',
      email: 'admin@family.com',
      relationship: 'Self',
      responsibilities: ['Financial Management', 'Task Assignment', 'Medical Records'],
      status: 'Active',
      joinDate: '2020-01-01',
      avatar: '👨‍💼',
    },
    {
      id: 2,
      name: 'Brother 1',
      role: 'Member',
      age: 32,
      phone: '+91 98765 43211',
      email: 'brother1@family.com',
      relationship: 'Brother',
      responsibilities: ['Security Tasks', 'Water Management'],
      status: 'Active',
      joinDate: '2020-01-01',
      avatar: '👨',
    },
    {
      id: 3,
      name: 'Brother 2',
      role: 'Member',
      age: 30,
      phone: '+91 98765 43212',
      email: 'brother2@family.com',
      relationship: 'Brother',
      responsibilities: ['Maintenance', 'Cleaning'],
      status: 'Active',
      joinDate: '2020-01-01',
      avatar: '👨',
    },
    {
      id: 4,
      name: 'Brother 3',
      role: 'Member',
      age: 28,
      phone: '+91 98765 43213',
      email: 'brother3@family.com',
      relationship: 'Brother',
      responsibilities: ['Water Tasks', 'Shopping'],
      status: 'Active',
      joinDate: '2020-01-01',
      avatar: '👨',
    },
    {
      id: 5,
      name: 'Brother 4',
      role: 'Member',
      age: 26,
      phone: '+91 98765 43214',
      email: 'brother4@family.com',
      relationship: 'Brother',
      responsibilities: ['Support Tasks', 'Errands'],
      status: 'Active',
      joinDate: '2020-01-01',
      avatar: '👨',
    },
    {
      id: 6,
      name: 'Sister-in-law 1',
      role: 'Member',
      age: 30,
      phone: '+91 98765 43215',
      email: 'sil1@family.com',
      relationship: 'Sister-in-law',
      responsibilities: ['Cooking', 'Cleaning'],
      status: 'Active',
      joinDate: '2021-06-15',
      avatar: '👩',
    },
    {
      id: 7,
      name: 'Sister-in-law 2',
      role: 'Member',
      age: 28,
      phone: '+91 98765 43216',
      email: 'sil2@family.com',
      relationship: 'Sister-in-law',
      responsibilities: ['Cooking', 'Childcare'],
      status: 'Active',
      joinDate: '2022-03-20',
      avatar: '👩',
    },
    {
      id: 8,
      name: 'Nephew',
      role: 'Child',
      age: 8,
      phone: 'N/A',
      email: 'N/A',
      relationship: 'Nephew',
      responsibilities: ['Studies', 'Small Tasks'],
      status: 'Active',
      joinDate: '2016-08-10',
      avatar: '👦',
    },
    {
      id: 9,
      name: 'Niece',
      role: 'Child',
      age: 6,
      phone: 'N/A',
      email: 'N/A',
      relationship: 'Niece',
      responsibilities: ['Studies', 'Small Tasks'],
      status: 'Active',
      joinDate: '2018-12-05',
      avatar: '👧',
    },
    {
      id: 10,
      name: 'Father',
      role: 'Elder',
      age: 65,
      phone: '+91 98765 43217',
      email: 'father@family.com',
      relationship: 'Father',
      responsibilities: ['Guidance', 'Decision Making'],
      status: 'Active',
      joinDate: '1985-01-01',
      avatar: '👴',
    },
    {
      id: 11,
      name: 'Mother',
      role: 'Elder',
      age: 60,
      phone: '+91 98765 43218',
      email: 'mother@family.com',
      relationship: 'Mother',
      responsibilities: ['Cooking', 'Caregiving'],
      status: 'Active',
      joinDate: '1985-01-01',
      avatar: '👵',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [form] = Form.useForm();

  const relationships = [
    'Self', 'Brother', 'Sister', 'Sister-in-law', 'Brother-in-law', 
    'Father', 'Mother', 'Nephew', 'Niece', 'Son', 'Daughter'
  ];

  const roles = [
    'Admin', 'Member', 'Elder', 'Child', 'Guest'
  ];

  const columns = [
    {
      title: 'Member',
      key: 'member',
      render: (_, record) => (
        <Space>
          <Avatar size={40} style={{ fontSize: '20px' }}>
            {record.avatar}
          </Avatar>
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.relationship}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const colors = {
          'Admin': 'red',
          'Member': 'blue',
          'Elder': 'purple',
          'Child': 'green',
          'Guest': 'orange'
        };
        return <Tag color={colors[role]}>{role}</Tag>;
      },
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div>{record.phone}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.email}</div>
        </div>
      ),
    },
    {
      title: 'Responsibilities',
      key: 'responsibilities',
      render: (_, record) => (
        <div>
          {record.responsibilities.map((resp, index) => (
            <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
              {resp}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'green' : 'red'}>
          {status}
        </Tag>
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
    const total = members.length;
    const active = members.filter(m => m.status === 'Active').length;
    const admins = members.filter(m => m.role === 'Admin').length;
    const children = members.filter(m => m.role === 'Child').length;

    return { total, active, admins, children };
  };

  const stats = getStatistics();

  const items = [
    {
      key: '1',
      label: 'All Members',
      children: (
        <Table
          columns={columns}
          dataSource={members}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      ),
    },
    {
      key: '2',
      label: 'Adults',
      children: (
        <Table
          columns={columns}
          dataSource={members.filter(m => m.role !== 'Child')}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      ),
    },
    {
      key: '3',
      label: 'Children',
      children: (
        <Table
          columns={columns}
          dataSource={members.filter(m => m.role === 'Child')}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 16 }}>
          <TeamOutlined style={{ marginRight: 8 }} />
          Family Members Management
        </h1>
        
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic title="Total Members" value={stats.total} prefix={<TeamOutlined />} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Active Members" value={stats.active} valueStyle={{ color: '#52c41a' }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Admins" value={stats.admins} valueStyle={{ color: '#cf1322' }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Children" value={stats.children} valueStyle={{ color: '#1890ff' }} />
            </Card>
          </Col>
        </Row>

        <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }}>
          Add New Member
        </Button>
      </div>

      <Card>
        <Tabs defaultActiveKey="1" items={items} />
      </Card>
    </div>
  );
};

export default FamilyMembers;