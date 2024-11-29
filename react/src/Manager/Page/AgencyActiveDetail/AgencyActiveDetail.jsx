import { CalendarOutlined, CheckCircleFilled, CloseCircleFilled, DeleteOutlined, EditOutlined, EyeOutlined, FileOutlined, FlagOutlined, MinusCircleFilled, PlusOutlined, QuestionCircleOutlined, ReloadOutlined, RightCircleOutlined, SearchOutlined, ToolOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Button, Card, Col, Input, List, Popconfirm, Row, Select, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { DeleteTaskByIdForAfterFranchiseActionAsync, GetTaskAgencyActiveByIdActionAsync, GetTaskDetailByIdActionAsync } from '../../../Redux/ReducerAPI/WorkReducer';
import moment from 'moment';
import CreateTaskBySelectedTypeModalForAfterFranchise from '../../Modal/CreateTaskBySelectedTypeModalForAfterFranchise';
import { useLoading } from '../../../Utils/LoadingContext';
import EditTaskForAfterFranchiseModal from '../../Modal/EditTaskForAfterFranchiseModal';
import ViewTaskDetailForAfterFranchiseModal from '../../Modal/ViewTaskDetailForAfterFranchiseModal';
import { GetManagerUserAddAppointmentActionAsync } from '../../../Redux/ReducerAPI/UserReducer';

const { Title, Text } = Typography;
const { Option } = Select;

const StyledCard = styled(Card)`
  .ant-card-head-title {
    text-align: center;
  }
`;

const MilestoneButton = styled(Button)`
  height: 100px;
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

const CompulsoryTask = styled(List.Item)`
  background-color: #fff1f0 !important;
`;

// Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved": return '#52c41a';
      case "Rejected": return '#f5222d';
      case "None":
      default: return '#d9d9d9';
    }
  };
  
  const getSubmitColor = (submit) => {
    switch (submit) {
      case "Submited": return '#1890ff';
      case "None":
      default: return '#faad14';
    }
  };

  const getIconForType = (type) => {
    const iconStyle = { fontSize: 30};
    switch (type) {
      case "TrainningInternal": return <UserSwitchOutlined style={iconStyle} />;
      case "RepairingEquipment": return <ToolOutlined style={iconStyle} />;
      case "EducationalSupervision": return <EyeOutlined style={iconStyle} />;
      case "RenewContract": return <ReloadOutlined style={iconStyle} />;
      case "Other": return <QuestionCircleOutlined style={iconStyle} />;
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

  // New translation functions
const translateStatus = (status) => {
  const translations = {
    "Approved": "Đã duyệt",
    "Rejected": "Từ chối",
    "None": "Chưa xử lý",
  };
  return translations[status] || status;
};

const translateSubmit = (submit) => {
  const translations = {
    "Submited": "Đã nộp",
    "None": "Chưa nộp",
  };
  return translations[submit] || submit;
};

const translateType = (type) => {
  const translations = {
    "TrainningInternal": "Đào tạo định kỳ",
    "RepairingEquipment": "Sửa chữa thiết bị",
    "EducationalSupervision": "Giám sát hoạt động giáo dục",
    "RenewContract": "Gia hạn hợp đồng",
    "Other": "Khác"
  };
  return translations[type] || type;
};

const allTypes = ['TrainningInternal','RepairingEquipment','EducationalSupervision','RenewContract','Other',];

const AgencyActiveDetail = () => {
  const { tasksAgencyActive, totalPagesCount } = useSelector((state) => state.WorkReducer);
  const dispatch = useDispatch()
  const { id } = useParams()
  const { setLoading } = useLoading();
  const [typeSelectOptionFilter, setTypeSelectOptionFilter] = useState('all');
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [filters, setFilters] = useState({ //các param tôi truyền để call api
    searchText: null,
    levelFilter: null,
    statusFilter: null,
    submitFilter: null,
    typeFilter: 'TrainningInternal'
  })
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalCreateTaskVisible, setModalCreateTaskVisible] = useState(false);
  const [modalEditTaskByIdVisible, setModalEditTaskByIdVisible] = useState(false);
  const [modalShowTaskDetailVisible, setModalShowTaskDetailVisible] = useState(false);

  const filteredTypes = typeSelectOptionFilter === 'all' ? allTypes : [typeSelectOptionFilter];

  useEffect(() => {
    dispatch(GetTaskAgencyActiveByIdActionAsync(
        filters.searchText,
        filters.levelFilter,
        filters.statusFilter,
        filters.submitFilter,
        filters.typeFilter,
        id,
        pageIndex,
        pageSize
    ));
  }, [filters,id, pageIndex, pageSize, dispatch]);

  useEffect(() => {
    dispatch(GetManagerUserAddAppointmentActionAsync());
  }, [id]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPageIndex(1)
  };

  const handleMilestoneClick = (type) => {
    setFilters(prev => ({
      ...prev,
      typeFilter: type,
      searchText: null,
      levelFilter: null,
      statusFilter: null,
      submitFilter: null
    }));
    setPageIndex(1); // Reset page index to 1 when milestone changes
  };

  const handlePageChange = (page, pageSize) => {
    setPageIndex(page);
    setPageSize(pageSize);
  };

  const handleDeleteTaskById = (taskId) => {
    setLoading(true)
    dispatch(DeleteTaskByIdForAfterFranchiseActionAsync(taskId, id, filters, pageIndex, pageSize)).finally(() => setLoading(false))
  }

  // Các hàm đóng mở state modal
  const showModalCreateTask = () => setModalCreateTaskVisible(true);
  const handleCloseModalCreateTask = () => setModalCreateTaskVisible(false);

  const openModalEditTask = (task) => {
    setModalEditTaskByIdVisible(true)
    setSelectedTask(task)
  };
  const handleCloseModalEditTask = () => {
    setModalEditTaskByIdVisible(false)
    setSelectedTask(null)
  };

  const openModalShowTaskDetail = (id) => {
    setModalShowTaskDetailVisible(true)
    dispatch(GetTaskDetailByIdActionAsync(id))
  };

  const handleCloseModalShowTaskDetail = () => {
    setModalShowTaskDetailVisible(false)
  };
  //--------------------------------

  const renderMilestoneButton = (type) => {
    const icon = getIconForType(type);

    return (
      <MilestoneButton
        key={type}
        onClick={() => handleMilestoneClick(type)}
        selected={filters.typeFilter === type}
      >
        {React.cloneElement(icon, { style: { fontSize: 30 } })}
        <Text strong style={{ textAlign: 'center', wordBreak: 'break-word' }}>{translateType(type)}</Text>
      </MilestoneButton>
    );
  };


  return (
    <StyledCard title={<Title level={4}><FlagOutlined /> Quản lý công việc chi nhánh</Title>}>
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Card>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Tìm kiếm công việc" 
                  allowClear 
                  value={filters.searchText}
                  onChange={(e) => handleFilterChange('searchText', e.target.value)}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Mức độ"
                  allowClear
                  value={filters.levelFilter}
                  onChange={(value) => handleFilterChange('levelFilter', value)}
                >
                  <Option value="Compulsory">Bắt buộc</Option>
                  <Option value="Optional">Không bắt buộc</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Trạng thái"
                  allowClear
                  value={filters.statusFilter}
                  onChange={(value) => handleFilterChange('statusFilter', value)}
                >
                  <Option value="None">Chưa xử lý</Option>
                  <Option value="Approved">Đã duyệt</Option>
                  <Option value="Rejected">Từ chối</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Trạng thái nộp"
                  allowClear
                  value={filters.submitFilter}
                  onChange={(value) => handleFilterChange('submitFilter', value)}
                >
                  <Option value="None">Chưa nộp</Option>
                  <Option value="Submited">Đã nộp</Option>
                </Select>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Select
            style={{ width: "100%", marginBottom: '16px' }}
            value={typeSelectOptionFilter}
            onChange={(value) => setTypeSelectOptionFilter(value)}
          >
            <Option key="all" value="all">Tất cả</Option>
            {allTypes.map((type) => (
              <Option key={type} value={type}>{translateType(type)}</Option>
            ))}
          </Select>
          <ScrollableDiv>
            {filteredTypes.map((type) => renderMilestoneButton(type))}
          </ScrollableDiv>
        </Col>
        <Col xs={24} md={16}>
          <StyledCard
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <span>{translateType(filters.typeFilter)}</span>
                <Button type="primary" icon={<PlusOutlined />} onClick={showModalCreateTask}>
                  Thêm công việc
                </Button>
              </div>
            }
          >
            <ScrollableDiv>
              <List
                dataSource={tasksAgencyActive}
                renderItem={task => {
                  const TaskItem = task.level === "Compulsory" ? CompulsoryTask : List.Item;
                  return (
                    <TaskItem
                      style={{
                        backgroundColor: task.level === "Compulsory" ? "#fff1f0" : "#f0f5ff",
                        marginBottom: "8px",
                        borderRadius: "8px",
                        padding: "12px"
                      }}
                      key={task.id}
                      actions={[
                        <Button type="text" style={{ color: '#1890ff' }} icon={<RightCircleOutlined />} onClick={() => { openModalShowTaskDetail(task.id) }} />,

                        task?.status === 'None' && (
                          <Button type="text" icon={<EditOutlined />} onClick={() => { openModalEditTask(task) }} />
                        ),

                        task?.status === 'None' && (
                          <Popconfirm
                            title="Bạn muốn xóa công việc này?"
                            onConfirm={() => handleDeleteTaskById(task.id)}
                          >
                            <Button type="text" danger icon={<DeleteOutlined />} />
                          </Popconfirm>
                        ),
                      ].filter(Boolean)}
                    >
                      <List.Item.Meta
                        avatar={getStatusIcon(task.status)}
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
                            <div style={{ marginBottom: "4px" }}>
                              <StatusTag style={{ backgroundColor: getStatusColor(task.status), marginBottom: '4px' }} className='me-2'>
                                {translateStatus(task.status).toUpperCase()}
                              </StatusTag>
                              <StatusTag style={{ backgroundColor: getSubmitColor(task.submit), }}>
                                <FileOutlined style={{ marginRight: "4px" }} />
                                {translateSubmit(task.submit).toUpperCase()}
                              </StatusTag>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                              <CalendarOutlined style={{ marginRight: '4px' }} />
                              <Text type="secondary">
                                {moment(task.startDate).format('DD/MM/YYYY HH:mm')} - {moment(task.endDate).format('DD/MM/YYYY HH:mm')}
                              </Text>
                            </div>
                          </div>
                        }
                      />
                    </TaskItem>
                  );
                }}
                pagination={{
                  current: pageIndex,
                  pageSize,
                  total: totalPagesCount * pageSize,
                  onChange: handlePageChange,
                  showSizeChanger: true,
                  pageSizeOptions: ['7', '10'],
                }}
              />
            </ScrollableDiv>
          </StyledCard>
        </Col>
      </Row>

      {/*Các Modal*/}
      <ViewTaskDetailForAfterFranchiseModal
        visible={modalShowTaskDetailVisible}
        onClose={handleCloseModalShowTaskDetail}
        setVisible={setModalShowTaskDetailVisible}
        isFromAgencyDetail={true}
        filter={filters}
        pageIndex={pageIndex}
        pageSize={pageSize}
      />

      <CreateTaskBySelectedTypeModalForAfterFranchise
        visible={modalCreateTaskVisible}
        onClose={handleCloseModalCreateTask}
        selectedType={filters.typeFilter}
        filter={filters}
        pageIndex={pageIndex}
        pageSize={pageSize}
      />

      <EditTaskForAfterFranchiseModal
        visible={modalEditTaskByIdVisible}
        onClose={handleCloseModalEditTask}
        task={selectedTask}
        filter={filters}
        pageIndex={pageIndex}
        pageSize={pageSize}
      />

    </StyledCard>
  )
}

export default AgencyActiveDetail