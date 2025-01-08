import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, Slider, message } from 'antd';
import { useDispatch } from 'react-redux';
import { CreatePackageActionAsync } from '../../Redux/ReducerAPI/PackageReducer';

const { TextArea } = Input;

const CreatePackageModal = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

  const handleSubmit = async (value) => {
    setLoading(true)
    await dispatch(CreatePackageActionAsync(value))
    setLoading(false)
    onClose()
    form.resetFields()
  };

  return (
    <Modal
      title="Tạo Gói Dịch Vụ Mới"
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: 'Tiêu chuẩn',
          price: 0,
          numberOfUsers: 1,
        }}
      >
        <Form.Item
          name="name"
          label="Tên Gói Dịch Vụ"
          rules={[{ required: true, message: 'Vui lòng nhập tên gói dịch vụ' }]}
        >
          <Input placeholder="Nhập tên gói dịch vụ" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô Tả"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
        >
          <TextArea rows={4} placeholder="Nhập mô tả gói dịch vụ" />
        </Form.Item>

        <Form.Item
          name="price"
          label="Giá"
          rules={[{ required: true, message: 'Vui lòng đặt giá' }]}
        >
          <Slider
            min={0}
            max={100000000} 
            step={1000000} 
            marks={{
              0: '0',
              20000000: '20 triệu',
              50000000: '50 triệu',
              100000000: '100 triệu',
            }}
            tooltip={{ formatter: (value) => `${value.toLocaleString()} VND` }} // Hiển thị giá trị theo định dạng tiền tệ
          />
        </Form.Item>

        <Form.Item
          name="numberOfUsers"
          label="Số Lượng Người Dùng"
          rules={[{ required: true, message: 'Vui lòng nhập số lượng người dùng' }]}
        >
          <InputNumber
            min={1}
            max={1000}
            style={{ width: '100%' }}
            placeholder="Nhập số lượng người dùng"
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng Thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        >
          <Select>
            <Select.Option value="Standard">Tiêu chuẩn</Select.Option>
            <Select.Option value="Custom">Nâng cấp</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreatePackageModal;
