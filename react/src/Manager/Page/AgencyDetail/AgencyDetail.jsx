import React, { useState, useMemo, useEffect } from 'react';
import { Button, Card, Input, Select, List, Typography, Row, Col } from 'antd';
import {
  CheckCircleFilled, MinusCircleFilled, PlusOutlined,
  DeleteOutlined, SearchOutlined, FlagOutlined, TeamOutlined, FileDoneOutlined,
  AppstoreAddOutlined, AreaChartOutlined, EditOutlined, CheckCircleOutlined,
  DollarOutlined, CloseCircleFilled, RightCircleOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GetTaskByAgencyIdActionAsync } from '../../../Redux/ReducerAPI/AgencyReducer';
import CreateTaskBySelectedTypeModal from '../../Modal/CreateTaskBySelectedTypeModal';
import ViewTaskDetailModal from '../../Modal/ViewTaskDetailModal';
import { GetTaskDetailByIdActionAsync } from '../../../Redux/ReducerAPI/WorkReducer';

const { Title, Text } = Typography;
const { Option } = Select;

// Styled components
const StyledCard = styled(Card)`
  .ant-card-head-title {
    text-align: center;
  }
`;

const MilestoneButton = styled(Button)`
  height: 140px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  border-radius: 8px;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }

  ${props => props.selected && `
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

// Helper functions
const getTypeStatusColor = (status) => {
  switch (status) {
    case "Completed": return '#52c41a';
    case "In Progress": return '#faad14';
    case "Pending":
    default: return '#d9d9d9';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "Approved": return '#52c41a';
    case "Rejected": return '#f5222d';
    case "None":
    default: return '#d9d9d9';
  }
};

const getIconForTypeStatus = (status) => {
  const iconStyle = { fontSize: 30, color: getTypeStatusColor(status) };
  switch (status) {
    case "Interview": return <TeamOutlined style={iconStyle} />;
    case "AgreementSigned": return <FileDoneOutlined style={iconStyle} />;
    case "BusinessRegistered": return <AppstoreAddOutlined style={iconStyle} />;
    case "SiteSurvey": return <AreaChartOutlined style={iconStyle} />;
    case "Design": return <EditOutlined style={iconStyle} />;
    case "Quotation": return <DollarOutlined style={iconStyle} />;
    case "SignedContract": return <CheckCircleOutlined style={iconStyle} />;
    default: return null;
  }
};

const getStatusIcon = (status) => {
  const iconStyle = { fontSize: 24, color: getStatusColor(status) };
  switch (status) {
    case "Approved": return <CheckCircleFilled style={iconStyle} />;
    case "Rejected": return <CloseCircleFilled style={iconStyle} />;
    case "None":
    default: return <MinusCircleFilled style={iconStyle} />;
  }
};

const getTypeStatus = (type, tasks) => {
  const statuses = tasks.filter(task => task.type === type).map(task => task.status);
  if (statuses.every(status => status === "None")) return "Pending";
  if (statuses.every(status => status === "Approved" || status === "Rejected")) return "Completed";
  if (statuses.includes("None")) return "In Progress";
  return "Pending";
};

// New translation functions
const translateStatus = (status) => {
  const translations = {
    "Approved": "Đã duyệt",
    "Rejected": "Từ chối",
    "None": "Chưa xử lý",
    "Completed": "Hoàn thành",
    "In Progress": "Đang thực hiện",
    "Pending": "Chờ xử lý"
  };
  return translations[status] || status;
};

const translateType = (type) => {
  const translations = {
    "Interview": "Phỏng vấn",
    "AgreementSigned": "Ký thỏa thuận 2 bên",
    "BusinessRegistered": "Đăng ký doanh nghiệp",
    "SiteSurvey": "Khảo sát mặt bằng",
    "Design": "Thiết kế",
    "Quotation": "Báo giá cho khách hàng",
    "SignedContract": "Ký hợp đồng thành công"
  };
  return translations[type] || type;
};

// Updated component
export default function AgencyDetail() {
  const { tasks } = useSelector((state) => state.AgencyReducer);
  const dispatch = useDispatch()
  const {id} = useParams()
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [modalCreateTaskVisible, setModalCreateTaskVisible] = useState(false);
  const [modalShowTaskDetailVisible, setModalShowTaskDetailVisible] = useState(false);

  useEffect(() => {
    dispatch(GetTaskByAgencyIdActionAsync(id))
  }, [id, dispatch])

  const taskDataModify = useMemo(() => {
    const allTypes = [
      'Interview',
      'AgreementSigned',
      'BusinessRegistered',
      'SiteSurvey',
      'Design',
      'Quotation',
      'SignedContract'
    ];

    const initialStructure = allTypes.map(type => ({ type, tasks: [] }));

    return tasks.reduce((acc, task) => {
      const typeGroup = acc.find(group => group.type === task.type);
      if (typeGroup) {
        typeGroup.tasks.push(task);
      }
      return acc;
    }, initialStructure);
  }, [tasks]);
  console.log(taskDataModify)

  const selectedTasks = useMemo(() => {
    if (!selectedType) return [];
    const selectedGroup = taskDataModify.find(group => group.type === selectedType);
    return selectedGroup ? selectedGroup.tasks : [];
  }, [selectedType, taskDataModify]);

  const filteredData = useMemo(() => {
    return taskDataModify.filter(group => {
      const isTypeMatch = typeFilter === "all" || group.type === typeFilter;
      const isSearchMatch = translateType(group.type).toLowerCase().includes(searchTerm.toLowerCase());
      return isTypeMatch && isSearchMatch;
    });
  }, [taskDataModify, typeFilter, searchTerm]);

  const renderMilestoneButton = (group, index) => {
    const status = getTypeStatus(group.type, group.tasks);
    const statusColor = getTypeStatusColor(status);
    const icon = getIconForTypeStatus(group.type);

    return (
      <MilestoneButton
        key={index}
        onClick={() => setSelectedType(group.type)}
        selected={selectedType === group.type}
      >
        {React.cloneElement(icon, { style: { fontSize: 30, color: statusColor } })}
        <Text strong style={{ textAlign: 'center', wordBreak: 'break-word' }}>{translateType(group.type)}</Text>
        <Text type="secondary">{group.tasks.length} {group.tasks.length === 1 ? 'công việc' : 'công việc'}</Text>
        <StatusTag style={{ backgroundColor: statusColor }}>{translateStatus(status).toUpperCase()}</StatusTag>
      </MilestoneButton>
    );
  };

  // Các hàm đóng mở state modal
  const showModalCreateTask = () => setModalCreateTaskVisible(true);
  const handleCloseModalCreateTask = () => setModalCreateTaskVisible(false);

  const openModalShowTaskDetail = (id) => {
    setModalShowTaskDetailVisible(true)
    dispatch(GetTaskDetailByIdActionAsync(id))
  };
  const handleCloseModalShowTaskDetail = () => {
    setModalShowTaskDetailVisible(false)
  };

  return (
    <StyledCard title={<Title level={4}><FlagOutlined /> Tiến trình nhượng quyền</Title>}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <div style={{ marginBottom: '16px' }}>
            <Input
              placeholder="Tìm kiếm giai đoạn..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: '8px' }}
            />
            <Select
              style={{ width: "100%" }}
              value={typeFilter}
              onChange={(value) => setTypeFilter(value)}
            >
              <Option key="all" value="all">Tất cả</Option>
              {taskDataModify.map((group) => (
                <Option key={group.type} value={group.type}>{translateType(group.type)}</Option>
              ))}
            </Select>
          </div>
          <ScrollableDiv>
            {filteredData.map((group, index) => renderMilestoneButton(group, index))}
          </ScrollableDiv>
        </Col>
        
        <Col xs={24} md={16}>
          {selectedType ? (
            <StyledCard
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span>{translateType(selectedType)}</span>
                  <Button type="primary" icon={<PlusOutlined />} onClick={showModalCreateTask}>Thêm công việc</Button>
                </div>
              }
            >
              <ScrollableDiv>
                <List
                  dataSource={selectedTasks}
                  renderItem={task => (
                    <List.Item
                      style={{backgroundColor: "#f0f5ff", marginBottom: "8px", borderRadius: "8px", padding: "12px"}}
                      key={task.id}
                      actions={[
                        <Button
                          type="link"
                          onClick={() => {openModalShowTaskDetail(task.id)}}
                          style={{ gap: "4px", padding: "4px 8px", fontSize: "14px"}}
                        >
                          <Text strong style={{ marginRight: "4px" }}>Chi tiết</Text>
                          <RightCircleOutlined style={{ fontSize: "16px" }} />
                        </Button>,
                        <Button type="text" danger icon={<DeleteOutlined />} />
                      ]}
                    >
                      <List.Item.Meta
                        avatar={getStatusIcon(task.status)}
                        title={task.title}
                        description={
                          <StatusTag style={{ backgroundColor: getStatusColor(task.status) }}>
                            {translateStatus(task.status).toUpperCase()}
                          </StatusTag>
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

      {/*Các Modal*/}
      <CreateTaskBySelectedTypeModal
        visible={modalCreateTaskVisible}
        onClose={handleCloseModalCreateTask}
        selectedType={selectedType}
      />

      <ViewTaskDetailModal
        visible={modalShowTaskDetailVisible}
        onClose={(handleCloseModalShowTaskDetail)}
        setVisible={setModalShowTaskDetailVisible}
      />

    </StyledCard>
  );
}