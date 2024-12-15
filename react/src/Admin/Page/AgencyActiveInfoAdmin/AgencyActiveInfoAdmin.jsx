import React, { useEffect, useState } from "react";
import { ShopOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined, CheckCircleOutlined, ArrowLeftOutlined, ToolOutlined, FileTextOutlined, TeamOutlined, DollarOutlined, BarChartOutlined } from "@ant-design/icons";
import { Card, Typography, Descriptions, Tag, Space, Avatar, Row, Col, Button, DatePicker, Layout, Table, Statistic } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetAgencyDetailByIdActionAsync } from "../../../Redux/ReducerAPI/AgencyReducer";
import { FetchDashboardAgencyByIdAsync, FetchDashboardAgencyByIdCoursesAsync } from "../../../Redux/ReducerAPI/AgencyDashboardReducer";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker
const { Content } = Layout

const translateStatus = (status) => {
  const statusTranslations = {
    Active: 'Hoạt động',
    Inactive: 'Không hoạt động',
    // Thêm các trạng thái khác nếu cần
  };

  return statusTranslations[status] || status;  // Trả về trạng thái đã dịch hoặc trả về chính trạng thái nếu không tìm thấy
};

const AgencyActiveInfoAdmin = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()
  const { agencyDetail } = useSelector((state) => state.AgencyReducer);
  const { DashboardData, RevenueSummary } = useSelector((state) => state.AgencyDashboardReducer)
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState([null, null])
  const [filterApplied, setFilterApplied] = useState(false)

  useEffect(() => {
    dispatch(GetAgencyDetailByIdActionAsync(id))
  }, [id])

  const handleDateRangeChange = (dates) => {
    setDateRange(dates)
  }

  const handleFilter = () => {
    if (dateRange[0] && dateRange[1]) {
      const formattedStartDate = dayjs(dateRange[0]).format("MM/DD/YYYY")
      const formattedEndDate = dayjs(dateRange[1]).format("MM/DD/YYYY")

      setLoading(true)

      Promise.all([
        dispatch(FetchDashboardAgencyByIdCoursesAsync(id, formattedStartDate, formattedEndDate)),
        dispatch(FetchDashboardAgencyByIdAsync(id, formattedStartDate, formattedEndDate)),
      ]).finally(() => {
        setLoading(false)
        setFilterApplied(true)
      })
    } else {
      // Hiển thị thông báo lỗi nếu chưa chọn đầy đủ ngày
      console.log("Vui lòng chọn khoảng thời gian!")
    }
  }

  const columns = [
    {
      title: "Mã Khóa Học",
      dataIndex: "courseCode",
      key: "courseCode",
    },
    {
      title: "Tên Khóa Học",
      dataIndex: "courseName",
      key: "courseName",
    },
    {
      title: "Số Lượng Học Viên",
      dataIndex: "studentCount",
      key: "studentCount",
    },
    {
      title: "Doanh Thu",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      render: (revenue) => `${revenue.toLocaleString()} VND`,
    },
  ]

  const totalStudents = DashboardData.reduce((sum, course) => sum + course.studentCount, 0)
  const totalCourses = DashboardData.length


  return (
    <Content>
      <Card className="mb-6">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* <Row gutter={[16, 16]}>
            <Col>
              <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/agency-active")}>Trở lại</Button>
            </Col>
          </Row> */}
          <Row gutter={16} align="middle">
            <Col>
              <Avatar size={64} icon={<ShopOutlined />} />
            </Col>
            <Col>
              <Title level={3}>{agencyDetail.name || 'N/A'}</Title>
              {agencyDetail.status && (
                <Tag color="green" icon={<CheckCircleOutlined />}>
                  {translateStatus(agencyDetail.status)}
                </Tag>
              )}
            </Col>
          </Row>

          <Descriptions column={1} bordered>
            <Descriptions.Item label={<Space><EnvironmentOutlined /> Địa chỉ</Space>}>
              {agencyDetail.address && agencyDetail.ward && agencyDetail.district && agencyDetail.city
                ? `${agencyDetail.address}, ${agencyDetail.ward}, ${agencyDetail.district}, ${agencyDetail.city}`
                : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label={<Space><PhoneOutlined /> Số điện thoại</Space>}>
              {agencyDetail.phoneNumber || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label={<Space><MailOutlined /> Email</Space>}>
              {agencyDetail.email || 'N/A'}
            </Descriptions.Item>
          </Descriptions>
        </Space>
      </Card>

      <Card className="mb-6">
        <Space direction="vertical" size="middle" className="w-full">
          <Title level={4}>Kiểm tra thống kê</Title>
          <Space>
            <RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              format="DD/MM/YYYY"
              className="w-64"
            />
            <Button type="primary" onClick={handleFilter} loading={loading}>
              Áp Dụng Bộ Lọc
            </Button>
          </Space>
        </Space>
      </Card>

      {filterApplied && (
        <>
          <Row gutter={16} className="mb-6">
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic
                  title="Tổng Doanh Thu"
                  value={RevenueSummary}
                  prefix={<DollarOutlined />}
                  suffix="VND"
                  groupSeparator=","
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic
                  title="Tổng Số Khóa Học"
                  value={totalCourses}
                  prefix={<BarChartOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic
                  title="Tổng Số Học Viên"
                  value={totalStudents}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
          </Row>

          <Card title="Danh Sách Khóa Học" className="mb-6">
            <Table
              columns={columns}
              dataSource={DashboardData}
              rowKey="courseId"
              loading={loading}
              pagination={{ pageSize: 10 }}
              locale={{ emptyText: "Không có khóa học nào" }}
            />
          </Card>
        </>
      )}
    </Content>
  );
};

export default AgencyActiveInfoAdmin;

