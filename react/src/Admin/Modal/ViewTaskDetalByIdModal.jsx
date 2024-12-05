import { Button, Descriptions, List, Modal, Popconfirm, Space, Tabs, Tag, Tooltip, Typography } from 'antd';
import React, { useState } from 'react'
import DOMPurify from 'dompurify';
import { CalendarOutlined, ClockCircleOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import ViewAppointmentDetailTemplateById from './ViewAppointmentDetailTemplateById';
import CreateAppointmentTemplateModal from './CreateAppointmentTemplateModal';
import { DeleteAppointmentTemplateByIdActionAsync } from '../../Redux/ReducerAPI/AppointmentTemplateReducer';
import { useLoading } from '../../Utils/LoadingContext';
import EditAppointmentTemplateModal from './EditAppointmentTemplateModal';

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

const LevelTag = styled.span`
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

const levelStatusTranslations = {
  Optional: "Không bắt buộc",
  Compulsory: "Bắt buộc",
};

const getLevelStatusColor = (status) => {
  switch (status) {
    case "Optional": return '#1890ff';
    case "Compulsory": return '#f5222d';
    default: return '#d9d9d9';
  }
};

// const taskDetailTemplate = {
//     "id": "fe18b609-cd62-42e2-8cd8-a8c0d358d9ec",
//     "title": "Ký thỏa thuận với đối tác - ",
//     "description": "<p>Buổi ký thỏa thuận nhằm đảm bảo đối tác đồng ý với các điều khoản cơ bản.</p>\r\n<ul>\r\n    <li><strong>Kiểm tra:</strong> Rà soát kỹ các điều khoản thỏa thuận.</li>\r\n    <li><strong>Ký thỏa thuận:</strong> Đại diện hai bên chính thức xác nhận đồng ý hợp tác.</li>\r\n</ul>\r\n<p><strong>Nhân viên cần chuẩn bị:</strong> Bản dự thảo thỏa thuận và tài liệu pháp lý liên quan.</p>\r\n<p><strong>Thời gian:</strong> 1-2 giờ</p>\r\n<p><strong>Kết quả:</strong> Thỏa thuận được ký và lưu trữ.</p>",
//     "startDaysOffset": 3,
//     "durationDays": 1,
//     "level": "Compulsory",
//     "type": "AgreementSigned",
//     "appointments": [
//       {
//         "id": "d35ac685-e81a-4196-a30f-2955b4978754",
//         "title": "Ký thỏa thuận với đối tác - ",
//         "startDaysOffset": 1,
//         "durationHours": 3,
//         "description": "<ul>\r\n    <li><strong>Thời gian:</strong> [Ngày, Giờ]</li>\r\n    <li><strong>Địa điểm:</strong> [Địa chỉ công ty hoặc họp trực tuyến]</li>\r\n    <li><strong>Tài liệu cần chuẩn bị:</strong> Dự thảo thỏa thuận, tài liệu pháp lý.</li>\r\n    <li><strong>Mục đích:</strong> Xác nhận hợp tác và đồng ý các điều khoản.</li>\r\n</ul>",
//         "type": "WithAgency",
//         "workId": "fe18b609-cd62-42e2-8cd8-a8c0d358d9ec"
//       }
//     ]
//   }

const ViewTaskDetailByIdModal = ({ visible, onClose, setVisible }) => {
  const { taskDetailTemplate } = useSelector((state) => state.WorkTemplateReducer);
  const dispatch = useDispatch();
  const { setLoading } = useLoading();
  const [selectedAppointment, setSelectedAppointment] = useState({})
  const [isViewAppointmentModalVisible, setIsViewAppointmentModalVisible] = useState(false);
  const [isAddAppointmentModalVisible, setIsAddAppointmentModalVisible] = useState(false);
  const [isEditAppointmentModalVisible, setIsEditAppointmentModalVisible] = useState(false);

  const sanitizeHTML = (html) => {
      return {
      __html: DOMPurify.sanitize(html)
      };
  };

  //Điều khiển modal
  const showViewAppointmentDetailModal = (appointment) => {
    setIsViewAppointmentModalVisible(true);
    setSelectedAppointment(appointment)
    onClose();
  };

  const handleViewAppointmentDetailCancel = () => {
    setIsViewAppointmentModalVisible(false);
    setSelectedAppointment({})
    setVisible(true);
  };

  const showAddAppointmentModal = () => {
    setIsAddAppointmentModalVisible(true);
    onClose();
  };

  const handleAddAppointmentCancel = () => {
    setIsAddAppointmentModalVisible(false);
    setVisible(true);
  };

  const showEditAppointmentByIdModal = (appointment) => {
    setIsEditAppointmentModalVisible(true);
    setSelectedAppointment(appointment)
    onClose();
  };

  const handleEditAppointmentByIdCancel = () => {
    setIsEditAppointmentModalVisible(false);
    setSelectedAppointment({})
    setVisible(true);
  };
  //----------------------
  //hàm action
  const handleDeleteAppointment = (appointmentId) => {
    setLoading(true);
    dispatch(DeleteAppointmentTemplateByIdActionAsync(appointmentId, taskDetailTemplate.id)).finally(() => setLoading(false));
  };

  //----------------------

  const tabItems = [
    {
      key: '1',
      label: "Thông tin chung",
      children: (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Giai đoạn">
            <StyledTag color="blue">
              {taskTypeTranslations[taskDetailTemplate.type] || taskDetailTemplate.type || "Không xác định"}
            </StyledTag>
          </Descriptions.Item>
          <Descriptions.Item label="Mức độ ưu tiên">
            <LevelTag style={{ backgroundColor: getLevelStatusColor(taskDetailTemplate?.level) }}>
              {levelStatusTranslations[taskDetailTemplate.level] || taskDetailTemplate.level || 'Không xác định'.toUpperCase()}
            </LevelTag>
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian">
            <CalendarOutlined /> {taskDetailTemplate.startDaysOffset} ngày sau khi bắt đầu - Kéo dài {taskDetailTemplate.durationDays} ngày
          </Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: '2',
      label: "Mô tả",
      children: (
        <div>
          {taskDetailTemplate.description ? (
            <HTMLContent dangerouslySetInnerHTML={sanitizeHTML(taskDetailTemplate.description)} />
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
            <Button type="primary" icon={<PlusOutlined />} onClick={showAddAppointmentModal}>
                  Thêm cuộc họp
            </Button>
          </div>
          <List
            dataSource={taskDetailTemplate.appointments || []}
            renderItem={(appointment) => {
              return (
                <AppointmentItem style={{ cursor: "pointer" }} onClick={() => showViewAppointmentDetailModal(appointment)}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
                      <AppointmentTitle>
                        {appointment?.title || "Không có tiêu đề"}
                      </AppointmentTitle>
                      <Space>
                            <Tooltip title="Sửa">
                              <Button
                                type="text"
                                icon={<EditOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  showEditAppointmentByIdModal(appointment)
                                }}
                                size="small"
                              />
                            </Tooltip>
                            <Tooltip title="Xóa">
                              <Popconfirm
                                title="Bạn muốn xóa cuộc họp này?"
                                onConfirm={(e) => {
                                  e.stopPropagation();
                                  handleDeleteAppointment(appointment?.id);
                                }}
                                onCancel={(e) => e.stopPropagation()}
                              >
                                <Button
                                  type="text"
                                  icon={<DeleteOutlined />}
                                  danger
                                  onClick={(e) => e.stopPropagation()}
                                  size="small"
                                />
                              </Popconfirm>
                            </Tooltip>
                          </Space>
                    </Space>
                    <AppointmentTime>
                      <ClockCircleOutlined /> {appointment.startDaysOffset} ngày sau khi bắt đầu - Kéo dài {appointment.durationHours} giờ
                    </AppointmentTime>
                  </Space>
                </AppointmentItem>
              );
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <StyledModal
        title={<StyledTitle level={3}>{taskDetailTemplate.title}</StyledTitle>}
        open={visible}
        onCancel={onClose}
        footer={null}
        width={700}
      >
        <Tabs items={tabItems} />
      </StyledModal>

      <ViewAppointmentDetailTemplateById
        visible={isViewAppointmentModalVisible}
        onClose={handleViewAppointmentDetailCancel}
        appointmentDetail={selectedAppointment}
      />

      <CreateAppointmentTemplateModal
        visible={isAddAppointmentModalVisible}
        onClose={handleAddAppointmentCancel}
        workId={taskDetailTemplate.id}
      />

      <EditAppointmentTemplateModal
        visible={isEditAppointmentModalVisible}
        onClose={handleEditAppointmentByIdCancel}
        workId={taskDetailTemplate.id}
        appointment={selectedAppointment}
      />
    </>
  )
}

export default ViewTaskDetailByIdModal