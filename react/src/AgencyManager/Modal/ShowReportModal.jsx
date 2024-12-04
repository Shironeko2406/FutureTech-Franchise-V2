import React, { useEffect } from 'react';
import { Modal, Button, Typography, Spin, Empty } from 'antd';
import styled from 'styled-components';
import { EyeOutlined, FilePdfOutlined } from '@ant-design/icons';
import DOMPurify from 'dompurify';
import { useDispatch, useSelector } from 'react-redux';
import { GetTaskDetailByIdActionAsync } from '../../Redux/ReducerAPI/WorkReducer';

const { Title, Paragraph } = Typography;

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

const HTMLContent = styled.div`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;

  h1, h2, h3, h4, h5, h6 {
    margin-top: 1em;
    margin-bottom: 0.5em;
    font-weight: 600;
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
  }
`;

const ReportLink = styled(Button)`
  margin-top: 24px;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const ShowReportModal = ({ visible, onClose, taskId }) => {
  const dispatch = useDispatch();
  const { taskDetail, loading } = useSelector((state) => state.WorkReducer);

  useEffect(() => {
    if (visible && taskId) {
      dispatch(GetTaskDetailByIdActionAsync(taskId));
    }
  }, [visible, taskId, dispatch]);

  const renderContent = () => {
    if (loading) {
      return (
        <LoadingWrapper>
          <Spin size="large" />
        </LoadingWrapper>
      );
    }

    if (!taskDetail?.report) {
      return <Empty description="Không có nội dung báo cáo" />;
    }

    return (
      <>
        <HTMLContent dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(taskDetail.report) }} />
        {taskDetail.reportImageURL && (
          <ReportLink
            type="primary"
            icon={<FilePdfOutlined />}
            href={taskDetail.reportImageURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Xem tài liệu đính kèm
          </ReportLink>
        )}
      </>
    );
  };

  return (
    <StyledModal
      title={<Title level={3}>Nội dung báo cáo</Title>}
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

