import { Button, Form, Modal, Typography } from 'antd';
import { quillFormats, quillModules } from '../../TextEditorConfig/Config';
import React from 'react'
import ReactQuill from 'react-quill';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useLoading } from '../../Utils/LoadingContext';
import { CreateReportEquipActionAsync } from '../../Redux/ReducerAPI/ReportReducer';

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

const AddReportEquipmentModal = ({ visible, onClose, selectedEquipmentIds, setSelectedEquipmentIds }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { setLoading } = useLoading();
  
  const handleSubmit = async (values) => {
    setLoading(true)
    const report = {...values, equipmentIds: selectedEquipmentIds}
    await dispatch(CreateReportEquipActionAsync(report))
    form.resetFields()
    onClose()
    setSelectedEquipmentIds([])
    setLoading(false)
  }
      

  return (
    <StyledModal
      open={visible}
      style={{top:20}}
      title={<Title level={3}>Tạo báo cáo</Title>}
      width={700}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Thêm
        </Button>,
      ]}
    >
      <StyledForm form={form} layout="vertical" onFinish={handleSubmit}>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
        >
          <StyledQuill
            modules={quillModules}
            formats={quillFormats}
            placeholder="Nhập mô tả báo cáo"
            style={{ minHeight: '200px' }}
          />
        </Form.Item>
      </StyledForm>
    </StyledModal>
  )
}

export default AddReportEquipmentModal