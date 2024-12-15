// import { useEffect, useState } from "react"
// import { Table, DatePicker, Button, Card, Row, Col, Statistic, Typography, Layout, Space } from "antd"
// import { useDispatch, useSelector } from "react-redux"
// import { FetchDashboardAgencyCoursesAsync, FetchDashboardAgencyAsync } from "../../../Redux/ReducerAPI/AgencyDashboardReducer"
// import dayjs from "dayjs"
// import { BarChartOutlined, DollarOutlined, TeamOutlined } from "@ant-design/icons"

// const { Title } = Typography
// const { Content } = Layout
// const { RangePicker } = DatePicker

// export default function AgencyDashboardPage() {
//   const { DashboardData, RevenueSummary } = useSelector((state) => state.AgencyDashboardReducer)
//   const [loading, setLoading] = useState(false)
//   const dispatch = useDispatch()
//   const [dateRange, setDateRange] = useState([null, null])
//   const [filterApplied, setFilterApplied] = useState(false)

//   const handleDateRangeChange = (dates) => {
//     setDateRange(dates)
//   }

//   const handleFilter = () => {
//     if (dateRange[0] && dateRange[1]) {
//       const formattedStartDate = dayjs(dateRange[0]).format("MM/DD/YYYY")
//       const formattedEndDate = dayjs(dateRange[1]).format("MM/DD/YYYY")

//       setLoading(true)

//       Promise.all([
//         dispatch(FetchDashboardAgencyCoursesAsync(formattedStartDate, formattedEndDate)),
//         dispatch(FetchDashboardAgencyAsync(formattedStartDate, formattedEndDate)),
//       ]).finally(() => {
//         setLoading(false)
//         setFilterApplied(true)
//       })
//     } else {
//       // Hiển thị thông báo lỗi nếu chưa chọn đầy đủ ngày
//       console.log("Vui lòng chọn khoảng thời gian!")
//     }
//   }

//   const columns = [
//     {
//       title: "Mã Khóa Học",
//       dataIndex: "courseCode",
//       key: "courseCode",
//     },
//     {
//       title: "Tên Khóa Học",
//       dataIndex: "courseName",
//       key: "courseName",
//     },
//     {
//       title: "Số Lượng Học Viên",
//       dataIndex: "studentCount",
//       key: "studentCount",
//     },
//     {
//       title: "Doanh Thu",
//       dataIndex: "totalRevenue",
//       key: "totalRevenue",
//       render: (revenue) => `${revenue.toLocaleString()} VND`,
//     },
//   ]

//   const totalStudents = DashboardData.reduce((sum, course) => sum + course.studentCount, 0)
//   const totalCourses = DashboardData.length

//   return (

//       <Content className="p-6">
//         <Title level={2} className="mb-6">
//           Bảng Điều Khiển Doanh Thu
//         </Title>

//         <Card className="mb-6">
//           <Space direction="vertical" size="middle" className="w-full">
//             <Title level={4}>Lọc Theo Thời Gian</Title>
//             <Space>
//               <RangePicker
//                 value={dateRange}
//                 onChange={handleDateRangeChange}
//                 format="DD/MM/YYYY"
//                 className="w-64"
//               />
//               <Button type="primary" onClick={handleFilter} loading={loading}>
//                 Áp Dụng Bộ Lọc
//               </Button>
//             </Space>
//           </Space>
//         </Card>

//         {filterApplied && (
//           <>
//             <Row gutter={16} className="mb-6">
//               <Col xs={24} sm={12} md={8}>
//                 <Card>
//                   <Statistic
//                     title="Tổng Doanh Thu"
//                     value={RevenueSummary}
//                     prefix={<DollarOutlined />}
//                     suffix="VND"
//                     groupSeparator=","
//                   />
//                 </Card>
//               </Col>
//               <Col xs={24} sm={12} md={8}>
//                 <Card>
//                   <Statistic
//                     title="Tổng Số Khóa Học"
//                     value={totalCourses}
//                     prefix={<BarChartOutlined />}
//                   />
//                 </Card>
//               </Col>
//               <Col xs={24} sm={12} md={8}>
//                 <Card>
//                   <Statistic
//                     title="Tổng Số Học Viên"
//                     value={totalStudents}
//                     prefix={<TeamOutlined />}
//                   />
//                 </Card>
//               </Col>
//             </Row>

//             <Card title="Danh Sách Khóa Học" className="mb-6">
//               <Table
//                 columns={columns}
//                 dataSource={DashboardData}
//                 rowKey="courseId"
//                 loading={loading}
//                 pagination={{ pageSize: 10 }}
//                 locale={{ emptyText: "Không có khóa học nào" }}
//               />
//             </Card>
//           </>
//         )}
//       </Content>

//   )
// }


import { useEffect, useState } from "react"
import { Table, DatePicker, Button, Card, Row, Col, Statistic, Typography, Layout, Space } from "antd"
import { useDispatch, useSelector } from "react-redux"
import { FetchDashboardAgencyCoursesAsync, FetchDashboardAgencyAsync } from "../../../Redux/ReducerAPI/AgencyDashboardReducer"
import dayjs from "dayjs"
import { BarChartOutlined, DollarOutlined, TeamOutlined } from "@ant-design/icons"

const { Title } = Typography
const { Content } = Layout
const { RangePicker } = DatePicker

export default function AgencyDashboardPage() {
  const { DashboardData, RevenueSummary } = useSelector((state) => state.AgencyDashboardReducer)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const [dateRange, setDateRange] = useState([null, null])
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
    Promise.all([
      dispatch(FetchDashboardAgencyCoursesAsync(formattedStartDate, formattedEndDate)),
      dispatch(FetchDashboardAgencyAsync(formattedStartDate, formattedEndDate)),
    ]).finally(() => {
      setLoading(false)
      setFilterApplied(true)
    })
  }

  useEffect(() => {
    const [defaultStart, defaultEnd] = getDefaultDateRange()
    setDateRange([defaultStart, defaultEnd])
    fetchDataWithDateRange(defaultStart, defaultEnd)

    // Kiểm tra và cập nhật ngày mỗi giờ
    const intervalId = setInterval(() => {
      const [newStart, newEnd] = getDefaultDateRange()
      if (!dayjs(dateRange[0]).isSame(newStart, 'day') || !dayjs(dateRange[1]).isSame(newEnd, 'day')) {
        setDateRange([newStart, newEnd])
        fetchDataWithDateRange(newStart, newEnd)
      }
    }, 3600000) // 1 giờ

    return () => clearInterval(intervalId)
  }, [])

  const handleDateRangeChange = (dates) => {
    setDateRange(dates)
  }

  const handleFilter = () => {
    if (dateRange[0] && dateRange[1]) {
      fetchDataWithDateRange(dateRange[0], dateRange[1])
    } else {
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
    <Content className="p-6">
      <Title level={2} className="mb-6">
        Bảng Điều Khiển Doanh Thu
      </Title>

      <Card className="mb-6">
        <Space direction="vertical" size="middle" className="w-full">
          <Title level={4}>Lọc Theo Thời Gian</Title>
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
  )
}

