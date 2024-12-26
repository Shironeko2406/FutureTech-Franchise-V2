import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Spin } from 'antd';
import { useDispatch } from 'react-redux';
import { CreateClassScheduleActionAsync } from '../../Redux/ReducerAPI/ClassScheduleReducer'; // Adjust the import based on your action
import moment from 'moment';

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
                url: scheduleData.url, // Add this line
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
                url: values.url, // Add this line
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
            title="Tạo thời Khóa Biểu"
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
                        label="Chọn tiết học"
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
                        <DatePicker disabledDate={(current) => current && current < moment().startOf('day')} />
                    </Form.Item>
                    <Form.Item
                        name="daysOfWeek"
                        label="Chọn các ngày trong tuần"
                        rules={[{ required: true, message: "Vui lòng chọn thứ trong tuần" }]}

                    >
                        <Select mode="multiple" placeholder="Chọn các ngày">
                            {[
                                { label: "Chủ Nhật", value: "Sunday" },
                                { label: "Thứ Hai", value: "Monday" },
                                { label: "Thứ Ba", value: "Tuesday" },
                                { label: "Thứ Tư", value: "Wednesday" },
                                { label: "Thứ Năm", value: "Thursday" },
                                { label: "Thứ Sáu", value: "Friday" },
                                { label: "Thứ Bảy", value: "Saturday" }
                            ].map(day => (
                                <Option key={day.value} value={day.value}>{day.label}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="url"
                        label="Đường dẫn lớp học trực tuyến"
                        rules={[{ required: true, message: "Vui lòng nhập đường dẫn lớp học trực tuyến" }]}
                    >
                        <Input placeholder="Nhập đường dẫn lớp học trực tuyến(Google Meet, Zoom,...)" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Tạo lịch học
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default EditScheduleModal;
