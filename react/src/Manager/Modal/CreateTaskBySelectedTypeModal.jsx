import React from 'react'
import { Button, DatePicker, Input, Modal, Form, Select, Typography, Space } from 'antd';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useLoading } from '../../Utils/LoadingContext';
import styled from 'styled-components';
import { CreateTaskActionAsync } from '../../Redux/ReducerAPI/WorkReducer';

const { TextArea } = Input;
const { Title } = Typography;
const { RangePicker } = DatePicker;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  .ant-modal-header {
    border-bottom: none;
    padding: 24px 24px 0;
  }
  .ant-modal-body {
    padding: 24px;
  }
  .ant-form-item-label > label {
    font-weight: 600;
  }
`;

const StyledForm = styled(Form)`
  .ant-input,
  .ant-input-number,
  .ant-picker,
  .ant-select-selector {
    border-radius: 6px;
  }
`;


const CreateTaskBySelectedTypeModal = ({ visible, onClose, selectedType }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { setLoading } = useLoading();

  const handleSubmit = (values) => {
    setLoading(true);
    const data = {
        ...values,
        startDate: values.dateRange[0].format('YYYY-MM-DDTHH:mm:ss[Z]'),
        endDate: values.dateRange[1].format('YYYY-MM-DDTHH:mm:ss[Z]'),
        type: selectedType, agencyId: id
    };

    delete data.dateRange;

    dispatch(CreateTaskActionAsync(data))
      .then((response) => {
        setLoading(false);
        if (response) {
          form.resetFields();
          onClose();
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error('Error creating assignment:', err);
      });
  };

  const formItems = [
    {
      name: 'title',
      label: 'Tên công việc',
      rules: [{ required: true, message: 'Vui lòng nhập tên công việc!' }],
      component: <Input placeholder="Nhập tên công việc" />,
    },
    {
      name: 'description',
      label: 'Mô tả',
      rules: [{ required: true, message: 'Vui lòng nhập mô tả!' }],
      component: <TextArea placeholder="Nhập mô tả công việc" autoSize={{ minRows: 3, maxRows: 6 }} />,
    },
    {
      name: 'dateRange',
      label: 'Thời gian bắt đầu và kết thúc',
      rules: [{ required: true, message: 'Vui lòng chọn thời gian!' }],
      component: <RangePicker showTime format="DD/MM/YYYY, HH:mm" style={{ width: '100%' }} />,
    },
  ]

  return (
    <StyledModal
      open={visible}
      style={{top:20}}
      title={<Title level={3}>Tạo công việc mới</Title>}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Tạo
        </Button>,
      ]}
    >
      <StyledForm form={form} layout="vertical" onFinish={handleSubmit}>
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          {formItems.map((item) => (
            <Form.Item key={item.name} name={item.name} label={item.label} rules={item.rules}>
              {item.component}
            </Form.Item>
          ))}
        </Space>
      </StyledForm>
    </StyledModal>
  )
}

export default CreateTaskBySelectedTypeModal
