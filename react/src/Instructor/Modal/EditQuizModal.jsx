import React, { useEffect, useState } from 'react'
import { Button, DatePicker, Input, InputNumber, Modal, Form, Typography, Space, Select, Card, Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { EditQuestionOfQuizByIdActionAsync, EditQuizByIdActionAsync } from '../../Redux/ReducerAPI/QuizReducer';
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

const StyledCard = styled(Card)`
  &.question-form {
    background-color: #f0f7ff;
    border: 1px solid #91caff;
    margin-bottom: 16px;
    
    .ant-card-head-title {
      color: #1677ff;
    }
  }
  
  &.details-form {
    background-color: #f6ffed;
    border: 1px solid #b7eb8f;
    
    .ant-card-head-title {
      color: #52c41a;
    }
  }

  .ant-card-head {
    border-bottom: none;
    min-height: auto;
    padding: 8px 16px;
  }

  .ant-card-body {
    padding: 16px;
  }
`;

const EditQuizModal = ({ visible, onClose, quiz}) => {
  const [formQuestions] = Form.useForm();
  const [formDetails] = Form.useForm();
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const dispatch = useDispatch();
  const { id: classId } = useParams();
  const { setLoading } = useLoading();
  const { chapterFilter } = useSelector((state) => state.ClassReducer);

  useEffect(() => {
    if (quiz) {
      formDetails.setFieldsValue({
        title: quiz.title,
        description: quiz.description,
        duration: quiz.duration,
        startTime: dayjs(quiz.startTime),
      });
      
      // formQuestions.setFieldsValue({
      //   quantity: quiz.quantity,
      //   chapterIds: quiz.chapterIds,
      // });
    }
  }, [quiz, formQuestions, formDetails]);

  const handleUpdateQuestions = async (values) => {
    try {
      setLoading(true);
      const response = await dispatch(EditQuestionOfQuizByIdActionAsync(quiz.id, values, classId));
      setLoading(false);
      if (response) {
        setShowQuestionForm(false);
        formQuestions.resetFields()
      }
    } catch (err) {
      setLoading(false);
      console.error('Error updating questions:', err);
    }
  };

  const handleUpdateDetails = async (values) => {
    try {
      setLoading(true);
      const data = {
        ...quiz,
        ...values,
        startTime: values.startTime.format('YYYY-MM-DDTHH:mm:ss[Z]')
      };

      const response = await dispatch(EditQuizByIdActionAsync(quiz.id, data, classId));
      setLoading(false);
      if (response) {
        onClose();
      }
    } catch (err) {
      setLoading(false);
      console.error('Error updating quiz details:', err);
    }
  };

  return (
    <StyledModal
      title={<Title level={3}>Chỉnh sửa bài kiểm tra</Title>}
      open={visible}
      onCancel={onClose}
      footer={null}
      style={{top:20}}
      width={800} // Tăng width để form có nhiều không gian hơn
    >
      <div className="space-y-4">
        {/* Nút hiển thị form cập nhật câu hỏi */}
        {!showQuestionForm && (
          <Button 
            type="primary" 
            onClick={() => setShowQuestionForm(true)}
            style={{ marginBottom: 16 }}
          >
            Cập nhật câu hỏi
          </Button>
        )}

        {/* Form cập nhật số lượng câu hỏi và chương */}
        {showQuestionForm && (
          <StyledCard 
            className="question-form"
            title={<Title level={5} style={{ margin: 0 }}>Cập nhật câu hỏi</Title>}
          >
            <StyledForm 
              form={formQuestions}
              layout="vertical"
              onFinish={handleUpdateQuestions}
              requiredMark={false}
              initialValues={{
                quantity: 15, 
              }}
            >
              <Row gutter={[16, 0]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="quantity"
                    label="Số lượng câu hỏi"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng câu hỏi!' }]}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="chapterIds"
                    label="Chọn chương"
                    rules={[{ required: true, message: 'Vui lòng chọn ít nhất một chương!' }]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="Chọn chương"
                      style={{ width: '100%' }}
                      options={chapterFilter.map(chapter => ({
                        value: chapter.id,
                        label: `Chương ${chapter.number}`
                      }))}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item>
                <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                  <Button onClick={() => setShowQuestionForm(false)}>
                    Hủy
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Cập nhật
                  </Button>
                </Space>
              </Form.Item>
            </StyledForm>
          </StyledCard>
        )}

        {/* Form cập nhật thông tin chung */}
        <StyledCard 
          className="details-form"
          title={<Title level={5} style={{ margin: 0 }}>Cập nhật thông tin chung</Title>}
        >
          <StyledForm 
            form={formDetails}
            layout="vertical"
            onFinish={handleUpdateDetails}
            requiredMark={false}
          >
            <Row gutter={[16, 0]}>
              <Col xs={24}>
                <Form.Item
                  name="title"
                  label="Tiêu đề"
                  rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài kiểm tra!' }]}
                >
                  <Input placeholder="Nhập tiêu đề bài kiểm tra" />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="description"
                  label="Mô tả"
                  rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                >
                  <TextArea 
                    placeholder="Nhập mô tả bài kiểm tra" 
                    autoSize={{ minRows: 3, maxRows: 6 }} 
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="duration"
                  label="Thời gian làm bài (phút)"
                  rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
                >
                  <InputNumber 
                    min={1} 
                    placeholder="Nhập thời gian (phút)" 
                    style={{ width: '100%' }} 
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="startTime"
                  label="Thời gian bắt đầu"
                  rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu!' }]}
                >
                  <DatePicker 
                    showTime 
                    format="DD/MM/YYYY, HH:mm" 
                    style={{ width: '100%' }} 
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={onClose}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit">
                  Cập nhật thông tin
                </Button>
              </Space>
            </Form.Item>
          </StyledForm>
        </StyledCard>
      </div>
    </StyledModal>
  );
};

export default EditQuizModal;

