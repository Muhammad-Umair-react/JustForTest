import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, DatePicker, TimePicker, Tag, Space, Row, Col, Statistic, Calendar } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

const Appointments = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      familyMember: 'Father',
      doctor: 'Dr. Ahmed Khan',
      hospital: 'City General Hospital',
      date: '2024-02-15',
      time: '10:00',
      type: 'Follow-up',
      reason: 'Diabetes checkup',
      status: 'Scheduled',
      notes: 'Bring blood test reports',
    },
    {
      id: 2,
      familyMember: 'Mother',
      doctor: 'Dr. Sarah Johnson',
      hospital: 'Heart Care Center',
      date: '2024-02-20',
      time: '14:30',
      type: 'Consultation',
      reason: 'Blood pressure check',
      status: 'Scheduled',
      notes: 'Take morning medication before visit',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [form] = Form.useForm();

  const familyMembers = [
    'Admin (You)', 'Brother 1', 'Brother 2', 'Brother 3', 'Brother 4',
    'Sister-in-law 1', 'Sister-in-law 2', 'Nephew', 'Niece', 'Father', 'Mother'
  ];

  const appointmentTypes = [
    'Consultation', 'Follow-up', 'Emergency', 'Surgery', 'Test', 'Vaccination', 'Other'
  ];

  const columns = [
    {
      title: 'Family Member',
      dataIndex: 'familyMember',
      key: 'familyMember',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Doctor',
      dataIndex: 'doctor',
      key: 'doctor',
    },
    {
      title: 'Hospital',
      dataIndex: 'hospital',
      key: 'hospital',
    },
    {
      title: 'Date & Time',
      key: 'datetime',
      render: (_, record) => (
        <div>
          <div>{dayjs(record.date).format('DD/MM/YYYY')}</div>
          <div style={{ color: '#666' }}>{record.time}</div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === 'Scheduled' ? 'green' : 
                     status === 'Completed' ? 'blue' : 'orange';
        return <Tag color={color}>{status}</Tag>;
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
    const total = appointments.length;
    const scheduled = appointments.filter(a => a.status === 'Scheduled').length;
    const completed = appointments.filter(a => a.status === 'Completed').length;
    const upcoming = appointments.filter(a => 
      dayjs(a.date).isAfter(dayjs()) && a.status === 'Scheduled'
    ).length;

    return { total, scheduled, completed, upcoming };
  };

  const stats = getStatistics();

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 16 }}>
          <CalendarOutlined style={{ marginRight: 8 }} />
          Medical Appointments
        </h1>
        
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic title="Total Appointments" value={stats.total} prefix={<CalendarOutlined />} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Scheduled" value={stats.scheduled} valueStyle={{ color: '#52c41a' }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Completed" value={stats.completed} valueStyle={{ color: '#1890ff' }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Upcoming" value={stats.upcoming} valueStyle={{ color: '#fa8c16' }} />
            </Card>
          </Col>
        </Row>

        <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }}>
          Schedule New Appointment
        </Button>
      </div>

      <Row gutter={16}>
        <Col span={16}>
          <Card title="Appointments List">
            <Table
              columns={columns}
              dataSource={appointments}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Calendar View">
            <Calendar
              fullscreen={false}
              dateCellRender={(date) => {
                const dayAppointments = appointments.filter(
                  apt => dayjs(apt.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
                );
                return dayAppointments.length > 0 ? (
                  <div style={{ fontSize: '10px', color: '#1890ff' }}>
                    {dayAppointments.length} appointment(s)
                  </div>
                ) : null;
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Appointments;