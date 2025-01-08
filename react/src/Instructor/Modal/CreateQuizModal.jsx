import React from 'react';
import { Button, DatePicker, Input, InputNumber, Modal, Form, Select, Typography, Space, Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { CreateQuizActionAsync } from '../../Redux/ReducerAPI/QuizReducer';
import { useLoading } from '../../Utils/LoadingContext';
import styled from 'styled-components';

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

const CreateQuizModal = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { id: classId } = useParams();
  const { setLoading } = useLoading();
  const { chapterFilter } = useSelector((state) => state.ClassReducer);

  const handleSubmit = (values) => {
    setLoading(true);
    const data = {
      ...values,
      startTime: values.startTime.format('YYYY-MM-DDTHH:mm:ss[Z]'),
      classId,
    };

    dispatch(CreateQuizActionAsync(data))
      .then((response) => {
        setLoading(false);
        if (response) {
          form.resetFields();
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
      colSpan: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 },
    },
    {
      name: 'description',
      label: 'Mô tả',
      rules: [{ required: true, message: 'Vui lòng nhập mô tả!' }],
      component: <TextArea placeholder="Nhập mô tả bài kiểm tra" autoSize={{ minRows: 3, maxRows: 6 }} />,
      colSpan: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 },
    },
    {
      name: 'duration',
      label: 'Thời gian làm bài (phút)',
      rules: [{ required: true, message: 'Vui lòng nhập thời gian!' }],
      component: <InputNumber min={1} placeholder="Nhập thời gian (phút)" style={{ width: '100%' }} />,
      colSpan: { xs: 24, sm: 24, md: 12, lg: 12, xl: 12 },
    },
    {
      name: 'quantity',
      label: 'Số lượng câu hỏi',
      rules: [{ required: true, message: 'Vui lòng nhập số lượng câu hỏi!' }],
      component: <InputNumber min={1} placeholder="Nhập số lượng câu hỏi" style={{ width: '100%' }} />,
      colSpan: { xs: 24, sm: 24, md: 12, lg: 12, xl: 12 },
    },
    {
      name: 'startTime',
      label: 'Thời gian bắt đầu',
      rules: [{ required: true, message: 'Vui lòng chọn thời gian bắt đầu!' }],
      component: <DatePicker showTime format="DD/MM/YYYY, HH:mm" style={{ width: '100%' }} />,
      colSpan: { xs: 24, sm: 24, md: 12, lg: 12, xl: 12 },
    },
    {
      name: 'chapterId',
      label: 'Chọn buổi học',
      rules: [{ required: true, message: 'Vui lòng chọn ít nhất một buổi học!' }],
      component: (
        <Select
          mode="multiple"
          placeholder="Chọn buổi học"
          options={chapterFilter.map((ch) => ({
            label: `Buổi ${ch.number}`,
            value: ch.id,
          }))}
          style={{ width: '100%' }}
        />
      ),
      colSpan: { xs: 24, sm: 24, md: 12, lg: 12, xl: 12 },
    },
  ];

  return (
    <StyledModal
      title={<Title level={3}>Tạo Bài Kiểm Tra</Title>}
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
        <Row gutter={[16, 16]}>
          {formItems.map((item) => (
            <Col {...item.colSpan} key={item.name}>
              <Form.Item name={item.name} label={item.label} rules={item.rules}>
                {item.component}
              </Form.Item>
            </Col>
          ))}
        </Row>
      </StyledForm>
    </StyledModal>
  );
};

export default CreateQuizModal;

