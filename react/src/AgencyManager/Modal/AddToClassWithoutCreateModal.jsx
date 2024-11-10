import React, { useEffect, useState } from "react";
import { Button, Modal, Select, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { GetAvailableClassesByCourseIdActionAsync, AddStudentsToClassActionAsync } from "../../Redux/ReducerAPI/ClassReducer";

const AddToClassWithoutCreateModal = ({ visible, onClose, studentId, courseId }) => {
    const dispatch = useDispatch();
    const [selectedClass, setSelectedClass] = useState(null);
    const { availableClasses } = useSelector((state) => state.ClassReducer);

    useEffect(() => {
        if (visible) {
            dispatch(GetAvailableClassesByCourseIdActionAsync(courseId));
        }
    }, [visible, dispatch, courseId]);

    const handleClassSelect = (classId) => {
        setSelectedClass(classId);
    };

    const handleConfirm = () => {
        if (selectedClass) {
            dispatch(AddStudentsToClassActionAsync(selectedClass, [studentId]));
            onClose();
        }
    };

    const selectedClassData = availableClasses.find(cls => cls.id === selectedClass);

    return (
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
                    <>
                        <Form.Item label="Giảng viên">
                            <Input value={selectedClassData.instructorName} disabled />
                        </Form.Item>
                        <Form.Item label="Sức chứa">
                            <Input value={selectedClassData.capacity} disabled />
                        </Form.Item>
                        <Form.Item label="Số người đang học">
                            <Input value={selectedClassData.currentEnrollment} disabled />
                        </Form.Item>
                    </>
                )}
            </Form>
        </Modal>
    );
};

export default AddToClassWithoutCreateModal;