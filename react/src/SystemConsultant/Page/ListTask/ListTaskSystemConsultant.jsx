import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, List, Typography, Button } from 'antd';
import { CalendarOutlined, RightCircleOutlined, CheckCircleFilled, CloseCircleFilled, MinusCircleFilled, FlagOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import moment from 'moment';
import DynamicFilter from '../../Component/DynamicFilter';
import { GetTaskUserByLoginActionAsync } from '../../../Redux/ReducerAPI/UserReducer';
import ViewTaskDetailModal from '../../../Manager/Modal/ViewTaskDetailModal';
import { GetTaskDetailByIdActionAsync } from '../../../Redux/ReducerAPI/WorkReducer';

const { Title, Text } = Typography;

const CompulsoryTask = styled(List.Item)`
  background-color: #fff1f0 !important;
`;

const StatusTag = styled.span`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: white;
`;

const getStatusIcon = (status) => {
  const iconStyle = { fontSize: 24, color: getStatusColor(status) };
  switch (status) {
    case "Approved": return <CheckCircleFilled style={iconStyle} />;
    case "Rejected": return <CloseCircleFilled style={iconStyle} />;
    case "None":
    default: return <MinusCircleFilled style={iconStyle} />;
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

const translateStatus = (status) => {
  const translations = {
    "Approved": "Đã duyệt",
    "Rejected": "Từ chối",
    "None": "Chưa xử lý",
  };
  return translations[status] || status;
};

const ListTaskSystemConsultant = () => {
  const { taskUser, totalPagesCount } = useSelector((state) => state.UserReducer);
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    searchText: '',
    levelFilter: '',
    statusFilter: '',
    submitFilter: '',
  });
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalShowTaskDetailVisible, setModalShowTaskDetailVisible] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [key]: value }));
    setPageIndex(1);
  };

  const handlePageChange = (page, pageSize) => {
    setPageIndex(page);
    setPageSize(pageSize);
  };

  useEffect(() => {
    dispatch(GetTaskUserByLoginActionAsync(
      filters.searchText,
      filters.levelFilter,
      filters.statusFilter,
      filters.submitFilter,
      pageIndex,
      pageSize
    ));
  }, [filters, pageIndex, pageSize, dispatch]);

  //Hàm đóng mở modal
  const openModalShowTaskDetail = (id) => {
    setModalShowTaskDetailVisible(true);
    dispatch(GetTaskDetailByIdActionAsync(id));
  };

  const handleCloseModalShowTaskDetail = () => {
    setModalShowTaskDetailVisible(false);
  };
  //-------------------------------

  const renderItem = (task) => {
    const TaskItem = task.level === "Compulsory" ? CompulsoryTask : List.Item;
    return (
      <TaskItem
        style={{
          backgroundColor: task.level === "Compulsory" ? "#fff1f0" : "#f0f5ff",
          marginBottom: "8px",
          borderRadius: "8px",
          padding: "12px",
        }}
        key={task.id}
        actions={[
          <Button
            type="text"
            style={{ color: "#1890ff" }}
            icon={<RightCircleOutlined />}
            onClick={() => openModalShowTaskDetail(task.id)}
          />,
        ]}
      >
        <List.Item.Meta
          avatar={getStatusIcon(task.status)}
          title={
            <span>
              {task.title}
              {task.level === "Compulsory" && (
                <>
                  <FlagOutlined
                    style={{ color: "#ff4d4f", marginLeft: "8px" }}
                  />
                  <Text type="danger" strong style={{ marginLeft: "4px" }}>
                    (Quan trọng)
                  </Text>
                </>
              )}
            </span>
          }
          description={
            <div>
              <StatusTag
                style={{
                  backgroundColor: getStatusColor(task.status),
                  marginBottom: "4px",
                }}
              >
                {translateStatus(task.status).toUpperCase()}
              </StatusTag>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "4px",
                }}
              >
                <CalendarOutlined style={{ marginRight: "4px" }} />
                <Text type="secondary">
                  {moment(task.startDate).format("DD/MM/YYYY HH:mm")} -{" "}
                  {moment(task.endDate).format("DD/MM/YYYY HH:mm")}
                </Text>
              </div>
            </div>
          }
        />
      </TaskItem>
    );
  };

  return (
    <Card>
      <Title level={4}>
        <CalendarOutlined /> Danh sách công việc
      </Title>
      <DynamicFilter onFilterChange={handleFilterChange} />
      <List
        dataSource={taskUser}
        renderItem={renderItem}
        pagination={{
          current: pageIndex,
          pageSize,
          total: totalPagesCount * pageSize,
          onChange: handlePageChange,
          showSizeChanger: true,
          pageSizeOptions: ['7', '10'],
        }}
        style={{ marginTop: '16px' }}
      />
      <ViewTaskDetailModal
        visible={modalShowTaskDetailVisible}
        onClose={handleCloseModalShowTaskDetail}
        setVisible={setModalShowTaskDetailVisible}
      />
    </Card>
  );
};

export default ListTaskSystemConsultant;


