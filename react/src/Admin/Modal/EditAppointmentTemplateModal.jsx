import { Col, Form, Input, InputNumber, Modal, Row, Select, Typography } from 'antd';
import React, { useEffect } from 'react'
import { useLoading } from '../../Utils/LoadingContext';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import { quillFormats, quillModules } from '../../TextEditorConfig/Config';
import { EditTaskTemplateByIdActionAsync } from '../../Redux/ReducerAPI/WorkTemplateReducer';
import { EditAppointmentTemplateByIdActionAsync } from '../../Redux/ReducerAPI/AppointmentTemplateReducer';

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

const EditAppointmentTemplateModal = ({ visible, onClose, appointment, workId }) => {
    const [form] = Form.useForm();
    const { setLoading } = useLoading()
    const dispatch = useDispatch()
  
    useEffect(() => {
      if (appointment && visible) {
        form.setFieldsValue({
          title: appointment.title,
          description: appointment.description,
          type: appointment.type,
          startDaysOffset: appointment.startDaysOffset,
          durationHours: appointment.durationHours
        });
      }
    }, [appointment, form, visible]);
  
    const onFinish = (values) => {
      setLoading(true)
  
      dispatch(EditAppointmentTemplateByIdActionAsync(appointment.id, values, workId)).then((res) => {
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
        title={<Title level={3}>Cập nhật cuộc họp mẫu</Title>}
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
                label="Tiêu đề cuộc họp"
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề cuộc họp!' }]}
              >
                <Input maxLength={50} placeholder="Nhập tiêu đề cuộc họp" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="type"
                label="Loại cuộc họp"
                rules={[{ required: true, message: 'Vui lòng chọn loại cuộc họp!' }]}
              >
                <Select placeholder="Chọn loại cuộc họp">
                  <Select.Option value="Internal">Nội bộ</Select.Option>
                  <Select.Option value="WithAgency">Với chi nhánh</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả cuộc họp!' }]}
          >
            <StyledQuill
              modules={quillModules}
              formats={quillFormats}
              placeholder="Nhập mô tả cuộc họp"
              style={{ minHeight: '150px' }}
            />
          </Form.Item>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="startDaysOffset"
                label="Số ngày giãn cách công việc"
                rules={[{ required: true, message: 'Vui lòng nhập số ngày giãn cách!' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập số ngày giãn cách"/>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="durationHours"
                label="Thời lượng cuộc họp (giờ)"
                rules={[{ required: true, message: 'Vui lòng nhập thời lượng cuộc họp!' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập thời lượng cuộc họp (giờ)"/>
              </Form.Item>
            </Col>
          </Row>
        </StyledForm>
      </StyledModal>
    )
  }
  
  export default EditAppointmentTemplateModal
  