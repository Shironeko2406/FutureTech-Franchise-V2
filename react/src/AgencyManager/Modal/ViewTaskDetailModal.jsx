import React, { useState } from "react";
import { Modal, Typography, Descriptions, Tag, List, Button, Space, Tooltip, Popconfirm, Tabs } from "antd";
import { CalendarOutlined, ClockCircleOutlined, FileTextOutlined } from "@ant-design/icons";
import styled from "styled-components";
import moment from 'moment';
import { useDispatch, useSelector } from "react-redux";
import { GetAppointmentDetailByIdActionAsync } from "../../Redux/ReducerAPI/AppointmentReducer";
import DOMPurify from 'dompurify';
import ViewAppointmentDetailModal from "./ViewAppointmentDetailModal";

const { Title, Text } = Typography;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  .ant-modal-body {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
  }
`;

const StyledTitle = styled(Title)`
  margin-bottom: 16px !important;
`;

const StyledTag = styled(Tag)`
  font-size: 14px;
  padding: 4px 8px;
`;

const StatusTag = styled.span`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: white;
`;

const AppointmentItem = styled(List.Item)`
  padding: 12px !important;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f9f9f9;
  }
`;

const AppointmentTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  align-items: center;
`;

const AppointmentTime = styled.div`
  color: #8c8c8c;
  font-size: 14px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const HTMLContent = styled.div`
  h1, h2, h3, h4, h5, h6 {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
  ul, ol {
    padding-left: 20px;
  }
`;

const taskTypeTranslations = {
  Interview: "Phỏng vấn",
  AgreementSigned: "Ký thỏa thuận 2 bên",
  BusinessRegistered: "Đăng ký doanh nghiệp",
  SiteSurvey: "Khảo sát mặt bằng",
  Design: "Thiết kế",
  Quotation: "Báo giá cho khách hàng",
  SignedContract: "Ký hợp đồng thành công",
  ConstructionAndTrainning: "Đào tạo và thi công",
  Handover: "Bàn giao",
  EducationLicenseRegistered: "Đăng ký giấy phép giáo dục"
};

const statusTaskTranslations = {
  None: "Chờ xử lý",
  Approved: "Đã duyệt",
  Rejected: "Từ chối",
};

const getStatusColor = (status) => {
  switch (status) {
    case "Approved": return '#52c41a';
    case "Rejected": return '#f5222d';
    case "None":
    default: return '#d9d9d9';
  }
};

const getAppointmentStatus = (startTime, endTime) => {
  const now = moment();
  const start = moment(startTime);
  const end = moment(endTime);

  if (now < start) {
    return { status: "Chưa diễn ra", color: "orange" };
  } else if (now >= start && now <= end) {
    return { status: "Đang diễn ra", color: "green" };
  } else {
    return { status: "Đã kết thúc", color: "red" };
  }
};

const ViewTaskDetailModal = ({ visible, onClose, setVisible, selectedType }) => {
  const { taskDetail } = useSelector((state) => state.WorkReducer);
  const { agencyStatus } = useSelector((state) => state.AgencyReducer);
  const dispatch = useDispatch();
  const [isViewAppointmentModalVisible, setIsViewAppointmentModalVisible] = useState(false);

  //Hàm dòng mở modal

  const showViewAppointmentDetailModal = (id) => {
    setIsViewAppointmentModalVisible(true);
    dispatch(GetAppointmentDetailByIdActionAsync(id));
    onClose();
  };

  const handleViewAppointmentDetailCancel = () => {
    setIsViewAppointmentModalVisible(false);
    setVisible(true);
  };

  //----------------------------------

  const sanitizeHTML = (html) => {
    return {
      __html: DOMPurify.sanitize(html)
    };
  };

  const tabItems = [
    {
      key: '1',
      label: "Thông tin chung",
      children: (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Giai đoạn">
            <StyledTag color="blue">
              {taskTypeTranslations[taskDetail?.type] || taskDetail?.type || "Không xác định"}
            </StyledTag>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <StatusTag style={{ backgroundColor: getStatusColor(taskDetail?.status) }}>
              {(statusTaskTranslations[taskDetail?.status] || taskDetail?.status || "Không xác định").toUpperCase()}
            </StatusTag>
          </Descriptions.Item>
          <Descriptions.Item label="Người duyệt">
            {taskDetail?.approvedBy?.username || "Không có"}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian">
            <CalendarOutlined /> {taskDetail?.startDate ? moment(taskDetail.startDate).format('DD/MM/YYYY HH:mm') : "N/A"} -{" "}
            {taskDetail?.endDate ? moment(taskDetail.endDate).format('DD/MM/YYYY HH:mm') : "N/A"}
          </Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: '2',
      label: "Mô tả",
      children: (
        <div>
          {taskDetail?.description ? (
            <HTMLContent dangerouslySetInnerHTML={sanitizeHTML(taskDetail.description)} />
          ) : (
            <Text type="secondary">Không có mô tả</Text>
          )}
        </div>
      ),
    },
    {
      key: '3',
      label: "Lịch hẹn",
      children: (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Title level={5} style={{ margin: 0 }}>Danh sách lịch hẹn</Title>
          </div>
          <List
            dataSource={taskDetail?.appointments || []}
            renderItem={(appointment) => {
              const { status, color } = getAppointmentStatus(appointment?.startTime, appointment?.endTime);
              return (
                <AppointmentItem style={{ cursor: "pointer" }} onClick={() => showViewAppointmentDetailModal(appointment?.id)}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
                      <AppointmentTitle>
                        {appointment?.title || "Không có tiêu đề"}
                        <StyledTag color={color} style={{ marginLeft: '8px' }}>
                          {status}
                        </StyledTag>
                      </AppointmentTitle>
                    </Space>
                    <AppointmentTime>
                      <ClockCircleOutlined /> {appointment?.startTime ? moment(appointment.startTime).format('DD/MM/YYYY HH:mm') : "N/A"} - {appointment?.endTime ? moment(appointment.endTime).format('DD/MM/YYYY HH:mm') : "N/A"}
                    </AppointmentTime>
                  </Space>
                </AppointmentItem>
              );
            }}
          />
        </div>
      ),
    },
    {
      key: '4',
      label: "Báo cáo",
      children: (
        <div>
          {taskDetail?.report ? (
            <HTMLContent dangerouslySetInnerHTML={sanitizeHTML(taskDetail.report)} />
          ) : (
            <Text type="secondary">Không có báo cáo</Text>
          )}
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
        </div>
      ),
    },
  ];

  const filteredTabItems = taskDetail?.submit === "Submited"
    ? tabItems
    : tabItems.filter(item => item.key !== '4');

  return (
    <>
      <StyledModal
        title={<StyledTitle level={3}>Chi tiết nhiệm vụ</StyledTitle>}
        open={visible}
        onCancel={onClose}
        footer={null}
        width={700}
      >
        <Tabs items={filteredTabItems} />
      </StyledModal>

      <ViewAppointmentDetailModal
        visible={isViewAppointmentModalVisible}
        onClose={handleViewAppointmentDetailCancel}
        selectedType={selectedType}
      />

    </>
  );
};

export default ViewTaskDetailModal;





