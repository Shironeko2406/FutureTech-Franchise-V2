import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, List, Popconfirm, Row, Select, Spin, Typography } from "antd";
import { AppstoreAddOutlined, AreaChartOutlined, BuildOutlined, CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, DeleteOutlined, DollarOutlined, EditOutlined, FileDoneOutlined, FileSyncOutlined, FlagOutlined, PlusOutlined, RightCircleOutlined, SafetyCertificateOutlined, TeamOutlined,} from "@ant-design/icons";
import styled from "styled-components";
import { useLoading } from "../../../Utils/LoadingContext";
import { useDispatch, useSelector } from "react-redux";
import { DeleteTaskTemplateByIdActionAsync, GetTasksDetailByIdTemplateActionAsync, GetTasksTemplateActionAsync } from "../../../Redux/ReducerAPI/WorkTemplateReducer";
import ViewTaskDetailByIdModal from "../../Modal/ViewTaskDetalByIdModal";
import CreateTaskTemplateBySelectedTypeModal from "../../Modal/CreateTaskTemplateBySelectedTypeModal";
import EditTaskTemplateModal from "../../Modal/EditTaskTemplateModal";

const { Title, Text } = Typography;
const { Option } = Select;

// Styled components
const StyledCard = styled(Card)`
  .ant-card-head-title {
    text-align: center;
  }
`;

const MilestoneButton = styled(Button)`
  height: 120px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  border-radius: 8px;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  ${(props) =>
    props.selected &&
    `
    border-color: #1890ff;
    border-width: 2px;
    background-color: #e6f7ff;
  `}
`;

const ScrollableDiv = styled.div`
  height: 500px;
  overflow-y: auto;

  @media (max-width: 768px) {
    height: 300px;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

const StatusTag = styled.span`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: white;
`;

const CompulsoryTask = styled(List.Item)`
  background-color: #fff1f0 !important;
`;

const getIconForType = (type) => {
  const iconStyle = { fontSize: 30 };
  switch (type) {
    case "Interview":
      return <TeamOutlined style={iconStyle} />;
    case "AgreementSigned":
      return <FileDoneOutlined style={iconStyle} />;
    case "BusinessRegistered":
      return <AppstoreAddOutlined style={iconStyle} />;
    case "SiteSurvey":
      return <AreaChartOutlined style={iconStyle} />;
    case "Design":
      return <EditOutlined style={iconStyle} />;
    case "Quotation":
      return <DollarOutlined style={iconStyle} />;
    case "SignedContract":
      return <CheckCircleOutlined style={iconStyle} />;
    case "ConstructionAndTrainning":
      return <BuildOutlined style={iconStyle} />;
    case "Handover":
      return <FileSyncOutlined style={iconStyle} />;
    case "EducationLicenseRegistered":
      return <SafetyCertificateOutlined style={iconStyle} />;
    default:
      return null;
  }
};

const translateType = (type) => {
  const translations = {
    Interview: "Phỏng vấn",
    AgreementSigned: "Ký thỏa thuận 2 bên",
    BusinessRegistered: "Đăng ký doanh nghiệp",
    SiteSurvey: "Khảo sát mặt bằng",
    Design: "Thiết kế",
    Quotation: "Báo giá cho khách hàng",
    SignedContract: "Ký hợp đồng",
    ConstructionAndTrainning: "Đào tạo và thi công",
    Handover: "Bàn giao",
    EducationLicenseRegistered: "Đăng ký giấy phép giáo dục",
  };
  return translations[type] || type;
};


const WorkTemplate = () => {
  const { tasksTemplate } = useSelector((state) => state.WorkTemplateReducer);
  const dispatch = useDispatch()
  const { setLoading } = useLoading();
  const [selectedType, setSelectedType] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [modalShowTaskDetailVisible, setModalShowTaskDetailVisible] = useState(false);
  const [modalCreateTaskVisible, setModalCreateTaskVisible] = useState(false);
  const [modalEditTaskByIdVisible, setModalEditTaskByIdVisible] = useState(false);


  useEffect(() => {
    setLoadingTasks(true);
    dispatch(GetTasksTemplateActionAsync()).finally(() => setLoadingTasks(false));
  }, []);

  const taskDataModify = useMemo(() => {
    const allTypes = [
      'Interview',
      'AgreementSigned',
      'BusinessRegistered',
      'SiteSurvey',
      'Design',
      'Quotation',
      'SignedContract',
      'ConstructionAndTrainning',
      'Handover',
      'EducationLicenseRegistered'
    ];

    const initialStructure = allTypes.map(type => ({ type, tasks: [] }));

    return tasksTemplate.reduce((acc, task) => {
      const typeGroup = acc.find(group => group.type === task.type);
      if (typeGroup) {
        typeGroup.tasks.push(task);
      }
      return acc;
    }, initialStructure);
  }, [tasksTemplate]);

  const selectedTasks = useMemo(() => {
    if (!selectedType) return [];
    const selectedGroup = taskDataModify.find(group => group.type === selectedType);
    return selectedGroup ? selectedGroup.tasks : [];
  }, [selectedType, taskDataModify]);

  const filteredData = useMemo(() => {
    return taskDataModify.filter(group => {
      return !typeFilter || group.type === typeFilter;
    });
  }, [taskDataModify, typeFilter]);

  //Hàm đóng mở modal
  const showModalCreateTask = () => setModalCreateTaskVisible(true);
  const handleCloseModalCreateTask = () => setModalCreateTaskVisible(false);

  const openModalShowTaskDetail = (id) => {
    setModalShowTaskDetailVisible(true)
    dispatch(GetTasksDetailByIdTemplateActionAsync(id))
  };

  const handleCloseModalShowTaskDetail = () => {
    setModalShowTaskDetailVisible(false)
  };

  const openModalEditTask = (task) => {
    setModalEditTaskByIdVisible(true)
    setSelectedTask(task)
  };
  const handleCloseModalEditTask = () => {
    setModalEditTaskByIdVisible(false)
    setSelectedTask(null)
  };
  //-------------------
  //Hàm Action
  const handleDeleteTaskById = (id) => {
    setLoading(true)
    dispatch(DeleteTaskTemplateByIdActionAsync(id)).finally(() => setLoading(false))
  }

  //-----------------------------

  const renderMilestoneButton = (group, index) => {
    const icon = getIconForType(group.type);

    return (
      <MilestoneButton
        key={index}
        onClick={() => setSelectedType(group.type)}
        selected={selectedType === group.type}
      >
        {React.cloneElement(icon, { style: { fontSize: 30 } })}
        <Text strong style={{ textAlign: 'center', wordBreak: 'break-word' }}>
          {translateType(group.type)}
        </Text>
        <Text type="secondary">
          {group.tasks.length} {group.tasks.length === 1 ? 'công việc' : 'công việc'}
        </Text>
      </MilestoneButton>
    );
  };

  return (
    <StyledCard title={<Title level={4}><FlagOutlined /> Mẫu công việc cho nhượng quyền</Title>}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <div style={{ marginBottom: '16px' }}>
            <Select
              placeholder='Lọc tiến dộ'
              style={{ width: "100%" }}
              value={typeFilter}
              allowClear
              onChange={(value) => setTypeFilter(value)}
            >
              {taskDataModify.map((group) => (
                <Option key={group.type} value={group.type}>
                  {translateType(group.type)}
                </Option>
              ))}
            </Select>
          </div>
          <ScrollableDiv>
            {loadingTasks ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Spin size="large" />
              </div>
            ) : (
              filteredData.map((group, index) => renderMilestoneButton(group, index))
            )}
          </ScrollableDiv>
        </Col>
        
        <Col xs={24} md={16}>
          {selectedType ? (
            <StyledCard
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span>{translateType(selectedType)}</span>
                  <Button type="primary" icon={<PlusOutlined />} onClick={showModalCreateTask}>
                    Thêm công việc
                  </Button>
                </div>
              }
            >
              <ScrollableDiv>
                <List
                  dataSource={selectedTasks}
                  renderItem={task => (
                    <List.Item
                      style={{
                        backgroundColor: task.level === "Compulsory" ? "#fff1f0" : "#f0f5ff",
                        marginBottom: "8px",
                        borderRadius: "8px",
                        padding: "12px"
                      }}
                      key={task.id}
                      actions={[
                        <Button 
                          type="text" 
                          style={{ color: '#1890ff' }} 
                          icon={<RightCircleOutlined />} 
                          onClick={() => openModalShowTaskDetail(task.id)} 
                        />,
                        <Button 
                          type="text" 
                          icon={<EditOutlined />} 
                          onClick={() => openModalEditTask(task)} 
                        />,
                        <Popconfirm
                          title="Bạn muốn xóa công việc này?"
                          onConfirm={() => handleDeleteTaskById(task.id)}
                        >
                          <Button type="text" danger icon={<DeleteOutlined />} />
                        </Popconfirm>,
                      ]}
                    >
                      <List.Item.Meta
                        title={
                          <span>
                            {task.title}
                            {task.level === "Compulsory" && (
                              <>
                                <FlagOutlined style={{ color: '#ff4d4f', marginLeft: '8px' }} />
                                <Text type="danger" strong style={{ marginLeft: '4px' }}>
                                  (Bắt buộc)
                                </Text>
                              </>
                            )}
                          </span>
                        }
                        description={
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                              <CalendarOutlined style={{ marginRight: '4px' }} />
                              <Text type="secondary">
                                Bắt đầu sau: {task.startDaysOffset} ngày
                              </Text>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                              <ClockCircleOutlined style={{ marginRight: '4px' }} />
                              <Text type="secondary">
                                Thời gian hoàn thành: {task.durationDays} ngày
                              </Text>
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </ScrollableDiv>
            </StyledCard>
          ) : (
            <StyledCard>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '48px' }}>
                <Text type="secondary">Chọn một giai đoạn để xem và quản lý công việc</Text>
              </div>
            </StyledCard>
          )}
        </Col>
      </Row>

      <CreateTaskTemplateBySelectedTypeModal
        visible={modalCreateTaskVisible}
        onClose={handleCloseModalCreateTask}
        selectedType={selectedType}
      />

      <ViewTaskDetailByIdModal
        visible={modalShowTaskDetailVisible}
        onClose={handleCloseModalShowTaskDetail}
        setVisible={setModalShowTaskDetailVisible}
      />

      <EditTaskTemplateModal
        visible={modalEditTaskByIdVisible}
        onClose={handleCloseModalEditTask}
        task={selectedTask}
        selectedType={selectedType}
      />

    </StyledCard>
  );
};

export default WorkTemplate;

