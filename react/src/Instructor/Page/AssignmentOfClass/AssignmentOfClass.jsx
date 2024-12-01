import React, { useEffect, useState } from 'react';
import { Button, Space, Table, Tag, Card, Typography, Tooltip, Popconfirm } from 'antd';
import { RocketOutlined, EditOutlined, DeleteOutlined, CalendarOutlined, RightCircleOutlined } from '@ant-design/icons';
import CreateAssignmentModal from '../../Modal/CreateAssignmentModal';
import ShowListSubmitAssignmentAndScores from '../../Modal/ShowListSubmitAssignmentAndScores';
import { useLoading } from '../../../Utils/LoadingContext';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteAssignmentActionAsync, GetAssignmentsByClassIdActionAsync } from '../../../Redux/ReducerAPI/AssignmentReducer';
import { useParams } from 'react-router-dom';
import EditAssignmentModal from '../../Modal/EditAssignmentModal';
import moment from 'moment';

const { Title , Text} = Typography;

const AssignmentOfClass = () => {
  const { assignments } = useSelector((state) => state.AssignmentReducer);
  const dispatch = useDispatch()
  const {id} = useParams()
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewDetailSubmitAssignmentModalVisible, setIsViewDetailSubmitAssignmentModalModalVisible] = useState(false);
  const [isModalEditVisible, setIsModalEditVisible] = useState(false);
  const [assignmentSelected, setAssignmentSelected] = useState({});
  const [selectedAssignmentEdit, setSelectedAssignmentEdit] = useState(null);
  const {setLoading} = useLoading()

  useEffect(() => {
    setLoading(true);
    dispatch(GetAssignmentsByClassIdActionAsync(id)).finally(() => setLoading(false));
  }, [id]);

  const showModalCreateAssignment = () => setIsModalVisible(true);
  const handleCloseModalCreateAssignment = () => setIsModalVisible(false);

  const showModalViewDetailSubmitAssignment = (ass) => {
    setIsViewDetailSubmitAssignmentModalModalVisible(true);
    setAssignmentSelected(ass)
  }
  const handleCloseModalViewDetailSubmitAssignment = () => {
    setIsViewDetailSubmitAssignmentModalModalVisible(false);
  }

  const showModalEditAssignment = (assignment) => {
    setIsModalEditVisible(true);
    setSelectedAssignmentEdit(assignment)
  };

  const handleCloseModalEditAssignment = () => {
    setIsModalEditVisible(false);
    setSelectedAssignmentEdit(null)
  };

  const handleDelete = async (assId) => {
    setLoading(true);
    try {
      await dispatch(DeleteAssignmentActionAsync(assId, id));
    } finally {
      setLoading(false);
    }
  };

  const renderStatusBadge = (startTime, endTime) => {
    const now = moment();
    const quizStartTime = moment(startTime);
    const quizEndTime = moment(endTime);
  
    // Determine the status
    let status;
    if (now.isBefore(quizStartTime)) {
      status = "NotOpen"; // Chưa mở
    } else if (now.isBetween(quizStartTime, quizEndTime, "seconds", "[)")) {
      status = "Open"; // Đang mở
    } else {
      status = "Closed"; // Đã đóng
    }
  
    // Define configuration for each status
    const statusConfig = {
      NotOpen: {
        text: "Chưa mở",
        color: "gray",
        backgroundColor: "#f0f0f0",
        borderColor: "#d9d9d9",
      },
      Open: {
        text: "Đang mở",
        color: "green",
        backgroundColor: "#f6ffed",
        borderColor: "#b7eb8f",
      },
      Closed: {
        text: "Đã đóng",
        color: "red",
        backgroundColor: "#fff2f0",
        borderColor: "#ffa39e",
      },
    };
  
    const config = statusConfig[status];
  
    return (
      <div
        style={{
          display: "inline-block",
          padding: "4px 12px",
          borderRadius: "6px",
          backgroundColor: config.backgroundColor,
          border: `1px solid ${config.borderColor}`,
        }}
      >
        <Text strong style={{ color: config.color }}>
          {config.text}
        </Text>
      </div>
    );
  };
  
  

  // const assignments = [
  //   {
  //     id: "fb501b04-f6d2-4f8a-941c-08dd0245ef65",
  //     title: "Bài tập 1",
  //     description: "Mô tả chi tiết về bài tập 1",
  //     startTime: "2024-11-11T18:00:00",
  //     endTime: "2024-11-13T00:00:00",
  //     status: "Open",
  //   },
  //   {
  //     id: "fb501b04-f6d2-4f8a-941c-08dd0245ef66",
  //     title: "Bài tập 2",
  //     description: "Mô tả chi tiết về bài tập 2",
  //     startTime: "2024-11-14T09:00:00",
  //     endTime: "2024-11-16T23:59:59",
  //     status: "Closed",
  //   },
  // ];

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => showModalViewDetailSubmitAssignment(record)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "4px 8px",
            height: "auto",
            fontSize: "14px",
            transition: "all 0.3s ease",
          }}
          className="hover:bg-blue-50"
        >
          <Text strong style={{ marginRight: "4px" }}>
            {text}
          </Text>
          <RightCircleOutlined style={{ fontSize: "16px" }} />
        </Button>
      ),
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (text) => (
        <Tooltip title={new Date(text).toLocaleString('vi-VN')}>
          <span>{new Date(text).toLocaleDateString('vi-VN')}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (text) => (
        <Tooltip title={new Date(text).toLocaleString('vi-VN')}>
          <span>{new Date(text).toLocaleDateString('vi-VN')}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => renderStatusBadge(record.startTime, record.endTime),
      filters: [
        { text: 'Chưa mở', value: 'NotOpen' },
        { text: 'Đang mở', value: 'Open' },
        { text: 'Đã đóng', value: 'Closed' },
      ],
      onFilter: (value, record) => {
        const now = moment();
        const quizStartTime = moment(record.startTime);
        const quizEndTime = moment(record.endTime);
    
        let status;
        if (now.isBefore(quizStartTime)) {
          status = "NotOpen";
        } else if (now.isBetween(quizStartTime, quizEndTime, "seconds", "[)")) {
          status = "Open";
        } else {
          status = "Closed";
        }
    
        return status === value;
      },
    },    
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => showModalEditAssignment(record)}/>
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn muốn xóa bài tập này?"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button type="primary" danger icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card className="assignment-card">
      <Title level={4}>
        <CalendarOutlined /> Danh Sách Bài Tập
      </Title>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<RocketOutlined />}
          onClick={showModalCreateAssignment}
        >
          Thêm bài tập
        </Button>
      </Space>
      <Table 
        bordered
        className="assignment-table"
        columns={columns} 
        dataSource={assignments} 
        rowKey="id"
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng ${total} bài tập`,
        }}
      />
      <CreateAssignmentModal
        visible={isModalVisible}
        onClose={handleCloseModalCreateAssignment}
      />

      <ShowListSubmitAssignmentAndScores
        visible={isViewDetailSubmitAssignmentModalVisible}
        onClose={handleCloseModalViewDetailSubmitAssignment}
        assignment={assignmentSelected}
      />

      <EditAssignmentModal
          visible={isModalEditVisible}
          onClose={handleCloseModalEditAssignment}
          assignment={selectedAssignmentEdit}
        />
    </Card>
  );
};

export default AssignmentOfClass;
