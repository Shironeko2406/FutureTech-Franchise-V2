import {
  BookOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  TagOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Col, Popover, Row, Table, Tag, Tooltip, Typography } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { GetClassDetailActionAsync } from "../../../Redux/ReducerAPI/ClassReducer";

const { Title } = Typography;

const ClassDetailInstructor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { classDetail } = useSelector((state) => state.ClassReducer);

  useEffect(() => {
    dispatch(GetClassDetailActionAsync(id));
  }, [id]);

  const translateDayOfWeek = (daysString) => {
    const days = {
        "Monday": "Thứ Hai",
        "Tuesday": "Thứ Ba",
        "Wednesday": "Thứ Tư",
        "Thursday": "Thứ Năm",
        "Friday": "Thứ Sáu",
        "Saturday": "Thứ Bảy",
        "Sunday": "Chủ Nhật"
    };
    return daysString.split(' ').filter(day => day).map(day => days[day] || day).join(', ');
};

const columns = [
    {
        title: 'Hình đại diện',
        dataIndex: 'urlImage',
        key: 'urlImage',
        width: '130px',
        align: 'center',
        render: (text) => (
            <div className="flex justify-center">
                <Avatar
                    size={45}
                    src={text}
                    icon={<UserOutlined />}
                    style={{
                        backgroundColor: '#1890ff',
                        border: '2px solid #e6f7ff'
                    }}
                />
            </div>
        ),
    },
    {
        title: 'Tên Học Viên',
        dataIndex: 'studentName',
        key: 'studentName',
        render: (text) => (
            <span style={{ fontWeight: '500', color: '#262626' }}>{text}</span>
        ),
    },
    {
        title: 'Ngày Sinh',
        dataIndex: 'dateOfBirth',
        key: 'dateOfBirth',
        render: (text) => (
            <Tag
                color="blue"
                style={{
                    padding: '4px 12px',
                    fontSize: '14px',
                    borderRadius: '6px'
                }}
            >
                {classDetail.studentInfo.dateOfBirth ? new Date(text).toLocaleDateString() : "N/A"}
            </Tag>
        ),
    },
    {
        title: 'Tên Đăng Nhập',
        dataIndex: 'userName',
        key: 'userName',
        render: (text) => (
            <Tag
                color="cyan"
                style={{
                    padding: '4px 12px',
                    fontSize: '14px',
                    borderRadius: '6px'
                }}
            >
                {text}
            </Tag>
        ),
    },
];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        style={{
          borderRadius: "15px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Row justify="center" align="middle" gutter={[0, 24]}>
          <Col span={24}>
            <Title
              level={2}
              style={{
                color: "#1890ff",
                textAlign: "center",
                margin: "0 32px",
                background: "linear-gradient(to right, #1890ff, #69c0ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {classDetail.className}
            </Title>
          </Col>

          <Col span={24}>
            <Card
              type="inner"
              style={{
                borderRadius: "12px",
                background: "#f8f9fa",
                border: "1px solid #e8e8e8",
              }}
            >
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={12}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <BookOutlined
                      style={{ color: "#1890ff", fontSize: "20px" }}
                    />
                    <div>
                      <div style={{ color: "#8c8c8c", fontSize: "14px" }}>
                        Tên Khóa Học
                      </div>
                      <div style={{ fontWeight: "500", fontSize: "16px" }}>
                        {classDetail.courseName}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <TagOutlined
                      style={{ color: "#1890ff", fontSize: "20px" }}
                    />
                    <div>
                      <div style={{ color: "#8c8c8c", fontSize: "14px" }}>
                        Mã Khóa Học
                      </div>
                      <div style={{ fontWeight: "500", fontSize: "16px" }}>
                        {classDetail.courseCode}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <UserOutlined
                      style={{ color: "#1890ff", fontSize: "20px" }}
                    />
                    <div>
                      <div style={{ color: "#8c8c8c", fontSize: "14px" }}>
                        Giảng Viên
                      </div>
                      <div style={{ fontWeight: "500", fontSize: "16px" }}>
                        {classDetail.instructorName}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <TeamOutlined
                      style={{ color: "#1890ff", fontSize: "20px" }}
                    />
                    <div>
                      <div style={{ color: "#8c8c8c", fontSize: "14px" }}>
                        Sức chứa
                      </div>
                      <div style={{ fontWeight: "500", fontSize: "16px" }}>
                        <Tag color="blue">
                          {classDetail.currentEnrollment}/{classDetail.capacity}
                        </Tag>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
                <Col span={24}>
                    <Card
                        title={
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CalendarOutlined style={{ color: '#1890ff' }} />
                                    <span>Lịch Học</span>
                                </div>
                        }
                        style={{
                            borderRadius: '15px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }}
                    >
                        <Row gutter={[16, 16]} align="middle">
                            <Col xs={24} sm={12}>
                                <Tag color="purple" style={{ padding: '8px 16px', fontSize: '14px' }}>
                                    <CalendarOutlined style={{ marginRight: '8px' }} />
                                    {classDetail.slotViewModels ? translateDayOfWeek(classDetail.dayOfWeek) : 'N/A'}
                                </Tag>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Tag color="cyan" style={{ padding: '8px 16px', fontSize: '14px' }}>
                                    <ClockCircleOutlined style={{ marginRight: '8px' }} />
                                    {classDetail?.slotViewModels
                                        ? `${classDetail.slotViewModels.startTime} - ${classDetail.slotViewModels.endTime}`
                                        : 'N/A'}
                                </Tag>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col span={24}>
                    <Card
                        title={
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <TeamOutlined style={{ color: '#1890ff' }} />
                                    <span>Danh Sách Học Viên</span>
                                </div>
                                {/* <Tooltip title="Chỉnh sửa danh sách học viên">
                                    <Button
                                        type="text"
                                        icon={<EditOutlined />}
                                        onClick={() => handleEdit('students')}
                                        style={{
                                            color: '#1890ff',
                                            width: '32px',
                                            height: '32px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: 'none',
                                            padding: 0
                                        }}
                                    />
                                </Tooltip> */}
                            </div>
                        }
                        style={{
                            borderRadius: '15px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }}
                    >
                        <Table
                            bordered
                            dataSource={classDetail.studentInfo}
                            columns={columns}
                            rowKey="userId"
                            pagination={{
                                pageSize: 5,
                                showTotal: (total) => `Tổng số ${total} học viên`
                            }}
                            style={{
                                borderRadius: '12px',
                                border: '1px solid #e8e8e8'
                            }}
                        />
                    </Card>
                </Col>
            </Row>
    </div>
  );
};

export default ClassDetailInstructor;
