import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Button, Typography, Spin, Descriptions } from 'antd';
import styled from 'styled-components';
import { EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { GetTaskDetailByIdActionAsync } from '../../Redux/ReducerAPI/WorkReducer';
import { GetDocumentByAgencyIdActionAsync } from '../../Redux/ReducerAPI/DocumentReducer';
import { GetContractDetailByAgencyIdActionAsync } from '../../Redux/ReducerAPI/ContractReducer';
import dayjs from 'dayjs';

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

const ShowReportModal = ({ visible, onClose, taskId, taskType, agencyId }) => {
  const dispatch = useDispatch();
  const [additionalInfo, setAdditionalInfo] = useState(null);
  const [additionalLoading, setAdditionalLoading] = useState(false);

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

  const renderAdditionalInfo = useMemo(() => {
    if (!additionalInfo) return null;

    if (taskType === 'AgreementSigned' || taskType === 'BusinessRegistered' || taskType === 'EducationLicenseRegistered') {
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
    } else if (taskType === 'SignedContract') {
      return (
        <StyledDescriptions bordered column={1}>
          <Descriptions.Item label="Tiêu đề">{additionalInfo.title}</Descriptions.Item>
          <Descriptions.Item label="Ngày bắt đầu">{dayjs(additionalInfo.startTime).format('DD/MM/YYYY')}</Descriptions.Item>
          <Descriptions.Item label="Ngày kết thúc">{dayjs(additionalInfo.endTime).format('DD/MM/YYYY')}</Descriptions.Item>
          <Descriptions.Item label="Tổng số tiền">
            <Text strong>{Number(additionalInfo.total).toLocaleString('vi-VN')} VND</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Tỷ lệ chia sẻ doanh thu">
            <Text strong>{additionalInfo.revenueSharePercentage}%</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Tài liệu">
            <Button type="link" icon={<EyeOutlined />} href={additionalInfo.contractDocumentImageURL} target="_blank" rel="noopener noreferrer">
              Xem tài liệu hợp đồng
            </Button>
          </Descriptions.Item>
        </StyledDescriptions>
      );
    }
    return null;
  }, [additionalInfo, taskType]);

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
        </Button>
      ]}
      width={800}
    >
      {renderContent()}
    </StyledModal>
  );
};

export default ShowReportModal;

