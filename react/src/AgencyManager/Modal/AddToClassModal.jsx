import React, { useEffect, useState } from "react";
import { Button, Modal, Select, Form, Input, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { GetAllInstructorsAvailableActionAsync, CreateClassActionAsync } from "../../Redux/ReducerAPI/ClassReducer";
import { CreateClassScheduleActionAsync } from "../../Redux/ReducerAPI/ClassScheduleReducer";
import CreateSlotModal from "../Modal/CreateSlotModal";

const AddToClassModal = ({ visible, onClose, listStudents, courseId, onClassCreated }) => {
    const dispatch = useDispatch();
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [classSlots, setClassSlots] = useState([]);
    const { instructors } = useSelector((state) => state.ClassReducer);
    const [isLoading, setLoading] = useState(false);
    const [classScheduleModalVisible, setClassScheduleModalVisible] = useState(false);
    const [scheduleData, setScheduleData] = useState({ room: "", classId: "", slotId: "", startDate: "", dayOfWeeks: [] });


    // Fetch available classes on mount
    useEffect(() => {
        console.log("listStudents: ", listStudents);
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
                if (res) {
                    setIsCreateModalVisible(false);
                    onClose();
                    setClassScheduleModalVisible(true);
                    setScheduleData({ ...scheduleData, classId: res.data });
                    if (onClassCreated) onClassCreated();
                }
            })
            .finally(() => setLoading(false));
    };

    const handleScheduleSubmit = (values) => {
        const newScheduleData = { ...scheduleData, ...values };
        dispatch(CreateClassScheduleActionAsync(newScheduleData));
        setClassScheduleModalVisible(false);
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

            {/* Create Slot Modal */}
            <CreateSlotModal
                visible={classScheduleModalVisible}
                onCancel={() => setClassScheduleModalVisible(false)}
                onSubmit={handleScheduleSubmit}
                scheduleData={scheduleData}
            />
        </>
    );
};

export default AddToClassModal;
