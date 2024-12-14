import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Modal, Button, Typography, Spin, Descriptions, Space, Card, Form, Upload, Input, DatePicker } from 'antd';
import styled from 'styled-components';
import { EyeOutlined, FilePdfOutlined, DownloadOutlined, EditOutlined, FileTextOutlined, UploadOutlined } from '@ant-design/icons';
import DOMPurify from 'dompurify';
import { useDispatch, useSelector } from 'react-redux';
import { SubmitTaskReportActionAsync } from '../../Redux/ReducerAPI/WorkReducer';
import { GetDocumentByAgencyIdActionAsync, UpdateDocumentActionAsync } from '../../Redux/ReducerAPI/DocumentReducer';
import { GetContractDetailByAgencyIdActionAsync, UpdateContractActionAsync } from '../../Redux/ReducerAPI/ContractReducer';
import { CreateEquipmentActionAsync, DownloadEquipmentFileActionAsync } from '../../Redux/ReducerAPI/EquipmentReducer';
import dayjs from 'dayjs';
import ReactQuill from 'react-quill';
import { quillFormats, quillModules } from '../../TextEditorConfig/Config';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { imageDB } from "../../Firebasse/Config";
import { useLoading } from '../../Utils/LoadingContext';
import moment from 'moment';
import { GetTaskUserByLoginActionAsync } from '../../Redux/ReducerAPI/UserReducer';
import CreateCashPaymentModal from './CreateCashPaymentModal';

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

const ShowReportModal = ({ visible, onClose, taskId, taskType, task, filters, pageIndex, pageSize }) => {
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
  const [modalCreateCashPaymentVisible, setModalCreateCashPaymentVisible] = useState(false);

  useEffect(() => {
    if (visible && taskId && taskDetail) {
      console.log("taskDetail", taskDetail);
      let documentType = '';
      if (taskType === 'AgreementSigned') {
        documentType = 'AgreementContract';
      } else if (taskType === 'BusinessRegistered') {
        documentType = 'BusinessLicense';
      } else if (taskType === 'EducationLicenseRegistered') {
        documentType = 'EducationalOperationLicense';
      } else if (taskType === 'Handover') {
        documentType = 'Handover';
      };

      if (documentType) {
        setAdditionalLoading(true);
        dispatch(GetDocumentByAgencyIdActionAsync(taskDetail.agencyId, documentType)).then((res) => {
          setAdditionalInfo(res);
          setAdditionalLoading(false);
        });
      } else if (taskType === 'SignedContract') {
        setAdditionalLoading(true);
        dispatch(GetContractDetailByAgencyIdActionAsync(taskDetail.agencyId)).then((res) => {
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

      if (taskType === "Design" && uploadedEquipmentFileURL) {
        const equipmentFormData = new FormData();
        equipmentFormData.append('file', uploadedEquipmentFileURL);
        const equipmentResponse = await dispatch(CreateEquipmentActionAsync(taskDetail.agencyId, equipmentFormData));
        if (!equipmentResponse) {
          throw new Error("Error creating equipment");
        }
      }

      await dispatch(SubmitTaskReportActionAsync(taskId, formattedValues));
      setIsEditing(false);
      await dispatch(GetTaskUserByLoginActionAsync(
        filters.searchText,
        filters.levelFilter,
        filters.statusFilter,
        filters.submitFilter,
        pageIndex,
        pageSize
      ));
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

  const handleUploadEquipmentFile = async ({ file, onSuccess, onError }) => {
    setUploadedEquipmentFileURL(file);
    onSuccess(null, file);
  };

  const handleDownloadEquipmentFile = async () => {
    setLoading(true);
    await dispatch(DownloadEquipmentFileActionAsync(taskDetail.agencyId));
    setLoading(false);
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
      if (taskType === 'AgreementSigned' || taskType === 'BusinessRegistered' || taskType === 'EducationLicenseRegistered') {
        const documentData = {
          title: values.title,
          expirationDate: values.expirationDate ? values.expirationDate.format('YYYY-MM-DD') : null,
          urlFile: formattedValues.urlFile,
          type: taskType === 'AgreementSigned' ? 'AgreementContract' : taskType === 'BusinessRegistered' ? 'BusinessLicense' : 'EducationalOperationLicense',
        };

        await dispatch(UpdateDocumentActionAsync(additionalInfo.id, documentData));
        setAdditionalInfo({ ...additionalInfo, ...documentData });
      } else if (taskType === 'SignedContract') {
        const contractData = {
          title: values.title,
          startTime: values.startTime.format('YYYY-MM-DD'),
          endTime: values.endTime.format('YYYY-MM-DD'),
          contractDocumentImageURL: formattedValues.contractDocumentImageURL,
          revenueSharePercentage: parseFloat(values.revenueSharePercentage),
          depositPercentage: parseFloat(values.depositPercentage)
        };
        await dispatch(UpdateContractActionAsync(additionalInfo.id, contractData));
        setAdditionalInfo({ ...additionalInfo, ...contractData });
      }

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
      depositPercentage: additionalInfo.depositPercentage,
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

  const handleAddReport = () => {
    setIsEditing(true);
    form.setFieldsValue({
      report: '',
      reportImageURL: [],
    });
  };

  const handleCreateCashPayment = () => {
    setModalCreateCashPaymentVisible(true);
  };

  const handleCashPaymentClose = async () => {
    setModalCreateCashPaymentVisible(false);
    await dispatch(GetContractDetailByAgencyIdActionAsync(taskDetail.agencyId));
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
          {taskType === 'AgreementSigned' || taskType === 'BusinessRegistered' || taskType === 'EducationLicenseRegistered' ? (
            <Form.Item
              name="expirationDate"
              label="Ngày hết hạn"
              rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn' }]}
            >
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" disabledDate={(current) => current && current < moment().startOf('day')} />
            </Form.Item>
          ) : (
            <>
              <Form.Item
                name="startTime"
                label="Ngày bắt đầu"
                rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
              >
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" disabledDate={(current) => current && current < moment().startOf('day')} />
              </Form.Item>
              <Form.Item
                name="endTime"
                label="Ngày kết thúc"
                rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
              >
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" disabledDate={(current) => current && current <= form.getFieldValue('startTime')} />
              </Form.Item>
              <Form.Item
                name="revenueSharePercentage"
                label="Tỉ lệ phần trăm ăn chia nhượng quyền"
                rules={[
                  { required: true, message: 'Vui lòng nhập tỉ lệ phần trăm' },
                  {
                    pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
                    message: "Vui lòng nhập số thực hợp lệ (VD: 10.5).",
                  },
                  {
                    validator: (_, value) => {
                      if (!value || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Phần trăm phải nằm trong khoảng 0 đến 100!"));
                    },
                  },
                ]}
              >
                <Input min={0} max={100} placeholder="Nhập tỉ lệ phần trăm. VD: 10.5)" addonAfter="%" style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="depositPercentage"
                label="Tỉ lệ phần trăm đặt cọc"
                rules={[
                  { required: true, message: 'Vui lòng nhập tỉ lệ phần trăm đặt cọc' },
                  {
                    pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
                    message: "Vui lòng nhập số thực hợp lệ (VD: 20.5).",
                  },
                  {
                    validator: (_, value) => {
                      if (!value || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Phần trăm phải nằm trong khoảng 0 đến 100!"));
                    },
                  },
                ]}
              >
                <Input min={0} max={100} placeholder="Nhập tỉ lệ phần trăm đặt cọc. VD: 20.5)" addonAfter="%" style={{ width: '100%' }} />
              </Form.Item>
            </>
          )}
          {taskType !== 'SignedContract' && (
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
          )}
          {taskType === 'SignedContract' && (
            <Form.Item
              name="contractDocumentImageURL"
              label="File hợp đồng"
              rules={[{ required: true, message: 'Vui lòng upload file hợp đồng' }]}
            >
              <Upload
                name="contractFile"
                customRequest={handleUploadDocumentFile}
                accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                maxCount={1}
                defaultFileList={additionalInfo.contractDocumentImageURL ? [{
                  uid: '-1',
                  name: 'Tệp hợp đồng hiện tại',
                  status: 'done',
                  url: additionalInfo.contractDocumentImageURL,
                }] : []}
              >
                <Button icon={<UploadOutlined />}>Tải hợp đồng</Button>
              </Upload>
            </Form.Item>
          )}
          <ButtonGroup>
            <Button onClick={() => setIsEditingDocument(false)}>Hủy</Button>
            <Button type="primary" onClick={handleSaveDocument}>Lưu</Button>
          </ButtonGroup>
        </Form>
      );
    }

    if (taskType === 'AgreementSigned' || taskType === 'BusinessRegistered' || taskType === 'EducationLicenseRegistered' || taskType === 'Handover') {
      return (
        <StyledDescriptions bordered column={1}>
          <Descriptions.Item label="Tiêu đề">{additionalInfo.title}</Descriptions.Item>
          {additionalInfo.expirationDate && (
            <Descriptions.Item label="Ngày hết hạn">{dayjs(additionalInfo.expirationDate).format('DD/MM/YYYY')}</Descriptions.Item>
          )}
          <Descriptions.Item label="Tài liệu">
            <Button type="link" icon={<DownloadOutlined />} href={(taskType === 'AgreementSigned' && taskDetail.level === "Compulsory") ? taskDetail.customerSubmit : additionalInfo.urlFile} target="_blank" rel="noopener noreferrer">
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
          <Descriptions.Item label="Phí trang thiết bị">
            <Text>{Number(additionalInfo.equipmentFee).toLocaleString('vi-VN')} VND</Text>
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
          <Descriptions.Item label="Số tiền đã trả">
            <Text strong>{Number(additionalInfo.paidAmount).toLocaleString('vi-VN')} VND</Text>
          </Descriptions.Item>
          {(taskDetail.level === "Compulsory" && taskDetail.customerSubmit) && (
            <Descriptions.Item label="Tài liệu hợp đồng khách gửi">
              <Button type="link" icon={<EyeOutlined />} href={taskDetail.customerSubmit} target="_blank" rel="noopener noreferrer">
                Xem tài liệu hợp đồng khách gửi
              </Button>
            </Descriptions.Item>
          )}
          {additionalInfo.contractDocumentImageURL && (
            <Descriptions.Item label="Tài liệu hợp đồng gốc">
              <Button type="link" icon={<EyeOutlined />} href={additionalInfo.contractDocumentImageURL} target="_blank" rel="noopener noreferrer">
                Xem tài liệu hợp đồng gốc
              </Button>
            </Descriptions.Item>
          )}
        </StyledDescriptions>
      );
    }
    return null;
  }, [additionalInfo, taskType, isEditingDocument, task]);

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
          title={"Nội dung báo cáo"}
          extra={
            taskDetail.report === null ? (
              <Button type="primary" icon={<EditOutlined />} onClick={handleAddReport}>
                Thêm báo cáo
              </Button>
            ) : (
              taskDetail.status === "None" && taskDetail.submit === "None" && (
                <Button type="primary" icon={<EditOutlined />} onClick={handleEditReport}>
                  Chỉnh sửa
                </Button>
              )
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
                label={taskType === "Design" ? "File thiết kế" : "File đính kèm"}
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
                    {taskDetail.reportImageURL ? "Thêm file khác" : "Thêm file"}
                  </Button>
                </Upload>
              </Form.Item>
              {taskType === "Design" && (
                <Form.Item
                  name="equipmentFileURL"
                  label="File trang thiết bị"
                >
                  <Upload
                    name="equipmentFile"
                    customRequest={handleUploadEquipmentFile}
                    accept=".xls,.xlsx"
                    maxCount={1}
                    defaultFileList={taskDetail.equipmentFileURL ? [{
                      uid: '-1',
                      name: 'Tệp trang thiết bị hiện tại',
                      status: 'done',
                      url: taskDetail.equipmentFileURL,
                    }] : []}
                  >
                    <Button icon={<UploadOutlined />}>
                      {taskDetail.equipmentFileURL ? "Thêm file khác" : "Thêm file"}
                    </Button>
                  </Upload>
                </Form.Item>
              )}
              <ButtonGroup>
                <Button onClick={() => setIsEditing(false)}>Hủy</Button>
                <Button type="primary" onClick={handleSaveReport}>Lưu</Button>
              </ButtonGroup>
            </Form>
          ) : (
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <HTMLContent dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(taskDetail.report) }} />
              {taskDetail?.reportImageURL && (
                <Button
                  type="primary"
                  icon={<FileTextOutlined />}
                  href={taskDetail.reportImageURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginTop: '16px' }}
                >
                  Xem tài liệu đính kèm
                </Button>
              )}
              {/* {taskDetail?.customerSubmit && (
                <Button
                  type="primary"
                  icon={<FileTextOutlined />}
                  href={taskDetail.customerSubmit}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginTop: '16px' }}
                >
                  Xem tài liệu bên liên quan nộp
                </Button>
              )}s */}
              {taskType === "Design" && (
                <Button
                  type="primary"
                  icon={<FilePdfOutlined />}
                  onClick={handleDownloadEquipmentFile}
                >
                  Xuất file trang thiết bị
                </Button>
              )}
            </Space>
          )}
        </StyledCard>

        {renderAdditionalInfo && (
          <StyledCard
            title={
              taskType === 'AgreementSigned'
                ? 'Thông tin giấy thỏa thuận nguyên tắc'
                : taskType === 'BusinessRegistered'
                  ? 'Thông tin Giấy Đăng Ký Doanh Nghiệp'
                  : taskType === 'EducationLicenseRegistered'
                    ? 'Thông tin Giấy chứng nhận đăng ký hoạt động giáo dục'
                    : 'Thông tin hợp đồng'
            }
            extra={
              taskDetail.status === "None" && taskDetail.submit === "None" && taskDetail.level !== "Compulsory" &&
              (taskType === 'AgreementSigned' || taskType === 'SignedContract') && (
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
      title={<Title level={3}>{taskDetail.report === null ? "Chi tiết tài liệu" : "Chi tiết báo cáo"}</Title>}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose} size="large">
          Đóng
        </Button>,
        taskType === 'SignedContract' && !additionalInfo?.paidAmount && (
          <Button type="primary" size="large" onClick={handleCreateCashPayment}>
            Tạo thanh toán tiền mặt
          </Button>
        )
      ]}
      width={800}
    >
      {renderContent()}
      <CreateCashPaymentModal
        visible={modalCreateCashPaymentVisible}
        onClose={handleCashPaymentClose}
        agencyId={taskDetail.agencyId}
      />
    </StyledModal>
  );
};

export default ShowReportModal;

