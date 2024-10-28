import React, { useEffect, useState } from "react";
import { Button, Modal, Select, Form, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
// import { fetchAvailableClasses, fetchClassSlots, createClass } from "../../../Redux/Actions/ClassActions";

const AddToClassModal = ({ visible, onClose, listStudents, courseId }) => {
    const dispatch = useDispatch();
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [classSlots, setClassSlots] = useState([]);
    // const { classes } = useSelector((state) => state.ClassReducer);

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

    // Submit the Create Class form
    const handleCreateClass = (values) => {
        // dispatch(createClass(values)).then(() => {
        //     setIsCreateModalVisible(false);
        //     dispatch(fetchAvailableClasses()); // Refresh the available classes
        // });
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
                    <Form.Item label="Chọn lớp học">
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
                <Form layout="vertical" onFinish={handleCreateClass}>
                    <Form.Item
                        name="name"
                        label="Tên lớp"
                        rules={[{ required: true, message: "Vui lòng nhập tên lớp" }]}
                    >
                        <Input placeholder="Nhập tên lớp" />
                    </Form.Item>
                    <Form.Item name="teacher" label="Teacher">
                        <Select placeholder="Tùy chọn - Lựa chọn giảng viên" allowClear>
                            {/* Replace with teacher list */}
                            <Select.Option value="teacher1">Teacher 1</Select.Option>
                            <Select.Option value="teacher2">Teacher 2</Select.Option>
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
            </Modal>
        </>
    );
};

export default AddToClassModal;
