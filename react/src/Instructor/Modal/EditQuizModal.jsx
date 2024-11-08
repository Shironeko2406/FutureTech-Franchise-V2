import React, { useEffect } from 'react'
import { Button, DatePicker, Input, InputNumber, Modal, Form, Typography, Space } from 'antd';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { EditQuizByIdActionAsync } from '../../Redux/ReducerAPI/QuizReducer';
import { useLoading } from '../../Utils/LoadingContext';
import styled from 'styled-components';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Title } = Typography;

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

const EditQuizModal = ({ visible, onClose, quiz }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { id: classId } = useParams();
  const { setLoading } = useLoading();

  useEffect(() => {
    if (quiz) {
      form.setFieldsValue({
        ...quiz,
        startTime: dayjs(quiz.startTime),
      });
    }
  }, [quiz, form]);

  const handleSubmit = (values) => {
    setLoading(true);
    const data = {
      ...values,
      startTime: values.startTime.format('YYYY-MM-DDTHH:mm:ss[Z]')
    };

    dispatch(EditQuizByIdActionAsync(quiz.id, data, classId))
      .then((response) => {
        setLoading(false);
        if (response) {
          onClose();
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error('Error creating quiz:', err);
      });
  };

  const formItems = [
    {
      name: 'title',
      label: 'Tiêu đề',
      rules: [{ required: true, message: 'Vui lòng nhập tiêu đề bài kiểm tra!' }],
      component: <Input placeholder="Nhập tiêu đề bài kiểm tra" />,
    },
    {
      name: 'description',
      label: 'Mô tả',
      rules: [{ required: true, message: 'Vui lòng nhập mô tả!' }],
      component: <TextArea placeholder="Nhập mô tả bài kiểm tra" autoSize={{ minRows: 3, maxRows: 6 }} />,
    },
    {
      name: 'duration',
      label: 'Thời gian làm bài (phút)',
      rules: [{ required: true, message: 'Vui lòng nhập thời gian!' }],
      component: <InputNumber min={1} placeholder="Nhập thời gian (phút)" style={{ width: '100%' }} />,
    },
    {
      name: 'startTime',
      label: 'Thời gian bắt đầu',
      rules: [{ required: true, message: 'Vui lòng chọn thời gian bắt đầu!' }],
      component: <DatePicker showTime format="DD/MM/YYYY, HH:mm" style={{ width: '100%' }} />,
    },
  ];

  return (
    <StyledModal
      title={<Title level={3}>Chỉnh sửa</Title>}
      open={visible}
      onCancel={onClose}
      footer={
        <Space>
          <Button onClick={onClose}>Hủy</Button>
          <Button onClick={() => form.submit()} type="primary">
            Cập nhật
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

export default EditQuizModal