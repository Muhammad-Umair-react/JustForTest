import { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const Products = () => {
  const [products, setProducts] = useState([
    {
      key: '1',
      id: 'P001',
      name: 'Laptop',
      category: 'Electronics',
      price: 1200,
      stock: 25,
      status: 'In Stock',
      supplier: 'Tech Corp',
    },
    {
      key: '2',
      id: 'P002',
      name: 'Mouse',
      category: 'Electronics',
      price: 25,
      stock: 150,
      status: 'In Stock',
      supplier: 'Accessories Inc',
    },
    {
      key: '3',
      id: 'P003',
      name: 'Keyboard',
      category: 'Electronics',
      price: 75,
      stock: 5,
      status: 'Low Stock',
      supplier: 'Tech Corp',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'Product ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          'In Stock': 'green',
          'Low Stock': 'orange',
          'Out of Stock': 'red',
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      },
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier',
      key: 'supplier',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
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
            onClick={() => handleDelete(record.key)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

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

  const handleDelete = (key) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this product?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        setProducts(products.filter(product => product.key !== key));
        message.success('Product deleted successfully');
      },
    });
  };

  const handleSubmit = (values) => {
    if (editingProduct) {
      // Update existing product
      setProducts(products.map(product =>
        product.key === editingProduct.key
          ? { ...product, ...values }
          : product
      ));
      message.success('Product updated successfully');
    } else {
      // Add new product
      const newProduct = {
        key: Date.now().toString(),
        id: `P${String(products.length + 1).padStart(3, '0')}`,
        ...values,
        status: values.stock > 10 ? 'In Stock' : values.stock > 0 ? 'Low Stock' : 'Out of Stock',
      };
      setProducts([...products, newProduct]);
      message.success('Product added successfully');
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, color: '#1890ff' }}>Products</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Product
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        pagination={{ pageSize: 10 }}
        size="small"
      />

      <Modal
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
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
            <Input />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: 'Please select category!' }]}
          >
            <Select>
              <Option value="Electronics">Electronics</Option>
              <Option value="Clothing">Clothing</Option>
              <Option value="Books">Books</Option>
              <Option value="Home">Home</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: 'Please input price!' }]}
          >
            <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Stock"
            name="stock"
            rules={[{ required: true, message: 'Please input stock quantity!' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Supplier"
            name="supplier"
            rules={[{ required: true, message: 'Please input supplier!' }]}
          >
            <Input />
          </Form.Item>

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