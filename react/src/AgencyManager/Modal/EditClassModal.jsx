import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Spin } from 'antd';
import { useDispatch } from 'react-redux';
import { UpdateClassActionAsync } from '../../Redux/ReducerAPI/ClassReducer';

const { Option } = Select;

const EditClassModal = ({ visible, onCancel, classData, instructors, onUpdateSuccess }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    console.log("classData:", instructors);
    const [loading, setLoading] = useState(false);
    // Thiết lập form khi modal mở
    useEffect(() => {
        if (visible && classData) {
            form.setFieldsValue({
                name: classData.className,
                instructorId: classData.instructorId,
                capacity: classData.capacity,
            });
        }
    }, [visible, classData, form]);


    const handleOk = () => {
        form.validateFields().then(values => {
            console.log("values:", values);
            setLoading(true);
            dispatch(UpdateClassActionAsync(classData.classId, values))
                .then(() => {
                    setLoading(false);
                    onUpdateSuccess(); // Call the callback to fetch updated class details
                    onCancel(); // Close modal
                })
                .finally(() => setLoading(false));
        });
    };

    return (
        <Modal
            title="Chỉnh sửa lớp học"
            open={visible}
            onOk={handleOk}
            onCancel={onCancel}
            okText="Lưu thay đổi"
            cancelText="Hủy"
        >
            <Spin spinning={loading}>
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Tên lớp học"
                        rules={[{ required: true, message: 'Vui lòng nhập tên lớp học' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="instructorId"
                        label="Giảng viên"
                        rules={[{ required: true, message: 'Vui lòng chọn giảng viên' }]}
                        allowClear
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option?.children.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        <Select placeholder="Chọn giảng viên">
                            {/* Tạo các tùy chọn giảng viên từ dữ liệu */}
                            {instructors.map(instructor => (
                                <Option key={instructor.id} value={instructor.id}>
                                    {instructor.userName}
                                </Option>
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
                </Form>
            </Spin>
        </Modal>
    );
};

export default EditClassModal;
