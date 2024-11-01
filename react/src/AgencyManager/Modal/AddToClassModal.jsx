import React, { useEffect, useState } from "react";
import { Button, Modal, Select, Form, Input, Spin, DatePicker } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { GetAllInstructorsAvailableActionAsync, CreateClassActionAsync } from "../../Redux/ReducerAPI/ClassReducer";
import { CreateClassScheduleActionAsync } from "../../Redux/ReducerAPI/ClassScheduleReducer";
import { GetSlotActionAsync } from "../../Redux/ReducerAPI/SlotReducer";

const AddToClassModal = ({ visible, onClose, listStudents, courseId, onClassCreated }) => {
    const dispatch = useDispatch();
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [classSlots, setClassSlots] = useState([]);
    const { instructors } = useSelector((state) => state.ClassReducer);
    const [isLoading, setLoading] = useState(false);
    const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
    const { slotData } = useSelector((state) => state.SlotReducer);
    const [createdClassId, setCreatedClassId] = useState(null);

    // Fetch available classes on mount
    useEffect(() => {
        console.log("listStudents: ", listStudents);
        if (visible) dispatch(GetSlotActionAsync());
        // if (visible) dispatch(fetchAvailableClasses());
    }, [visible, dispatch]);

    // Handle class selection to fetch slots
    const handleClassSelect = (classId) => {
        setSelectedClass(classId);
        // dispatch(fetchClassSlots(classId)).then((slots) => setClassSlots(slots));
    };

    // Open the Create Class modal
    const handleCreateClassClick = () => {
        onClose();
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
                    <Button key="submit" type="primary" onClick={() => { /* Handle confirmation */ }}>
                        Xác nhận
                    </Button>,
                ]}
            >
                <Form layout="vertical mt-4">
                    <Form.Item label="Chọn lớp học hiện có">
                        <Select
                            onChange={handleClassSelect}
                            style={{ width: "100%" }}
                        >
                            {/* {classes.map((cls) => (
                                <Select.Option key={cls.id} value={cls.id}>
                                    {cls.name}
                                </Select.Option>
                            ))} */}
                        </Select>
                    </Form.Item>
                    {selectedClass && (
                        <Form.Item label="Class Slots">
                            <Select
                                placeholder="Select a slot"
                            // options={classSlots.map((slot) => ({
                            //     label: `${slot.startTime} - ${slot.endTime}`,
                            //     value: slot.id,
                            // }))}
                            />
                        </Form.Item>
                    )}
                    <Button type="link" onClick={handleCreateClassClick}>
                        <PlusOutlined /> Tạo lớp mới
                    </Button>
                </Form>
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
                        <DatePicker />
                    </Form.Item>
                    <Form.Item name="daysOfWeek" label="Chọn các ngày trong tuần">
                        <Select mode="multiple" placeholder="Chọn các ngày">
                            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(day => (
                                <Select.Option key={day} value={day}>{day}</Select.Option>
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

export default AddToClassModal;
