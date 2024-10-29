import React from "react";
import { Modal, Select, Form, Input, Button } from "antd";

const CreateSlotModal = ({ visible, onCancel, onSubmit, scheduleData }) => (
    <Modal
        open={visible}
        title="Tạo Thời Khóa Biểu"
        onCancel={onCancel}
        footer={null}
    >
        <Form layout="vertical" onFinish={onSubmit} initialValues={scheduleData}>
            <Form.Item
                name="room"
                label="Phòng học"
                rules={[{ required: true, message: "Vui lòng nhập phòng học" }]}
            >
                <Input placeholder="Nhập phòng học" />
            </Form.Item>
            <Form.Item
                name="slotId"
                label="Chọn Slot"
                rules={[{ required: true, message: "Vui lòng chọn slot" }]}
            >
                <Select placeholder="Chọn slot" allowClear>
                    {/* Options for slots */}
                </Select>
            </Form.Item>
            <Form.Item
                name="startDate"
                label="Ngày bắt đầu"
                rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
            >
                <Input type="date" />
            </Form.Item>
            <Form.Item
                name="dayOfWeeks"
                label="Chọn ngày trong tuần"
                rules={[{ required: true, message: "Vui lòng chọn ít nhất một ngày" }]}
            >
                <Select mode="multiple" placeholder="Chọn ngày trong tuần">
                    <Select.Option value="Sunday">Chủ Nhật</Select.Option>
                    <Select.Option value="Monday">Thứ Hai</Select.Option>
                    <Select.Option value="Tuesday">Thứ Ba</Select.Option>
                    <Select.Option value="Wednesday">Thứ Tư</Select.Option>
                    <Select.Option value="Thursday">Thứ Năm</Select.Option>
                    <Select.Option value="Friday">Thứ Sáu</Select.Option>
                    <Select.Option value="Saturday">Thứ Bảy</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Tạo Thời Khóa Biểu
                </Button>
            </Form.Item>
        </Form>
    </Modal>
);

export default CreateSlotModal;
