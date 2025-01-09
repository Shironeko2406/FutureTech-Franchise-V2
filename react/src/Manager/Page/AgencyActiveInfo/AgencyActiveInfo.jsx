import React, { useEffect, useState } from "react";
import { ShopOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined, CheckCircleOutlined, ArrowLeftOutlined, ToolOutlined, FileTextOutlined, TeamOutlined, DollarOutlined, BarChartOutlined, MoneyCollectOutlined, RollbackOutlined, PieChartOutlined } from "@ant-design/icons";
import { Card, Typography, Descriptions, Tag, Space, Avatar, Row, Col, Button, DatePicker, Layout, Table, Statistic, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetAgencyDetailByIdActionAsync } from "../../../Redux/ReducerAPI/AgencyReducer";
import { FetchDashboardAgencyByIdAsync, FetchDashboardAgencyByIdCoursesAsync, ExportMonthlyFinancialReportAsync } from "../../../Redux/ReducerAPI/AgencyDashboardReducer";
import dayjs from "dayjs";

const { Title } = Typography;
const { MonthPicker } = DatePicker;
const { Content } = Layout;

const getDefaultDateRange = () => {
  const startOfMonth = dayjs().startOf('month');
  const endOfMonth = dayjs().endOf('month');
  return [startOfMonth, endOfMonth];
};

const translateStatus = (status) => {
  const statusTranslations = {
    Active: 'Hoạt động',
    Inactive: 'Không hoạt động',
    // Thêm các trạng thái khác nếu cần
  };

  return statusTranslations[status] || status;  // Trả về trạng thái đã dịch hoặc trả về chính trạng thái nếu không tìm thấy
};

const AgencyActiveInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { agencyDetail } = useSelector((state) => state.AgencyReducer);
  const { DashboardData } = useSelector((state) => state.AgencyDashboardReducer);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(dayjs()); // Set default to current month
  const [filterApplied, setFilterApplied] = useState(false);

  const fetchDataWithDateRange = (start, end) => {
    const formattedStartDate = start.format("MM/DD/YYYY");
    const formattedEndDate = end.format("MM/DD/YYYY");

    setLoading(true);
    dispatch(FetchDashboardAgencyByIdCoursesAsync(id, formattedStartDate, formattedEndDate)).finally(() => {
      setLoading(false);
      setFilterApplied(true);
    });
  };

  useEffect(() => {
    dispatch(GetAgencyDetailByIdActionAsync(id));
    const [defaultStart, defaultEnd] = getDefaultDateRange();
    setSelectedMonth(defaultStart);
    fetchDataWithDateRange(defaultStart, defaultEnd);

    const intervalId = setInterval(() => {
      const [newStart, newEnd] = getDefaultDateRange();
      if (!dayjs(selectedMonth).isSame(newStart, 'month')) {
        setSelectedMonth(newStart);
        fetchDataWithDateRange(newStart, newEnd);
      }
    }, 3600000); // 1 giờ

    return () => clearInterval(intervalId);
  }, [id]);

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
  };

  const handleFilter = () => {
    if (selectedMonth) {
      const startOfMonth = selectedMonth.startOf('month');
      const endOfMonth = selectedMonth.endOf('month');
      fetchDataWithDateRange(startOfMonth, endOfMonth);
    } else {
      message.error("Vui lòng chọn tháng!");
    }
  };

  const handleExportReport = async () => {
    if (selectedMonth) {
      const month = selectedMonth.month() + 1;
      const year = selectedMonth.year();
      setExportLoading(true);
      try {
        await dispatch(ExportMonthlyFinancialReportAsync(id, month, year));
      } finally {
        setExportLoading(false);
      }
    } else {
      message.error("Vui lòng chọn tháng!");
    }
  };

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
  ];

  const totalStudents = DashboardData.reduce((sum, course) => sum + course.studentCount, 0)
  const totalCourses = DashboardData.length
  const RevenueSummary = DashboardData.reduce((sum, course) => sum + course.totalRevenue, 0)
  const totalMonthlyFees = DashboardData.reduce((sum, course) => sum + course.monthlyFee, 0)
  const totalRefunds = DashboardData.reduce((sum, course) => sum + course.refunds, 0)
  const totalActualProfits = DashboardData.reduce((sum, course) => sum + course.actualProfits, 0)

  return (
    <Content className="p-6">
      <Card className="mb-6">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
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

          <Row gutter={[16, 16]}>
            <Col>
              <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/manager/agency-active")}>Trở lại</Button>
            </Col>
            {/* <Col>
              <Button icon={<FileTextOutlined />}>Hợp đồng</Button>
            </Col> */}
          </Row>
        </Space>
      </Card>

      <Card className="mb-6">
        <Space direction="vertical" size="middle" className="w-full">
          <Title level={4}>Kiểm tra thống kê</Title>
          <Space>
            <MonthPicker
              value={selectedMonth}
              onChange={handleMonthChange}
              format="MM/YYYY"
              className="w-64"
            />
            <Button type="primary" onClick={handleFilter} loading={loading}>
              Áp Dụng Bộ Lọc
            </Button>
            <Button type="default" onClick={handleExportReport} loading={exportLoading}>
              Xuất Báo Cáo
            </Button>
          </Space>
        </Space>
      </Card>

      {filterApplied && (
        <>
          <Row gutter={[16, 16]} className="mb-6">
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
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic
                  title="Tổng Phí Hàng Tháng"
                  value={totalMonthlyFees}
                  prefix={<MoneyCollectOutlined />}
                  suffix="VND"
                  groupSeparator=","
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic
                  title="Tổng Hoàn Tiền"
                  value={totalRefunds}
                  prefix={<RollbackOutlined />}
                  suffix="VND"
                  groupSeparator=","
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic
                  title="Tổng Lợi Nhuận Thực Tế Thu Được"
                  value={totalActualProfits}
                  prefix={<PieChartOutlined />}
                  suffix="VND"
                  groupSeparator=","
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

export default AgencyActiveInfo;



