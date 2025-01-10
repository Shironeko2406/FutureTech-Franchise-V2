import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Card, Row, Col, Statistic, Table, Select, DatePicker, Space } from 'antd';
import { DollarOutlined, TeamOutlined } from '@ant-design/icons';
import { Line, Pie } from '@ant-design/charts';
import { GetDashboardDataActionAsync } from '../../../Redux/ReducerAPI/DashboardReducer';
import moment from 'moment';

const { Content } = Layout;
const { RangePicker } = DatePicker;

const Dashboard = () => {
    const dispatch = useDispatch();
    const dashboardData = useSelector(state => state.DashboardReducer.dashboardData);
    const [isYearly, setIsYearly] = useState(false);
    const [topCourses, setTopCourses] = useState(5);
    const [dateRange, setDateRange] = useState([
        moment().startOf('year'),
        moment().endOf('year')
    ]);

    useEffect(() => {
        if (dateRange.length === 2) {
            const [from, to] = dateRange;
            dispatch(GetDashboardDataActionAsync({
                from: from.format('YYYY-MM-DD'),
                to: to.format('YYYY-MM-DD'),
                year: isYearly,
                topCourse: topCourses
            }));
        }
    }, [dateRange, isYearly, topCourses, dispatch]);

    const revenueData = dashboardData.adminCourseRevenueDashboards || [];
    const totalCourseRevenue = dashboardData.totalCourseRevenue || 0;
    const totalContractRevenue = dashboardData.totalContractRevenue || 0;
    const totalRegistrations = dashboardData.courseDashboardModels?.reduce((sum, item) => sum + item.numberOfRegisters, 0) || 0;

    const columns = [
        { title: 'Mã khóa học', dataIndex: 'code', key: 'code' },
        { title: 'Tên khóa học', dataIndex: 'name', key: 'name' },
        { title: 'Số lượng đăng ký', dataIndex: 'numberOfRegisters', key: 'numberOfRegisters' },
    ];

    const lineConfig = {
        data: revenueData?.map(item => ({
            date: isYearly ? item.year : item.month,
            value: item.revenue,
            category: 'Doanh thu'
        })) || [],
        xField: 'date',
        yField: 'value',
        seriesField: 'category',
        yAxis: {
            label: {
                formatter: (v) => `${v.toLocaleString()} đ`,
            },
        },
        legend: { position: 'top' },
        smooth: true,
        animation: {
            appear: {
                animation: 'path-in',
                duration: 5000,
            },
        },
    };

    const pieConfig = {
        data: dashboardData.courseDashboardModels || [],
        angleField: 'numberOfRegisters',
        colorField: 'name',
        radius: 0.8,
        label: {
            type: 'outer',
            content: '{name}: {percentage}',
        },
        interactions: [{ type: 'element-active' }],
    };

    return (
        <Layout className="min-h-screen" style={{ backgroundColor: '#f6f8fa' }}>
            <Content className="p-6">
                <Card className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-800">Thống Kê Doanh Thu</h1>
                    </div>
                    <Space size="large">
                        <Select
                            value={isYearly}
                            onChange={setIsYearly}
                            style={{ width: 150 }}
                            options={[
                                { value: false, label: 'Theo tháng' },
                                { value: true, label: 'Theo năm' },
                            ]}
                        />
                        <RangePicker
                            picker="month"
                            placeholder={['Từ tháng', 'Đến tháng']}
                            value={dateRange}
                            onChange={setDateRange}
                        />
                    </Space>
                </Card>

                <Row gutter={[16, 16]}>
                    <Col span={8}>
                        <Card hoverable>
                            <Statistic
                                title="Tổng doanh thu khóa học"
                                value={totalCourseRevenue}
                                prefix={<DollarOutlined />}
                                precision={0}
                                suffix=" đ"
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card hoverable>
                            <Statistic
                                title="Tổng doanh thu hợp đồng"
                                value={totalContractRevenue}
                                prefix={<DollarOutlined />}
                                precision={0}
                                suffix=" đ"
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card hoverable>
                            <Statistic
                                title="Tổng số lượng đăng ký"
                                value={totalRegistrations}
                                prefix={<TeamOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} className="mt-6">
                    <Col span={16}>
                        <Card title="Biểu đồ doanh thu" hoverable>
                            <Line {...lineConfig} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="Phân bố đăng ký khóa học" hoverable>
                            <Pie {...pieConfig} />
                        </Card>
                    </Col>
                </Row>

                <Card
                    title="Danh sách khóa học"
                    className="mt-6"
                    hoverable
                    extra={
                        <Select
                            value={topCourses}
                            onChange={setTopCourses}
                            style={{ width: 120 }}
                            options={[
                                { value: 5, label: 'Top 5' },
                                { value: 10, label: 'Top 10' },
                                { value: 20, label: 'Top 20' },
                            ]}
                        />
                    }
                >
                    <Table
                        columns={columns}
                        dataSource={dashboardData.courseDashboardModels?.slice(0, topCourses) || []}
                        pagination={false}
                    />
                </Card>
            </Content>
        </Layout>
    );
};

export default Dashboard;

