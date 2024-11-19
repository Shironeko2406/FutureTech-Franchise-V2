import React, { useState } from "react";
import { Modal, Typography, Descriptions, Tag, List, Button, Spin, Form, Input, Select, DatePicker } from "antd";
import { CalendarOutlined, ClockCircleOutlined, PlusOutlined } from "@ant-design/icons";
import styled from "styled-components";
import moment from 'moment';
import { useDispatch, useSelector } from "react-redux";
import { useLoading } from "../../Utils/LoadingContext";
import { UpdateStatusTaskByIdActionAsync } from "../../Redux/ReducerAPI/WorkReducer";
import { useParams } from "react-router-dom";
import CreateAppointmentModal from "./CreateAppointmentModal";
import ViewAppointmentDetail from "./ViewAppointmentDetail";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const StyledTitle = styled(Title)`
  margin-bottom: 24px !important;
`;

const StyledDescriptions = styled(Descriptions)`
  margin-bottom: 24px;
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

const AppointmentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
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

const ViewTaskDetailModal = ({ visible, onClose, setVisible }) => {
  const { taskDetail } = useSelector((state) => state.WorkReducer);
  const dispatch = useDispatch();
  const { setLoading } = useLoading();
  const { id: agencyId } = useParams();
  const [isAddAppointmentModalVisible, setIsAddAppointmentModalVisible] = useState(false);
  const [isViewAppointmentModalVisible, setIsViewAppointmentModalVisible] = useState(false);

  const handleUpdateStatusTaskById = (taskId, status) => {
    dispatch(UpdateStatusTaskByIdActionAsync(taskId, status, agencyId));
  };

  //Hàm đóng mở các modal
  const showAddAppointmentModal = () => {
    setIsAddAppointmentModalVisible(true);
    onClose()
  };

  const handleAddAppointmentCancel = () => {
    setIsAddAppointmentModalVisible(false);
    setVisible(true)
  };

  const showViewAppointmentDetailModal = (id) => {
    setIsViewAppointmentModalVisible(true);
    onClose()
  };

  const handleViewAppointmentDetailCancel = () => {
    setIsViewAppointmentModalVisible(false);
    setVisible(true)
  };

  //-------------------------------

  if (Object.keys(taskDetail).length === 0) {
    return (
      <Modal open={visible} onCancel={onClose} footer={null} title="Chi tiết nhiệm vụ">
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      </Modal>
    );
  }

  return (
    <>
      <StyledModal
        title={<StyledTitle level={3}>Chi tiết nhiệm vụ</StyledTitle>}
        open={visible}
        onCancel={onClose}
        footer={
          taskDetail.status === "None" ? (
            <ModalFooter>
              <Button onClick={() => handleUpdateStatusTaskById(taskDetail.id, 'Rejected')}>Từ chối</Button>
              <Button type="primary" onClick={() => handleUpdateStatusTaskById(taskDetail.id, 'Approved')}>Duyệt</Button>
            </ModalFooter>
          ) : null
        }
        width={600}
      >
        <StyledDescriptions column={1} bordered>
          <Descriptions.Item label="Mô tả">
            {taskDetail.description}
          </Descriptions.Item>
          <Descriptions.Item label="Giai đoạn">
            <StyledTag color="blue">{taskTypeTranslations[taskDetail.type] || taskDetail.type}</StyledTag>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <StatusTag style={{ backgroundColor: getStatusColor(taskDetail.status) }}>
              {statusTaskTranslations[taskDetail.status].toUpperCase() || taskDetail.status.toUpperCase()}
            </StatusTag>
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian">
            <CalendarOutlined /> {moment(taskDetail.startDate).format('DD/MM/YYYY HH:mm')} -{" "}
            {moment(taskDetail.endDate).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>
        </StyledDescriptions>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={4}>Lịch hẹn</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddAppointmentModal}>
            Thêm cuộc họp
          </Button>
        </div>

        <List
          dataSource={taskDetail.appointments}
          renderItem={(appointment) => {
            const { status, color } = getAppointmentStatus(appointment.startTime, appointment.endTime);
            return (
              <AppointmentItem style={{ cursor: "pointer" }} onClick={()=>showViewAppointmentDetailModal(appointment.id)}>
                <div>
                  <Text strong>{appointment.title}</Text>
                  <br />
                  <Text type="secondary">
                    <ClockCircleOutlined /> {moment(appointment.startTime).format('DD/MM/YYYY HH:mm')} -{" "}
                    {moment(appointment.endTime).format('DD/MM/YYYY HH:mm')}
                  </Text>
                </div>
                <StyledTag color={color}>
                  {status}
                </StyledTag>
              </AppointmentItem>
            );
          }}
        />
      </StyledModal>

      <CreateAppointmentModal
        visible={isAddAppointmentModalVisible}
        onClose={handleAddAppointmentCancel}
        workId={taskDetail.id}
      />

      <ViewAppointmentDetail
        visible={isViewAppointmentModalVisible}
        onClose={handleViewAppointmentDetailCancel}
      />
    </>
  );
};

export default ViewTaskDetailModal;