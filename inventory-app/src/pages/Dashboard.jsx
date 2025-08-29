import { Card, Col, Row, Statistic, Table, Tag, Progress, Timeline, Space } from 'antd';
import {
  TeamOutlined,
  FileTextOutlined,
  CalendarOutlined,
  ScheduleOutlined,
  DollarOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const Dashboard = () => {
  // Sample data for statistics
  const statisticsData = [
    {
      title: 'Family Members',
      value: 11,
      icon: <TeamOutlined />,
      color: '#1890ff',
    },
    {
      title: 'Medical Reports',
      value: 8,
      icon: <FileTextOutlined />,
      color: '#52c41a',
    },
    {
      title: 'Today\'s Tasks',
      value: 4,
      icon: <ScheduleOutlined />,
      color: '#faad14',
    },
    {
      title: 'Pending Appointments',
      value: 2,
      icon: <CalendarOutlined />,
      color: '#722ed1',
    },
  ];

  // Sample data for today's tasks
  const todayTasksData = [
    {
      key: '1',
      task: 'Open main door lock',
      assignedTo: 'Brother 1',
      time: '06:00',
      status: 'Completed',
      priority: 'High',
    },
    {
      key: '2',
      task: 'Turn on motor to fill water tank',
      assignedTo: 'Brother 2',
      time: '06:30',
      status: 'Pending',
      priority: 'High',
    },
    {
      key: '3',
      task: 'Fill drinking water drum',
      assignedTo: 'Brother 3',
      time: '07:00',
      status: 'Pending',
      priority: 'Medium',
    },
    {
      key: '4',
      task: 'Collect money for water expenses',
      assignedTo: 'Admin (You)',
      time: '08:00',
      status: 'Pending',
      priority: 'High',
    },
  ];

  const columns = [
    {
      title: 'Task',
      dataIndex: 'task',
      key: 'task',
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render: (time) => (
        <Space>
          <ClockCircleOutlined />
          {time}
        </Space>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => {
        const colors = {
          High: 'red',
          Medium: 'orange',
          Low: 'green',
        };
        return <Tag color={colors[priority]}>{priority}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          Completed: 'green',
          Pending: 'orange',
          'In Progress': 'blue',
        };
        const icon = status === 'Completed' ? <CheckCircleOutlined /> : null;
        return <Tag color={colors[status]} icon={icon}>{status}</Tag>;
      },
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '24px', color: '#1890ff' }}>
        <TeamOutlined style={{ marginRight: 8 }} />
        Family Task Management Dashboard
      </h2>
      
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {statisticsData.map((stat, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                valueStyle={{ color: stat.color }}
              />
              <div style={{ marginTop: '16px', fontSize: '32px', color: stat.color }}>
                {stat.icon}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Today's Tasks Table */}
      <Card title="Today's Tasks" style={{ marginBottom: '24px' }}>
        <Table
          columns={columns}
          dataSource={todayTasksData}
          pagination={false}
          size="small"
        />
      </Card>

      {/* Additional Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Task Completion Progress" size="small">
            <Progress
              percent={25}
              status="active"
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
            <div style={{ marginTop: 16 }}>
              <div>✅ Completed: 1 task</div>
              <div>⏳ Pending: 3 tasks</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Quick Actions" size="small">
            <p>Frequently used actions:</p>
            <ul>
              <li>Add Medical Report</li>
              <li>Schedule Appointment</li>
              <li>Assign Daily Task</li>
              <li>Track Expenses</li>
            </ul>
          </Card>
        </Col>
      </Row>

      {/* Timeline View */}
      <Card title="Today's Timeline" style={{ marginTop: '24px' }}>
        <Timeline>
          {todayTasksData.map(task => (
            <Timeline.Item
              key={task.key}
              color={task.status === 'Completed' ? 'green' : 'orange'}
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

export default Dashboard;