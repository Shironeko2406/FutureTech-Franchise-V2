import React, { useEffect, useState } from "react";
import { Button, Modal, Select, Form, Input, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { GetAllInstructorsAvailableActionAsync, CreateClassActionAsync } from "../../Redux/ReducerAPI/ClassReducer";
import { GetAllCoursesAvailableActionAsync } from "../../Redux/ReducerAPI/CourseReducer";

const CreateClassModal = ({ visible, onClose }) => {
    const dispatch = useDispatch();
    const { instructors } = useSelector((state) => state.ClassReducer);
    const [isLoading, setLoading] = useState(false);
    const { course } = useSelector((state) => state.CourseReducer);


    useEffect(() => {
        if (visible) {
            dispatch(GetAllInstructorsAvailableActionAsync());
            dispatch(GetAllCoursesAvailableActionAsync());
        }
    }, [visible, dispatch]);

    const handleCreateClass = (values) => {
        setLoading(true);
        console.log(`Create class: ${values}`);
        const classData = {
            name: values.name,
            capacity: values.capacity,
            instructorId: values.instructor,
            courseId: values.course,
            studentId: [],
        };

        dispatch(CreateClassActionAsync(classData))
            .then(() => {
                onClose();
            })
            .finally(() => setLoading(false));
    };

    return (
        <Modal
            open={visible}
            title="Tạo lớp mới"
            onCancel={onClose}
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
                    <Form.Item name="course" label="Khóa học">
                        <Select
                            placeholder="Tùy chọn - Lựa chọn khóa học"
                            allowClear
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option?.children.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {course?.map((course) => (
                                <Select.Option key={course.id} value={course.id}>
                                    {course.code}
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
    );
};

export default CreateClassModal;