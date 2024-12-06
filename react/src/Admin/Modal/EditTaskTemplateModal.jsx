import { Col, Form, Input, InputNumber, Modal, Row, Select, Typography } from 'antd';
import React, { useEffect } from 'react'
import { useLoading } from '../../Utils/LoadingContext';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import { quillFormats, quillModules } from '../../TextEditorConfig/Config';
import { EditTaskTemplateByIdActionAsync } from '../../Redux/ReducerAPI/WorkTemplateReducer';

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

const StyledQuill = styled(ReactQuill)`
  .ql-container {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
  .ql-toolbar {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }
  
  .ql-tooltip {
    z-index: 1000000 !important; // Ensure it's above the modal
    position: fixed !important;
  }
  
  .ql-editing {
    left: 50% !important;
    transform: translateX(-50%);
    background-color: white !important;
    border: 1px solid #ccc !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
    padding: 8px 12px !important;
  }
`;

const EditTaskTemplateModal = ({ visible, onClose, task , selectedType}) => {
  const [form] = Form.useForm();
  const {setLoading} = useLoading()
  const dispatch = useDispatch()

  useEffect(() => {
    if (task && visible) {
      form.setFieldsValue({
        title: task.title,
        description: task.description,
        level: task.level,
        startDaysOffset: task.startDaysOffset,
        durationDays: task.durationDays
      });
    }
  }, [task, form, visible]);

  const onFinish = (values) => {
    setLoading(true)

    const taskUpdate = {...values, type: selectedType};

    dispatch(EditTaskTemplateByIdActionAsync(taskUpdate, task.id)).then((res) => {
        setLoading(false)
        if (res) {
            onClose()
        }
    }).catch((err) => {
        console.log(err)
        setLoading(false)
    });
  };

  return (
    <StyledModal
      title={<Title level={3}>Cập nhật công việc mẫu</Title>}
      style={{ top: 20 }}
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      width={600}
    >
      <StyledForm form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="title"
              label="Tên công việc"
              rules={[{ required: true, message: 'Vui lòng nhập tên công việc!' }]}
            >
              <Input maxLength={50} placeholder="Nhập tên công việc" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="level"
              label="Mức độ ưu tiên"
              rules={[{ required: true, message: 'Vui lòng chọn mức độ!' }]}
            >
              <Select placeholder="Chọn mức độ">
                <Select.Option value="Optional">Không bắt buộc</Select.Option>
                <Select.Option value="Compulsory">Bắt buộc</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
        >
          <StyledQuill
            modules={quillModules}
            formats={quillFormats}
            placeholder="Nhập mô tả công việc"
            style={{ minHeight: '150px' }}
          />
        </Form.Item>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="startDaysOffset"
              label="Số ngày giản cách công việc"
              rules={[{ required: true, message: 'Vui lòng nhập số ngày!' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập số ngày"/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="durationDays"
              label="Số ngày hoàn thành"
              rules={[{ required: true, message: 'Vui lòng nhập số ngày hoàn thành!' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập số ngày hoàn thành"/>
            </Form.Item>
          </Col>
        </Row>
      </StyledForm>
    </StyledModal>
  )
}

export default EditTaskTemplateModal
