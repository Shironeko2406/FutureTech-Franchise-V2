import React, { useEffect, useState } from "react";
import { Button, Modal, Select, Form, Input, Spin, DatePicker, Typography, Card, Row, Col, Divider } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { GetAllInstructorsAvailableActionAsync, CreateClassActionAsync, GetAvailableClassesByCourseIdActionAsync, AddStudentsToClassActionAsync } from "../../Redux/ReducerAPI/ClassReducer";
import { CreateClassScheduleActionAsync } from "../../Redux/ReducerAPI/ClassScheduleReducer";
import { GetSlotActionAsync } from "../../Redux/ReducerAPI/SlotReducer";
import moment from 'moment';

const { Title, Text } = Typography;

const AddToClassModal = ({ visible, onClose, listStudents, courseId, onClassCreated }) => {
    const dispatch = useDispatch();
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const { instructors, availableClasses } = useSelector((state) => state.ClassReducer);
    const [isLoading, setLoading] = useState(false);
    const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
    const { slotData } = useSelector((state) => state.SlotReducer);
    const [createdClassId, setCreatedClassId] = useState(null);


    useEffect(() => {
        if (visible) {
            dispatch(GetSlotActionAsync());
            dispatch(GetAvailableClassesByCourseIdActionAsync(courseId));
        }
    }, [visible, dispatch, courseId]);

    const handleClassSelect = (classId) => {
        setSelectedClass(classId);
    };

    const handleConfirm = async () => {
        if (selectedClass) {
            setLoading(true);
            try {
                await dispatch(AddStudentsToClassActionAsync(selectedClass, listStudents));
                onClose();
            } catch (error) {
                console.error("Error adding students to class: ", error);
            } finally {
                setLoading(false);
            }
        }
    };

    // Open the Create Class modal
    const handleCreateClassClick = () => {
        setIsCreateModalVisible(true);
    };

    // Open modal Create Schedule
    const handleScheduleCreation = () => {
        setIsScheduleModalVisible(true);
    };

    // Fetch available instructors when the create modal is opened
    useEffect(() => {
        if (isCreateModalVisible) {
            dispatch(GetAllInstructorsAvailableActionAsync());
        }
    }, [isCreateModalVisible, dispatch]);

    // Submit the Create Class form
    const handleCreateClass = (values) => {
        setLoading(true);
        const classData = {
            name: values.name,
            capacity: values.capacity,
            courseId: courseId,
            instructorId: values.instructor,
            studentId: listStudents,
        };

        dispatch(CreateClassActionAsync(classData))
            .then((res) => {
                setCreatedClassId(res.data);
                setIsCreateModalVisible(false);
                onClose();
                handleScheduleCreation(); // Mở modal tạo thời khóa biểu sau khi tạo lớp thành công
                if (onClassCreated) onClassCreated();
            })
            .finally(() => setLoading(false));
    };

    // Submit the create schedule form
    const handleScheduleSubmit = (values) => {
        const scheduleData = {
            room: values.room,
            classId: createdClassId,
            slotId: values.slotId,
            startDate: values.startDate.format("YYYY-MM-DD"), // Định dạng ngày
            dayOfWeeks: values.daysOfWeek,
        };

        // Gọi API để tạo thời khóa biểu
        dispatch(CreateClassScheduleActionAsync(scheduleData)); // Tạo action này trong ClassScheduleReducer
        setIsScheduleModalVisible(false);
    };

    const selectedClassData = availableClasses.find(cls => cls.id === selectedClass);

    return (
        <>
            <Modal
                open={visible}
                title="Thêm học sinh vào lớp"
                onCancel={onClose}
                footer={[
                    <Button key="back" onClick={onClose}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleConfirm}>
                        Xác nhận
                    </Button>,
                ]}
            >
                <Spin spinning={isLoading}>
                    <Form layout="vertical mt-4">
                        <Form.Item label="Chọn lớp học hiện có">
                            <Select
                                onChange={handleClassSelect}
                                style={{ width: "100%" }}
                            >
                                {availableClasses.map((cls) => (
                                    <Select.Option key={cls.id} value={cls.id}>
                                        {`${cls.name} - ${cls.dayOfWeek}`}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        {selectedClass && selectedClassData && (
                            <Card
                                className="mt-4"
                                style={{ backgroundColor: '#f0f2f5', borderRadius: 8 }}
                            >
                                <Title level={4} style={{ marginBottom: 16 }}>Thông tin lớp học</Title>
                                <Divider style={{ margin: '12px 0' }} />
                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <InfoItem label="Tên lớp" value={selectedClassData.name} />
                                    </Col>
                                    <Col span={12}>
                                        <InfoItem label="Giảng viên" value={selectedClassData.instructorName} />
                                    </Col>
                                    <Col span={12}>
                                        <InfoItem label="Sức chứa" value={`${selectedClassData.capacity} học viên`} />
                                    </Col>
                                    <Col span={12}>
                                        <InfoItem label="Số người đang học" value={`${selectedClassData.currentEnrollment} học viên`} />
                                    </Col>
                                    <Col span={12}>
                                        <InfoItem label="Ngày bắt đầu" value={selectedClassData.startDate ? moment(selectedClassData.startDate).format('DD/MM/YYYY') : 'Chưa có'} />
                                    </Col>
                                    <Col span={12}>
                                        <InfoItem label="Số buổi đã học" value={`${selectedClassData.daysElapsed} buổi`} />
                                    </Col>
                                </Row>
                            </Card>
                        )}
                        <Button type="link" onClick={handleCreateClassClick}>
                            <PlusOutlined /> Tạo lớp mới
                        </Button>
                    </Form>
                </Spin>
            </Modal>

            {/* Create Class Modal */}
            <Modal
                open={isCreateModalVisible}
                title="Tạo lớp mới"
                onCancel={() => setIsCreateModalVisible(false)}
                footer={null}
            >
                <Spin spinning={isLoading}>
                    <Form layout="vertical" onFinish={handleCreateClass}>
                        <Form.Item
                            name="name"
                            label="Tên lớp"
                            rules={[{ required: true, message: "Vui lòng nhập tên lớp" }]}
                        >
                            <Input placeholder="Nhập tên lớp" />
                        </Form.Item>
                        <Form.Item name="instructor" label="Giảng viên">
                            <Select
                                placeholder="Tùy chọn - Lựa chọn giảng viên"
                                allowClear
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option?.children.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {instructors?.map((instructor) => (
                                    <Select.Option key={instructor.id} value={instructor.id}>
                                        {instructor.userName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="capacity"
                            label="Sức chứa"
                            rules={[{ required: true, message: "Vui lòng nhập số lượng học viên tối đa cho lớp học!" }]}
                        >
                            <Input type="number" placeholder="Nhập số lượng học viên tối đa cho lớp học, ví dụ: 30" min={1} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Tạo lớp học
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>

            {/* Schedule Creation Modal */}
            <Modal
                open={isScheduleModalVisible}
                title="Tạo Thời Khóa Biểu (Tùy Chọn)"
                onCancel={() => setIsScheduleModalVisible(false)}
                footer={null}
            >
                <Form layout="vertical" onFinish={handleScheduleSubmit}>
                    <Form.Item
                        name="room"
                        label="Phòng học"
                        rules={[{ required: true, message: "Vui lòng nhập phòng học" }]}
                    >
                        <Input placeholder="Nhập phòng học" />
                    </Form.Item>
                    <Form.Item name="slotId" label="Chọn Slot">
                        <Select placeholder="Chọn slot">
                            {slotData.map((slot) => (
                                <Select.Option key={slot.id} value={slot.id}>
                                    {`${slot.name} - ${slot.startTime} đến ${slot.endTime}`}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="startDate"
                        label="Ngày bắt đầu"
                        rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
                    >
                        <DatePicker disabledDate={(current) => current && current < moment().endOf('day')} />
                    </Form.Item>
                    <Form.Item name="daysOfWeek" label="Chọn các ngày trong tuần">
                        <Select mode="multiple" placeholder="Chọn các ngày">
                            {[
                                { label: "Chủ Nhật", value: "Sunday" },
                                { label: "Thứ Hai", value: "Monday" },
                                { label: "Thứ Ba", value: "Tuesday" },
                                { label: "Thứ Tư", value: "Wednesday" },
                                { label: "Thứ Năm", value: "Thursday" },
                                { label: "Thứ Sáu", value: "Friday" },
                                { label: "Thứ Bảy", value: "Saturday" }
                            ].map(day => (
                                <Select.Option key={day.value} value={day.value}>{day.label}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Tạo Thời Khóa Biểu
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

        </>
    );
};

const InfoItem = ({ label, value }) => (
    <div style={{ marginBottom: 8 }}>
        <Text type="secondary" style={{ marginRight: 8 }}>{label}:</Text>
        <Text strong>{value}</Text>
    </div>
);

export default AddToClassModal;
