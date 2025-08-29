import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, TimePicker, Tag, Space, Row, Col, Statistic, Checkbox, Progress, Timeline } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ScheduleOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

const DailySchedule = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      task: 'Open main door lock',
      time: '06:00',
      assignedTo: 'Brother 1',
      priority: 'High',
      status: 'Completed',
      category: 'Security',
      notes: 'Check if lock is working properly',
    },
    {
      id: 2,
      task: 'Turn on motor to fill water tank',
      time: '06:30',
      assignedTo: 'Brother 2',
      priority: 'High',
      status: 'Pending',
      category: 'Water',
      notes: 'Fill tank completely',
    },
    {
      id: 3,
      task: 'Fill drinking water drum',
      time: '07:00',
      assignedTo: 'Brother 3',
      priority: 'Medium',
      status: 'Pending',
      category: 'Water',
      notes: 'Use filtered water',
    },
    {
      id: 4,
      task: 'Collect money for water expenses',
      time: '08:00',
      assignedTo: 'Admin (You)',
      priority: 'High',
      status: 'Pending',
      category: 'Financial',
      notes: 'Collect from all brothers',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form] = Form.useForm();

  const familyMembers = [
    'Admin (You)', 'Brother 1', 'Brother 2', 'Brother 3', 'Brother 4',
    'Sister-in-law 1', 'Sister-in-law 2', 'Nephew', 'Niece', 'Father', 'Mother'
  ];

  const categories = [
    'Security', 'Water', 'Financial', 'Cleaning', 'Maintenance', 'Other'
  ];

  const priorities = [
    { value: 'Low', color: 'green' },
    { value: 'Medium', color: 'orange' },
    { value: 'High', color: 'red' },
    { value: 'Critical', color: 'purple' }
  ];

  const columns = [
    {
      title: 'Task',
      dataIndex: 'task',
      key: 'task',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.notes}</div>
        </div>
      ),
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render: (time) => (
        <div style={{ textAlign: 'center' }}>
          <ClockCircleOutlined style={{ marginRight: 4 }} />
          {time}
        </div>
      ),
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (text) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => {
        const level = priorities.find(p => p.value === priority);
        return <Tag color={level?.color}>{priority}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === 'Completed' ? 'green' : 
                     status === 'In Progress' ? 'orange' : 'red';
        const icon = status === 'Completed' ? <CheckCircleOutlined /> : null;
        return <Tag color={color} icon={icon}>{status}</Tag>;
      },
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
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const pending = tasks.filter(t => t.status === 'Pending').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, inProgress, completionRate };
  };

  const stats = getStatistics();

  const todayTasks = tasks.filter(task => {
    const taskTime = dayjs(`2024-01-29 ${task.time}`);
    const now = dayjs();
    return taskTime.isAfter(now.subtract(1, 'hour')) && taskTime.isBefore(now.add(12, 'hour'));
  });

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 16 }}>
          <ScheduleOutlined style={{ marginRight: 8 }} />
          Daily Schedule & Tasks
        </h1>
        
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic title="Total Tasks" value={stats.total} prefix={<ScheduleOutlined />} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Completed" value={stats.completed} valueStyle={{ color: '#52c41a' }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Pending" value={stats.pending} valueStyle={{ color: '#fa8c16' }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Completion Rate" value={stats.completionRate} suffix="%" valueStyle={{ color: '#1890ff' }} />
            </Card>
          </Col>
        </Row>

        <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }}>
          Add New Task
        </Button>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={16}>
          <Card title="Today's Tasks">
            <Table
              columns={columns}
              dataSource={tasks}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Today's Progress">
            <Progress
              type="circle"
              percent={stats.completionRate}
              format={percent => `${percent}%`}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
            <div style={{ marginTop: 16 }}>
              <h4>Task Breakdown:</h4>
              <div>✅ Completed: {stats.completed}</div>
              <div>⏳ Pending: {stats.pending}</div>
              <div>🔄 In Progress: {stats.inProgress}</div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="Timeline View">
        <Timeline>
          {todayTasks.map(task => (
            <Timeline.Item
              key={task.id}
              color={task.status === 'Completed' ? 'green' : task.status === 'In Progress' ? 'orange' : 'red'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{task.task}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    Assigned to: {task.assignedTo} | {task.time}
                  </div>
                </div>
                <Tag color={task.status === 'Completed' ? 'green' : 'orange'}>
                  {task.status}
                </Tag>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>
    </div>
  );
};

export default DailySchedule;