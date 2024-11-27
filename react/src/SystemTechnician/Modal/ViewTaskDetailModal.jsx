import React, { useState } from "react";
import { Modal, Typography, Descriptions, Tag, List, Space, Tabs, Button } from "antd";
import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, FileOutlined, LinkOutlined, PlusOutlined, UndoOutlined} from "@ant-design/icons";
import styled from "styled-components";
import moment from 'moment';
import { useDispatch, useSelector } from "react-redux";
import { useLoading } from "../../Utils/LoadingContext";
import { GetAppointmentDetailByIdActionAsync } from "../../Redux/ReducerAPI/AppointmentReducer";
import DOMPurify from 'dompurify';
import ViewAppointmentDetailModal from "./ViewAppointmentDetailModal";
import SubmitReportTaskModal from "./SubmitReportTaskModal";
import { UpdateStatusSubmitByTaskByIdActionAsync } from "../../Redux/ReducerAPI/WorkReducer";

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

const ReportSection = styled.div`
  margin-top: 5px;
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
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

const ViewTaskDetailModal = ({ visible, onClose, setVisible, filters, pageIndex, pageSize }) => {
  const { taskDetail } = useSelector((state) => state.WorkReducer);
  const dispatch = useDispatch();
  const {setLoading} = useLoading()
  const [isViewAppointmentModalVisible, setIsViewAppointmentModalVisible] = useState(false);
  const [submitReportModalVisible, setSubmitReportModalVisible] = useState(false);

  const handleUpdateSubmit = (status) => {
    setLoading(true)
    dispatch(UpdateStatusSubmitByTaskByIdActionAsync(status, taskDetail.id, filters, pageIndex, pageSize)).finally(() => setLoading(false));
  }

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

  const showSubmitReportTaskModal = () => {
    setSubmitReportModalVisible(true);
    onClose();
  };

  const handleSubmitReportTaskModalCancel = () => {
    setSubmitReportModalVisible(false);
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
          <Title level={5} style={{ margin: 0 }} className="mb-3">Danh sách lịch hẹn</Title>
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
        <ReportSection>
          <ReportHeader>        
            <Title level={4}>Báo cáo công việc</Title>
            <Space>
              {taskDetail?.status === "None" && (
                <Button
                  type="text"
                  onClick={() => handleUpdateSubmit(taskDetail?.submit === "None" ? "Submited" : "None")}
                  icon={taskDetail?.submit === "None" ? <CheckCircleOutlined /> : <UndoOutlined />}
                  title={taskDetail?.submit === "None" ? "Đánh dấu đã nộp" : "Đánh dấu chưa nộp"}
              />
              )}
              {taskDetail?.status === "None" && taskDetail?.submit === "None" && (
                <Button type="primary" icon={<PlusOutlined />} onClick={showSubmitReportTaskModal}>Thêm báo cáo</Button>
              )}
            </Space>
          </ReportHeader>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Báo cáo">
              {taskDetail?.report || "Không có báo cáo"}
            </Descriptions.Item>
            <Descriptions.Item label="File báo cáo">
              {taskDetail?.reportImageURL ? (
                <a 
                  href={taskDetail.reportImageURL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <FileOutlined style={{ marginRight: 8 }} />
                  Xem file báo cáo
                </a>
              ) : (
                "Không có file báo cáo"
              )}
            </Descriptions.Item>
          </Descriptions>
        </ReportSection>
      ),
    }
  ];

  return (
    <>
      <StyledModal
        title={<StyledTitle level={3}>Chi tiết nhiệm vụ</StyledTitle>}
        open={visible}
        onCancel={onClose}
        footer={null}
        width={700}
      >
        <Tabs items={tabItems} />
      </StyledModal>

      <ViewAppointmentDetailModal
        visible={isViewAppointmentModalVisible}
        onClose={handleViewAppointmentDetailCancel}
      />

      <SubmitReportTaskModal
        visible={submitReportModalVisible}
        onClose={handleSubmitReportTaskModalCancel}
      />

    </>
  );
};

export default ViewTaskDetailModal;





