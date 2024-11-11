import React from 'react'
import { Button, DatePicker, Input, Modal, Form, Select, Typography, Space } from 'antd';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useLoading } from '../../Utils/LoadingContext';
import styled from 'styled-components';
import { CreateAssignmentActionAsync } from '../../Redux/ReducerAPI/AssignmentReducer';

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

const CreateAssignmentModal = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { id: classId } = useParams();
  const { setLoading } = useLoading();

  const handleSubmit = (values) => {
    setLoading(true);
    const data = {
        ...values,
        startTime: values.dateRange[0].format('YYYY-MM-DDTHH:mm:ss[Z]'),
        endTime: values.dateRange[1].format('YYYY-MM-DDTHH:mm:ss[Z]'),
        classId,
    };

    delete data.dateRange;

    dispatch(CreateAssignmentActionAsync(data))
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
      label: 'Tiêu đề',
      rules: [{ required: true, message: 'Vui lòng nhập tiêu đề bài kiểm tra!' }],
      component: <Input placeholder="Nhập tiêu đề bài tập" />,
    },
    {
      name: 'description',
      label: 'Mô tả',
      rules: [{ required: true, message: 'Vui lòng nhập mô tả!' }],
      component: <TextArea placeholder="Nhập mô tả bài tập" autoSize={{ minRows: 3, maxRows: 6 }} />,
    },
    {
      name: 'dateRange',
      label: 'Thời gian bắt đầu và kết thúc',
      rules: [{ required: true, message: 'Vui lòng chọn thời gian!' }],
      component: <RangePicker showTime format="DD/MM/YYYY, HH:mm" style={{ width: '100%' }} />,
    },
    {
      name: 'status',
      label: 'Trạng thái',
      rules: [{ required: true, message: 'Vui lòng chọn trạng thái!' }],
      component: (
        <Select
          placeholder="Chọn trạng thái"
          options={[
            { label: 'Open', value: 'Open' },
            { label: 'Closed', value: 'Closed' },
          ]}
          style={{ width: '100%' }}
        />
      ),
    },
  ];

  return (
    <StyledModal
      title={<Title level={3}>Tạo Bài Tập</Title>}
      style={{top:20}}
      open={visible}
      onCancel={onClose}
      footer={
        <Space>
          <Button onClick={onClose}>Hủy</Button>
          <Button onClick={() => form.submit()} type="primary">
            Tạo
          </Button>
        </Space>
      }
      width={600}
    >
      <StyledForm form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
        {formItems.map((item) => (
          <Form.Item key={item.name} name={item.name} label={item.label} rules={item.rules}>
            {item.component}
          </Form.Item>
        ))}
      </StyledForm>
    </StyledModal>
  )
}

export default CreateAssignmentModal
