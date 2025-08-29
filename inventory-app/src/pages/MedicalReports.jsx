import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, DatePicker, Tag, Space, Row, Col, Statistic, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

const MedicalReports = () => {
  const [reports, setReports] = useState([
    {
      id: 1,
      familyMember: 'Father',
      reportType: 'Blood Test',
      date: '2024-01-15',
      doctor: 'Dr. Ahmed Khan',
      diagnosis: 'Diabetes Type 2',
      currentStatus: 'Under Treatment',
      severity: 'Moderate',
    },
    {
      id: 2,
      familyMember: 'Mother',
      reportType: 'ECG',
      date: '2024-01-10',
      doctor: 'Dr. Sarah Johnson',
      diagnosis: 'Hypertension',
      currentStatus: 'Stable',
      severity: 'Mild',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [form] = Form.useForm();

  const familyMembers = [
    'Admin (You)', 'Brother 1', 'Brother 2', 'Brother 3', 'Brother 4',
    'Sister-in-law 1', 'Sister-in-law 2', 'Nephew', 'Niece', 'Father', 'Mother'
  ];

  const columns = [
    {
      title: 'Family Member',
      dataIndex: 'familyMember',
      key: 'familyMember',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Report Type',
      dataIndex: 'reportType',
      key: 'reportType',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Doctor',
      dataIndex: 'doctor',
      key: 'doctor',
    },
    {
      title: 'Diagnosis',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
      render: (text) => <Tag color="red">{text}</Tag>,
    },
    {
      title: 'Current Status',
      dataIndex: 'currentStatus',
      key: 'currentStatus',
      render: (status) => {
        const color = status === 'Stable' ? 'green' : 'orange';
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

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 16 }}>
          <FileTextOutlined style={{ marginRight: 8 }} />
          Medical Reports & Health Records
        </h1>
        
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic title="Total Reports" value={reports.length} prefix={<FileTextOutlined />} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Critical Cases" value={2} valueStyle={{ color: '#cf1322' }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Under Treatment" value={1} valueStyle={{ color: '#fa8c16' }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Stable Cases" value={1} valueStyle={{ color: '#3f8600' }} />
            </Card>
          </Col>
        </Row>

        <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }}>
          Add New Medical Report
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={reports}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default MedicalReports;