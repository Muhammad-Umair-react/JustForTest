import React, { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, message, Spin, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useInventory } from '../contexts/Inventory/InventoryContext';

const { Option } = Select;
const { Search } = Input;

const Products = () => {
  const { items, isLoading } = useInventory();
  const [filteredItems, setFilteredItems] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  // Use items from context as the base data
  const [products, setProducts] = useState(items);

  // Update products when items change
  React.useEffect(() => {
    setProducts(items);
    setFilteredItems(items);
  }, [items]);

  const bikeCategories = [
    'Tires',
    'Drivetrain',
    'Brakes',
    'Handlebars',
    'Maintenance',
    'Safety',
    'Pedals',
    'Wheels',
    'Frames',
    'Accessories'
  ];

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
      sorter: (a, b) => (a.brand || '').localeCompare(b.brand || ''),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: bikeCategories.map(cat => ({ text: cat, value: cat })),
      onFilter: (value, record) => record.category === value,
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (price) => `$${price}`,
    },
    {
      title: 'Cost Price',
      dataIndex: 'costPrice',
      key: 'costPrice',
      sorter: (a, b) => (a.costPrice || 0) - (b.costPrice || 0),
      render: (costPrice) => `$${costPrice || 0}`,
    },
    {
      title: 'Stock',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
      render: (quantity) => {
        const color = quantity <= 5 ? 'red' : quantity <= 10 ? 'orange' : 'green';
        return <Tag color={color}>{quantity} units</Tag>;
      },
    },
    {
      title: 'Profit Margin',
      key: 'profitMargin',
      render: (_, record) => {
        const margin = record.costPrice ? 
          ((record.price - record.costPrice) / record.price * 100).toFixed(1) : 0;
        const color = margin > 30 ? 'green' : margin > 15 ? 'orange' : 'red';
        return <Tag color={color}>{margin}%</Tag>;
      },
    },
    {
      title: 'Size/Model',
      dataIndex: 'size',
      key: 'size',
      render: (size) => size || 'N/A',
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleSearch = (value) => {
    if (!value) {
      setFilteredItems(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(value.toLowerCase()) ||
        product.brand.toLowerCase().includes(value.toLowerCase()) ||
        product.category.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this product?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        const updatedProducts = products.filter(product => product.id !== id);
        setProducts(updatedProducts);
        setFilteredItems(updatedProducts);
        message.success('Product deleted successfully');
      },
    });
  };

  const handleSubmit = (values) => {
    if (editingProduct) {
      // Update existing product
      const updatedProducts = products.map(product =>
        product.id === editingProduct.id
          ? { ...product, ...values }
          : product
      );
      setProducts(updatedProducts);
      setFilteredItems(updatedProducts);
      message.success('Product updated successfully');
    } else {
      // Add new product
      const newProduct = {
        id: Date.now().toString(),
        ...values,
        userId: 'mock-user-123',
      };
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      setFilteredItems(updatedProducts);
      message.success('Product added successfully');
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, color: '#1890ff' }}>🚴‍♂️ Bike Parts Products</h2>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Product
          </Button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <Search
            placeholder="Search by name, brand, or category"
            allowClear
            onSearch={handleSearch}
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredItems}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          size="small"
          scroll={{ x: 1200 }}
          rowKey="id"
        />
      </Card>

      <Modal
        title={editingProduct ? 'Edit Product' : 'Add New Bike Part'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Product Name"
            name="name"
            rules={[{ required: true, message: 'Please input product name!' }]}
          >
            <Input placeholder="e.g., Mountain Bike Tire" />
          </Form.Item>

          <Form.Item
            label="Brand"
            name="brand"
            rules={[{ required: true, message: 'Please input brand!' }]}
          >
            <Input placeholder="e.g., Shimano, Maxxis, etc." />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: 'Please select category!' }]}
          >
            <Select placeholder="Select category">
              {bikeCategories.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </Form.Item>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              label="Selling Price"
              name="price"
              rules={[{ required: true, message: 'Please input selling price!' }]}
              style={{ flex: 1 }}
            >
              <InputNumber 
                min={0} 
                step={0.01} 
                style={{ width: '100%' }}
                prefix="$"
                placeholder="0.00"
              />
            </Form.Item>

            <Form.Item
              label="Cost Price"
              name="costPrice"
              rules={[{ required: true, message: 'Please input cost price!' }]}
              style={{ flex: 1 }}
            >
              <InputNumber 
                min={0} 
                step={0.01} 
                style={{ width: '100%' }}
                prefix="$"
                placeholder="0.00"
              />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              label="Stock Quantity"
              name="quantity"
              rules={[{ required: true, message: 'Please input stock quantity!' }]}
              style={{ flex: 1 }}
            >
              <InputNumber 
                min={0} 
                style={{ width: '100%' }}
                placeholder="0"
              />
            </Form.Item>

            <Form.Item
              label="Size/Model"
              name="size"
              style={{ flex: 1 }}
            >
              <Input placeholder="e.g., 29x2.25, 11-speed, etc." />
            </Form.Item>
          </div>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingProduct ? 'Update' : 'Add'} Product
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;