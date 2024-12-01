
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Spin } from 'antd';

const { Option } = Select;

const EquipmentEditModal = ({ visible, onCancel, equipmentData, onSave }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible && equipmentData) {
            form.setFieldsValue(equipmentData);
        }
    }, [visible, equipmentData, form]);

    const handleOk = () => {
        form.validateFields().then(values => {
            setLoading(true);
            onSave(values).finally(() => {
                setLoading(false);
                onCancel();
            });
        });
    };

    return (
        <Modal
            title="Chỉnh sửa thiết bị"
            open={visible}
            onOk={handleOk}
            onCancel={onCancel}
            okText="Lưu thay đổi"
            cancelText="Hủy"
        >
            <Spin spinning={loading}>
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="equipmentName"
                        label="Tên thiết bị"
                        rules={[{ required: true, message: 'Vui lòng nhập tên thiết bị' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="serialNumber"
                        label="Số seri"
                        rules={[{ required: true, message: 'Vui lòng nhập số seri' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                    >
                        <Select placeholder="Chọn trạng thái">
                            <Option value="Available">Đang sử dụng</Option>
                            <Option value="Repair">Đang sửa chữa</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="note"
                        label="Ghi chú"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Giá"
                        rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
                    >
                        <Input type="number" min={0} />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default EquipmentEditModal;