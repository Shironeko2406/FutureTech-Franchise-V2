import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Modal, Button, Typography, Spin, Descriptions, Space, Card, Form, Upload, Input, DatePicker } from 'antd';
import styled from 'styled-components';
import { EyeOutlined, FilePdfOutlined, DownloadOutlined, EditOutlined, FileTextOutlined, UploadOutlined } from '@ant-design/icons';
import DOMPurify from 'dompurify';
import { useDispatch, useSelector } from 'react-redux';
import { SubmitTaskReportActionAsync } from '../../Redux/ReducerAPI/WorkReducer';
import { GetDocumentByAgencyIdActionAsync, UpdateDocumentActionAsync } from '../../Redux/ReducerAPI/DocumentReducer';
import dayjs from 'dayjs';
import ReactQuill from 'react-quill';
import { quillFormats, quillModules } from '../../TextEditorConfig/Config';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { imageDB } from "../../Firebasse/Config";
import { useLoading } from '../../Utils/LoadingContext';
import moment from 'moment';

const { Title, Text } = Typography;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
  .ant-modal-header {
    border-bottom: 1px solid #f0f0f0;
    padding: 20px 24px;
    border-radius: 16px 16px 0 0;
  }
  .ant-modal-body {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
    padding: 24px;
  }
  .ant-modal-footer {
    border-top: 1px solid #f0f0f0;
    padding: 16px 24px;
    border-radius: 0 0 16px 16px;
  }
`;

const HTMLContent = styled.div`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  h1, h2, h3, h4, h5, h6 {
    margin-top: 1em;
    margin-bottom: 0.5em;
    font-weight: 600;
    color: #1890ff;
  }
  ul, ol {
    padding-left: 24px;
    margin-bottom: 1em;
  }
  p {
    margin-bottom: 1em;
  }
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1em 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  gap: 12px;
  margin-top: 24px;
`;

const StyledCard = styled(Card)`
  margin-top: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  .ant-card-head {
    background-color: #f0f5ff;
  }
`;

const ShowReportModal = ({ visible, onClose, taskId, taskType }) => {
  const dispatch = useDispatch();
  const { taskDetail, loading } = useSelector((state) => state.WorkReducer);
  const { setLoading } = useLoading();
  const [additionalInfo, setAdditionalInfo] = useState(null);
  const [additionalLoading, setAdditionalLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDocument, setIsEditingDocument] = useState(false);
  const [form] = Form.useForm();
  const [uploadedEquipmentFileURL, setUploadedEquipmentFileURL] = useState(null);
  const uploadedFileURLRef = useRef(null);
  const uploadedDocumentFileURLRef = useRef(null);

  useEffect(() => {
    if (visible && taskId) {
      console.log("taskDetail", taskDetail);
      if (taskType === 'EducationLicenseRegistered') {
        setAdditionalLoading(true);
        dispatch(GetDocumentByAgencyIdActionAsync(taskDetail.agencyId, 'EducationalOperationLicense')).then((res) => {
          setAdditionalInfo(res);
          setAdditionalLoading(false);
        });
      }
    }
  }, [visible, taskId, taskType, dispatch, taskDetail?.agencyId]);

  useEffect(() => {
    if (!visible) {
      setIsEditing(false);
      setIsEditingDocument(false);
      form.resetFields();
    }
  }, [visible]);

  const handleEditReport = () => {
    setIsEditing(true);
    form.setFieldsValue({
      report: taskDetail.report,
      reportImageURL: taskDetail.reportImageURL ? [{
        uid: '-1',
        name: 'Tệp đính kèm hiện tại',
        status: 'done',
        url: taskDetail.reportImageURL,
      }] : [],
    });
  };

  const handleSaveReport = async () => {
    setLoading(true);
    try {
      console.log("handleSaveReport", uploadedFileURLRef.current);
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        reportImageURL: uploadedFileURLRef.current || (values.reportImageURL && values.reportImageURL[0] ? values.reportImageURL[0].url : null),
      };
      await dispatch(SubmitTaskReportActionAsync(taskId, formattedValues));
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving report: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async ({ file, onSuccess, onError }) => {
    const storageRef = ref(imageDB, `files/${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      uploadedFileURLRef.current = url;
      onSuccess({ url }, file);
    } catch (error) {
      console.error("Upload error: ", error);
      onError(error);
    }
  };

  const handleSaveDocument = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      console.log("handleSaveDocument - Latest Document File URL:", uploadedDocumentFileURLRef.current);
      const formattedValues = {
        ...values,
        urlFile: uploadedDocumentFileURLRef.current || (values.urlFile && values.urlFile[0] ? values.urlFile[0].url : additionalInfo.urlFile),
        contractDocumentImageURL: uploadedDocumentFileURLRef.current || (values.contractDocumentImageURL && values.contractDocumentImageURL[0] ? values.contractDocumentImageURL[0].url : additionalInfo.contractDocumentImageURL),
      };
      console.log("handleSaveDocument, formattedValues:", formattedValues);
      const documentData = {
        title: values.title,
        expirationDate: values.expirationDate ? values.expirationDate.format('YYYY-MM-DD') : null,
        urlFile: formattedValues.urlFile,
        type: 'EducationalOperationLicense',
      };
      await dispatch(UpdateDocumentActionAsync(additionalInfo.id, documentData));
      setAdditionalInfo({ ...additionalInfo, ...documentData });
      setIsEditingDocument(false);
    } catch (error) {
      console.error("Error saving document: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDocumentFile = async ({ file, onSuccess, onError }) => {
    const storageRef = ref(imageDB, `files/${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      console.log("handleUploadDocumentFile", url);
      uploadedDocumentFileURLRef.current = url;
      console.log("handleUploadDocumentFile - Latest URL:", uploadedDocumentFileURLRef.current);
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
      startTime: additionalInfo.startTime ? dayjs(additionalInfo.startTime) : null,
      endTime: additionalInfo.endTime ? dayjs(additionalInfo.endTime) : null,
      revenueSharePercentage: additionalInfo.revenueSharePercentage,
      urlFile: additionalInfo.urlFile ? [{
        uid: '-1',
        name: 'Tệp tài liệu hiện tại',
        status: 'done',
        url: additionalInfo.urlFile,
      }] : [],
      contractDocumentImageURL: additionalInfo.contractDocumentImageURL ? [{
        uid: '-1',
        name: 'Tệp hợp đồng hiện tại',
        status: 'done',
        url: additionalInfo.contractDocumentImageURL,
      }] : [],
    });
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
            rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn' }]}
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
              <Button icon={<UploadOutlined />}>Tải tài liệu</Button>
            </Upload>
          </Form.Item>
          <ButtonGroup>
            <Button onClick={() => setIsEditingDocument(false)}>Hủy</Button>
            <Button type="primary" onClick={handleSaveDocument}>Lưu</Button>
          </ButtonGroup>
        </Form>
      );
    }

    return (
      <StyledDescriptions bordered column={1}>
        <Descriptions.Item label="Tiêu đề">{additionalInfo.title}</Descriptions.Item>
        <Descriptions.Item label="Ngày hết hạn">{dayjs(additionalInfo.expirationDate).format('DD/MM/YYYY')}</Descriptions.Item>
        <Descriptions.Item label="Tài liệu">
          <Button type="link" icon={<DownloadOutlined />} href={additionalInfo.urlFile} target="_blank" rel="noopener noreferrer">
            Tải xuống file tài liệu
          </Button>
        </Descriptions.Item>
      </StyledDescriptions>
    );
  }, [additionalInfo, taskType, isEditingDocument]);

  const renderContent = () => {
    if (loading || additionalLoading) {
      return (
        <LoadingWrapper>
          <Spin size="large" />
        </LoadingWrapper>
      );
    }

    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <StyledCard
          title="Nội dung báo cáo"
          extra={
            taskDetail.status === "None" && taskDetail.submit === "None" && (
              <Button type="primary" icon={<EditOutlined />} onClick={handleEditReport}>
                Chỉnh sửa
              </Button>
            )
          }
        >
          {isEditing ? (
            <Form form={form} layout="vertical">
              <Form.Item
                name="report"
                label="Báo cáo"
                rules={[
                  { required: true, message: 'Vui lòng nhập báo cáo' },
                  { max: 10000, message: 'Báo cáo không được vượt quá 10000 chữ' }
                ]}
              >
                <ReactQuill
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Nhập báo cáo công việc"
                  style={{ minHeight: '200px' }}
                />
              </Form.Item>
              <Form.Item
                name="reportImageURL"
                label="File đính kèm"
              >
                <Upload
                  name="reportFile"
                  customRequest={handleUpload}
                  accept="*"
                  maxCount={1}
                  defaultFileList={taskDetail.reportImageURL ? [{
                    uid: '-1',
                    name: 'Tệp đính kèm hiện tại',
                    status: 'done',
                    url: taskDetail.reportImageURL,
                  }] : []}
                >
                  <Button icon={<UploadOutlined />}>
                    {taskDetail.reportImageURL ? "Tải file khác" : "Tải file"}
                  </Button>
                </Upload>
              </Form.Item>
              <ButtonGroup>
                <Button onClick={() => setIsEditing(false)}>Hủy</Button>
                <Button type="primary" onClick={handleSaveReport}>Lưu</Button>
              </ButtonGroup>
            </Form>
          ) : (
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <HTMLContent dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(taskDetail.report) }} />
              {taskDetail.reportImageURL && (
                <Button
                  type="primary"
                  icon={<FilePdfOutlined />}
                  href={taskDetail.reportImageURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Xem tài liệu đính kèm
                </Button>
              )}
            </Space>
          )}
        </StyledCard>

        {renderAdditionalInfo && (
          <StyledCard
            title="Thông tin Giấy chứng nhận đăng ký hoạt động giáo dục"
            extra={
              taskDetail.status === "None" && taskDetail.submit === "None" && (
                <Button icon={<FileTextOutlined />} onClick={handleEditDocument}>
                  Chỉnh sửa
                </Button>
              )
            }
          >
            {renderAdditionalInfo}
          </StyledCard>
        )}
      </Space>
    );
  };

  return (
    <StyledModal
      title={<Title level={3}>Chi tiết báo cáo</Title>}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose} size="large">
          Đóng
        </Button>
      ]}
      width={800}
    >
      {renderContent()}
    </StyledModal>
  );
};

export default ShowReportModal;

