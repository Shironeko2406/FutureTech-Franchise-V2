import React from 'react';
import { Modal, Form, Input, TimePicker, Button } from 'antd';
import dayjs from 'dayjs';

const AddSlotModal = ({ visible, onCancel, onCreate }) => {
    const [form] = Form.useForm();

    const handleCreate = (values) => {
        const { name, startTime, endTime } = values;
        const startTimeSpan = convertToTimeSpan(startTime);
        const endTimeSpan = convertToTimeSpan(endTime);

        onCreate({ name, startTime: startTimeSpan, endTime: endTimeSpan });
        form.resetFields();
    };

    const convertToTimeSpan = (time) => {
        const hours = time.hour().toString().padStart(2, '0');
        const minutes = time.minute().toString().padStart(2, '0');
        const seconds = time.second().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    return (
        <Modal
            title="Thêm Slot Học Mới"
            visible={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Form form={form} onFinish={handleCreate} layout="vertical">
                <Form.Item
                    name="name"
                    label="Tên Slot"
                    rules={[{ required: true, message: 'Vui lòng nhập tên slot' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="startTime"
                    label="Giờ bắt đầu"
                    rules={[{ required: true, message: 'Vui lòng chọn giờ bắt đầu' }]}
                >
                    <TimePicker format="HH:mm" />
                </Form.Item>
                <Form.Item
                    name="endTime"
                    label="Giờ kết thúc"
                    rules={[{ required: true, message: 'Vui lòng chọn giờ kết thúc' }]}
                >
                    <TimePicker format="HH:mm" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Tạo Slot
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddSlotModal;