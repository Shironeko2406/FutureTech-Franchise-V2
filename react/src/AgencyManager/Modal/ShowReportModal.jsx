import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Modal, Button, Typography, Spin, Descriptions, Form, Input, DatePicker, Upload } from 'antd';
import styled from 'styled-components';
import { EyeOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { GetTaskDetailByIdActionAsync } from '../../Redux/ReducerAPI/WorkReducer';
import { GetDocumentByAgencyIdActionAsync, UpdateDocumentActionAsync } from '../../Redux/ReducerAPI/DocumentReducer';
import { GetContractDetailByAgencyIdActionAsync } from '../../Redux/ReducerAPI/ContractReducer';
import dayjs from 'dayjs';
import moment from 'moment';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { imageDB } from "../../Firebasse/Config";


const { Title, Text } = Typography;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
  .ant-modal-header {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 24px;
  }
  .ant-modal-body {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
    padding: 24px;
  }
`;

const StyledDescriptions = styled(Descriptions)`
  margin-top: 24px;
  .ant-descriptions-item-label {
    font-weight: bold;
    color: #1890ff;
  }
  .ant-descriptions-item-content {
    color: #333;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const ShowReportModal = ({ visible, onClose, taskId, taskType, agencyId, taskSubmit }) => {
  const dispatch = useDispatch();
  const [additionalInfo, setAdditionalInfo] = useState(null);
  const [additionalLoading, setAdditionalLoading] = useState(false);
  const [isEditingDocument, setIsEditingDocument] = useState(false);
  const [form] = Form.useForm();
  const uploadedDocumentFileURLRef = useRef(null);

  useEffect(() => {
    if (visible && taskId && agencyId) {
      let documentType = '';
      if (taskType === 'AgreementSigned') {
        documentType = 'AgreementContract';
      } else if (taskType === 'BusinessRegistered') {
        documentType = 'BusinessLicense';
      } else if (taskType === 'EducationLicenseRegistered') {
        documentType = 'EducationalOperationLicense';
      }

      if (documentType) {
        setAdditionalLoading(true);
        dispatch(GetDocumentByAgencyIdActionAsync(agencyId, documentType)).then((res) => {
          setAdditionalInfo(res);
          setAdditionalLoading(false);
        });
      } else if (taskType === 'SignedContract') {
        setAdditionalLoading(true);
        dispatch(GetContractDetailByAgencyIdActionAsync(agencyId)).then((res) => {
          setAdditionalInfo(res);
          setAdditionalLoading(false);
        });
      }
    }
  }, [visible, taskId, taskType, dispatch, agencyId]);

  const handleSaveDocument = async () => {
    setAdditionalLoading(true);
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        urlFile: uploadedDocumentFileURLRef.current || (values.urlFile && values.urlFile[0] ? values.urlFile[0].url : additionalInfo.urlFile),
      };
      const documentData = {
        title: values.title,
        expirationDate: values.expirationDate ? values.expirationDate.format('YYYY-MM-DD') : null,
        urlFile: formattedValues.urlFile,
        type: taskType === 'BusinessRegistered' ? 'BusinessLicense' : 'EducationalOperationLicense',
      };
      await dispatch(UpdateDocumentActionAsync(additionalInfo.id, documentData));
      setAdditionalInfo({ ...additionalInfo, ...documentData });
      setIsEditingDocument(false);
    } catch (error) {
      console.error("Error saving document: ", error);
    } finally {
      setAdditionalLoading(false);
    }
  };

  const handleUploadDocumentFile = async ({ file, onSuccess, onError }) => {
    const storageRef = ref(imageDB, `files/${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      uploadedDocumentFileURLRef.current = url;
      onSuccess({ url }, file);
    } catch (error) {
      console.error("Upload error: ", error);
      onError(error);
    }
  };

  const handleEditDocument = () => {
    setIsEditingDocument(true);
    form.setFieldsValue({
      title: additionalInfo.title,
      expirationDate: additionalInfo.expirationDate ? dayjs(additionalInfo.expirationDate) : null,
      urlFile: additionalInfo.urlFile ? [{
        uid: '-1',
        name: 'Tệp tài liệu hiện tại',
        status: 'done',
        url: additionalInfo.urlFile,
      }] : [],
    });
  };

  const handleDownloadFile = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderAdditionalInfo = useMemo(() => {
    if (!additionalInfo) return null;

    if (isEditingDocument) {
      return (
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Nhập tiêu đề" />
          </Form.Item>
          <Form.Item
            name="expirationDate"
            label="Ngày hết hạn"
          // rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" disabledDate={(current) => current && current < moment().startOf('day')} />
          </Form.Item>
          <Form.Item
            name="urlFile"
            label="Tài liệu"
            rules={[{ required: true, message: 'Vui lòng upload tài liệu' }]}
          >
            <Upload
              name="documentFile"
              customRequest={handleUploadDocumentFile}
              accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              maxCount={1}
              defaultFileList={additionalInfo.urlFile ? [{
                uid: '-1',
                name: 'Tệp tài liệu hiện tại',
                status: 'done',
                url: additionalInfo.urlFile,
              }] : []}
            >
              <Button icon={<UploadOutlined />}>{additionalInfo.urlFile ? "Thêm file khác" : "Thêm file"}</Button>
            </Upload>
          </Form.Item>
        </Form>
      );
    }

    if (taskType === 'AgreementSigned' || taskType === 'BusinessRegistered' || taskType === 'EducationLicenseRegistered') {
      return (
        <StyledDescriptions bordered column={1}>
          <Descriptions.Item label="Tiêu đề">{additionalInfo.title}</Descriptions.Item>
          <Descriptions.Item label="Ngày hết hạn">{additionalInfo.expirationDate ? dayjs(additionalInfo.expirationDate).format('DD/MM/YYYY') : null}</Descriptions.Item>
          <Descriptions.Item label="Tài liệu">
            <Button type="link" icon={<DownloadOutlined />} onClick={() => handleDownloadFile(additionalInfo.urlFile)}>
              Tải xuống file tài liệu
            </Button>
          </Descriptions.Item>
        </StyledDescriptions>
      );
    } else if (taskType === 'SignedContract') {
      return (
        <StyledDescriptions bordered column={1}>
          <Descriptions.Item label="Tiêu đề">{additionalInfo.title}</Descriptions.Item>
          <Descriptions.Item label="Ngày bắt đầu">{dayjs(additionalInfo.startTime).format('DD/MM/YYYY')}</Descriptions.Item>
          <Descriptions.Item label="Ngày kết thúc">{dayjs(additionalInfo.endTime).format('DD/MM/YYYY')}</Descriptions.Item>
          <Descriptions.Item label="Phí nhượng quyền">
            <Text>{Number(additionalInfo.frachiseFee).toLocaleString('vi-VN')} VND</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Phí thiết kế">
            <Text>{Number(additionalInfo.designFee).toLocaleString('vi-VN')} VND</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Tổng số tiền">
            <Text strong>{Number(additionalInfo.total).toLocaleString('vi-VN')} VND</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Tỷ lệ chia sẻ doanh thu">
            <Text strong>{additionalInfo.revenueSharePercentage}%</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Phần trăm trả trước">
            <Text strong>{additionalInfo.depositPercentage}%</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Tài liệu">
            <Button type="link" icon={<EyeOutlined />} onClick={() => handleDownloadFile(additionalInfo.contractDocumentImageURL)}>
              Xem tài liệu hợp đồng
            </Button>
          </Descriptions.Item>
        </StyledDescriptions>
      );
    }
    return null;
  }, [additionalInfo, taskType, isEditingDocument]);

  const renderContent = () => {
    if (additionalLoading) {
      return (
        <LoadingWrapper>
          <Spin size="large" />
        </LoadingWrapper>
      );
    }

    return (
      <>
        {renderAdditionalInfo}
      </>
    );
  };

  return (
    <StyledModal
      title={<Title level={3}>Nội dung file tài liệu</Title>}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose} size="large">
          Đóng
        </Button>,
        (taskType === 'BusinessRegistered' || taskType === 'EducationLicenseRegistered') && taskSubmit === "None" && !isEditingDocument && (
          <Button key="edit" onClick={handleEditDocument} size="large" type="primary">
            Chỉnh sửa
          </Button>
        ),
        isEditingDocument && (
          <>
            <Button key="cancel" onClick={() => setIsEditingDocument(false)} size="large">
              Hủy
            </Button>,
            <Button key="save" type="primary" onClick={handleSaveDocument} size="large">
              Lưu
            </Button>
          </>
        )
      ]}
      width={800}
    >
      {renderContent()}
    </StyledModal>
  );
};

export default ShowReportModal;

