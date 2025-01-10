'use client'

import { useEffect, useState } from "react"
import { Table, DatePicker, Button, Card, Row, Col, Statistic, Typography, Layout, Space, message } from "antd"
import { useDispatch, useSelector } from "react-redux"
import { FetchDashboardAgencyCoursesAsync, ExportMonthlyFinancialReportAsync } from "../../../Redux/ReducerAPI/AgencyDashboardReducer"
import dayjs from "dayjs"
import { BarChartOutlined, DollarOutlined, TeamOutlined, MoneyCollectOutlined, RollbackOutlined, PieChartOutlined } from "@ant-design/icons"

const { Title } = Typography
const { Content } = Layout
const { MonthPicker } = DatePicker

const StatisticCard = ({ title, value, prefix, suffix }) => (
  <Card hoverable className="h-full">
    <Statistic
      title={title}
      value={value}
      prefix={prefix}
      suffix={suffix}
      groupSeparator=","
    />
  </Card>
)

export default function AgencyDashboardPage() {
  const { DashboardData } = useSelector((state) => state.AgencyDashboardReducer)
  const userLogin = useSelector((state) => state.AuthenticationReducer.userLogin)
  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const dispatch = useDispatch()
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [filterApplied, setFilterApplied] = useState(false)

  const getDefaultDateRange = () => {
    const startOfMonth = dayjs().startOf('month')
    const endOfMonth = dayjs().endOf('month')
    return [startOfMonth, endOfMonth]
  }

  const fetchDataWithDateRange = (start, end) => {
    const formattedStartDate = start.format("MM/DD/YYYY")
    const formattedEndDate = end.format("MM/DD/YYYY")

    setLoading(true)
    dispatch(FetchDashboardAgencyCoursesAsync(formattedStartDate, formattedEndDate)).finally(() => {
      setLoading(false)
      setFilterApplied(true)
    })
  }

  useEffect(() => {
    const [defaultStart, defaultEnd] = getDefaultDateRange()
    setSelectedMonth(defaultStart)
    fetchDataWithDateRange(defaultStart, defaultEnd)

    const intervalId = setInterval(() => {
      const [newStart, newEnd] = getDefaultDateRange()
      if (!dayjs(selectedMonth).isSame(newStart, 'month')) {
        setSelectedMonth(newStart)
        fetchDataWithDateRange(newStart, newEnd)
      }
    }, 3600000) // 1 giờ

    return () => clearInterval(intervalId)
  }, [])

  const handleMonthChange = (date) => {
    setSelectedMonth(date)
  }

  const handleFilter = () => {
    if (selectedMonth) {
      const startOfMonth = selectedMonth.startOf('month')
      const endOfMonth = selectedMonth.endOf('month')
      fetchDataWithDateRange(startOfMonth, endOfMonth)
    } else {
      console.log("Vui lòng chọn tháng!")
    }
  }

  const handleExportReport = async () => {
    if (selectedMonth) {
      const month = selectedMonth.month() + 1;
      const year = selectedMonth.year();
      const agencyId = userLogin?.agencyId;
      setExportLoading(true);
      try {
        await dispatch(ExportMonthlyFinancialReportAsync(agencyId, month, year));
      } finally {
        setExportLoading(false);
      }
    } else {
      message.error("Vui lòng chọn tháng!");
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
    }
  ]

  const totalStudents = DashboardData.reduce((sum, course) => sum + course.studentCount, 0)
  const totalCourses = DashboardData.length
  const RevenueSummary = DashboardData.reduce((sum, course) => sum + course.totalRevenue, 0)
  const totalMonthlyFees = DashboardData.reduce((sum, course) => sum + course.monthlyFee, 0)
  const totalRefunds = DashboardData.reduce((sum, course) => sum + course.refunds, 0)
  const totalActualProfits = DashboardData.reduce((sum, course) => sum + course.actualProfits, 0)

  return (
    <Content className="p-6">
      <Title level={2} className="mb-6">
        Bảng Điều Khiển Doanh Thu
      </Title>

      <Card className="mb-6">
        <Space direction="vertical" size="middle" className="w-full">
          <Title level={4}>Lọc Theo Thời Gian</Title>
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
              <StatisticCard
                title="Tổng Doanh Thu"
                value={RevenueSummary}
                prefix={<DollarOutlined />}
                suffix="VND"
                groupSeparator=","
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <StatisticCard
                title="Tổng Số Khóa Học"
                value={totalCourses}
                prefix={<BarChartOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <StatisticCard
                title="Tổng Số Học Viên"
                value={totalStudents}
                prefix={<TeamOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <StatisticCard
                title="Tổng Phí Hàng Tháng"
                value={totalMonthlyFees}
                prefix={<MoneyCollectOutlined />}
                suffix="VND"
                groupSeparator=","
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <StatisticCard
                title="Tổng Hoàn Tiền"
                value={totalRefunds}
                prefix={<RollbackOutlined />}
                suffix="VND"
                groupSeparator=","
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <StatisticCard
                title="Tổng Lợi Nhuận Thực Tế Thu Được"
                value={totalActualProfits}
                prefix={<PieChartOutlined />}
                suffix="VND"
                groupSeparator=","
              />
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
  )
}

