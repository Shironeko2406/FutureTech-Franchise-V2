import React, { useEffect } from 'react';
import { Modal, Form, Input, TimePicker, Button } from 'antd';
import dayjs from 'dayjs';

const SlotModal = ({ visible, onCancel, onCreate, initialValues }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                name: initialValues.name,
                startTime: dayjs(initialValues.startTime, 'HH:mm:ss'),
                endTime: dayjs(initialValues.endTime, 'HH:mm:ss'),
            });
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);

    const handleCreate = (values) => {
        const { name, startTime, endTime } = values;
        const startTimeSpan = convertToTimeSpan(startTime);
        const endTimeSpan = convertToTimeSpan(dayjs(endTime, 'HH:mm'));
        console.log('Received values of form: ', values);
        onCreate({ name, startTime: startTimeSpan, endTime: endTimeSpan });
        form.resetFields();
    };

    const convertToTimeSpan = (time) => {
        const hours = time.hour().toString().padStart(2, '0');
        const minutes = time.minute().toString().padStart(2, '0');
        const seconds = time.second().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    const onStartTimeChange = (startTime) => {
        const endTime = startTime.add(3, 'hour'); // Tự động cộng thêm 3 giờ
        form.setFieldsValue({ endTime });
    };
    return (
        <Modal
            open={visible}
            title={initialValues ? 'Chỉnh sửa Khung giờ học' : 'Thêm khung giờ học'}
            okText={initialValues ? 'Cập nhật' : 'Thêm mới'}
            cancelText="Hủy"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        handleCreate(values);
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form form={form} layout="vertical" name="form_in_modal">
                <Form.Item
                    name="name"
                    label="Tên khung giờ"
                    rules={[{ required: true, message: 'Vui lòng nhập tên slot học!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="startTime"
                    label="Giờ bắt đầu"
                    rules={[{ required: true, message: 'Vui lòng chọn giờ bắt đầu!' }]}
                >
                    <TimePicker format="HH:mm" onChange={onStartTimeChange} />
                </Form.Item>

                <Form.Item
                    name="endTime"
                    label="Giờ kết thúc"
                >
                    <TimePicker format="HH:mm" disabled />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SlotModal;
