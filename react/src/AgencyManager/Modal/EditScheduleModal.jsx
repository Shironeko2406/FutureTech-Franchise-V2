import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Spin } from 'antd';
import { useDispatch } from 'react-redux';
import { CreateClassScheduleActionAsync } from '../../Redux/ReducerAPI/ClassScheduleReducer'; // Adjust the import based on your action

const { Option } = Select;

const EditScheduleModal = ({ visible, onCancel, scheduleData, slotData, onUpdateSuccess, classData }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    // Set form fields when modal is opened
    useEffect(() => {
        if (visible && scheduleData) {
            form.setFieldsValue({
                room: scheduleData.room,
                slotId: scheduleData.slotId,
                startDate: scheduleData.startDate,
                daysOfWeek: scheduleData.daysOfWeek,
            });
        }
    }, [visible, scheduleData, form]);

    const handleFinish = () => {
        form.validateFields().then(values => {
            setLoading(true);
            const scheduleData = {
                room: values.room,
                classId: classData.classId,
                slotId: values.slotId,
                startDate: values.startDate.format("YYYY-MM-DD"), // Định dạng ngày
                dayOfWeeks: values.daysOfWeek,
            };

            dispatch(CreateClassScheduleActionAsync(scheduleData))
                .then(() => {
                    onUpdateSuccess();
                    onCancel();
                })
                .finally(() => setLoading(false));
        });
    };

    return (
        <Modal
            title="Chỉnh sửa Thời Khóa Biểu"
            open={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Spin spinning={loading}>
                <Form layout="vertical" form={form} onFinish={handleFinish}>
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
                        <Select placeholder="Chọn slot">
                            {slotData.map((slot) => (
                                <Option key={slot.id} value={slot.id}>
                                    {`${slot.name} - ${slot.startTime} đến ${slot.endTime}`}
                                </Option>
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
                    <Form.Item
                        name="daysOfWeek"
                        label="Chọn các ngày trong tuần"
                    >
                        <Select mode="multiple" placeholder="Chọn các ngày">
                            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(day => (
                                <Option key={day} value={day}>{day}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Lưu Thay Đổi
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default EditScheduleModal;
