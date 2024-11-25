import React, { useState } from 'react';
import { Modal, Form, Upload, Button, DatePicker, Input, InputNumber } from 'antd';
import ReactQuill from 'react-quill';
import styled from 'styled-components';
import { quillFormats, quillModules } from '../../TextEditorConfig/Config';
import { UploadOutlined } from "@ant-design/icons";
import { imageDB } from "../../Firebasse/Config";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import moment from 'moment';

const StyledQuill = styled(ReactQuill)`
  .ql-container {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
  .ql-toolbar {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }
  
  .ql-tooltip {
    z-index: 1000000 !important; // Ensure it's above the modal
    position: fixed !important;
  }
  
  .ql-editing {
    left: 50% !important;
    transform: translateX(-50%);
    background-color: white !important;
    border: 1px solid #ccc !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
    padding: 8px 12px !important;
  }
`;

const SubmitTaskReportModal = ({ visible, onClose, onSubmit, taskType }) => {
    const [form] = Form.useForm();
    const [imageUrls, setImageUrls] = useState([]);
    const [file, setFile] = useState(null);
    const [equipmentFile, setEquipmentFile] = useState(null);

    const handleOk = () => {
        form.validateFields().then(values => {
            const formattedValues = {
                ...values,
                expirationDate: values.expirationDate ? values.expirationDate.format('YYYY-MM-DD') : null,
                startTime: values.startTime ? values.startTime.format('YYYY-MM-DD') : null,
                endTime: values.endTime ? values.endTime.format('YYYY-MM-DD') : null,
                revenueSharePercentage: parseFloat(values.revenueSharePercentage),
                imageUrls,
                file,
                equipmentFile,
                type: taskType
            };
            onSubmit(formattedValues);
        });
    };

    const handleUpload = async ({ file, onSuccess, onError }) => {
        if ((taskType === "AgreementSigned" || taskType === "BusinessRegistered" || taskType === "SignedContract") && !file.type.startsWith('application/')) {
            onError(new Error('Only document files are allowed!'));
            return;
        }
        if (taskType !== "AgreementSigned" && taskType !== "BusinessRegistered" && taskType !== "SignedContract" && !file.type.startsWith('image/')) {
            onError(new Error('Only image files are allowed!'));
            return;
        }
        const storageRef = ref(imageDB, `images/${file.name}`);
        try {
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setImageUrls((prev) => [...prev, url]);
            onSuccess(null, file);
        } catch (error) {
            console.error("Upload error: ", error);
            onError(error);
        }
        setFile(file);
    };

    const handleUploadEquipment = async ({ file, onSuccess, onError }) => {
        if (!file.type.startsWith('application/vnd.ms-excel') && !file.type.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
            onError(new Error('Only Excel files are allowed!'));
            return;
        }
        setEquipmentFile(file);
        onSuccess(null, file);
    };

    return (
        <Modal
            title={taskType === "AgreementSigned" ? "Nộp báo cáo công việc (Thêm mới Thỏa Thuận Nguyên Tắc)" : taskType === "BusinessRegistered" ? "Nộp báo cáo công việc (Thêm mới Giấy Đăng ký doanh nghiệp)" : taskType === "SignedContract" ? "Nộp báo cáo công việc (Thêm mới Hợp đồng Chuyển nhượng)" : "Nộp báo cáo công việc"}
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    Nộp
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical" initialValues={{ title: taskType === "AgreementSigned" ? "Thỏa Thuận Nguyên Tắc Về Hợp Tác Nhượng Quyền" : taskType === "BusinessRegistered" ? "Giấy Đăng Ký Doanh Nghiệp" : "" }}>
                {(taskType === "AgreementSigned" || taskType === "BusinessRegistered") && (
                    <>
                        <Form.Item
                            name="title"
                            label="Tiêu đề"
                            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                        >
                            <Input placeholder="Nhập tiêu đề" />
                        </Form.Item>
                        <Form.Item
                            name="expirationDate"
                            label="Ngày hết hạn"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn' }]}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                disabledDate={(current) => current && current < moment().endOf('day')}
                            />
                        </Form.Item>
                    </>
                )}
                {taskType === "SignedContract" && (
                    <>
                        <Form.Item
                            name="title"
                            label="Tiêu đề"
                            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                        >
                            <Input placeholder="Nhập tiêu đề" />
                        </Form.Item>
                        <Form.Item
                            name="startTime"
                            label="Thời gian bắt đầu"
                            rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu' }]}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                format="YYYY-MM-DD"
                            />
                        </Form.Item>
                        <Form.Item
                            name="endTime"
                            label="Thời gian kết thúc"
                            rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc' }]}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                format="YYYY-MM-DD"
                            />
                        </Form.Item>
                        <Form.Item
                            name="revenueSharePercentage"
                            label="Tỉ lệ phần trăm ăn chia nhượng quyền"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tỉ lệ phần trăm' },
                                { type: 'number', min: 0, max: 100, message: 'Tỉ lệ phần trăm phải nằm trong khoảng 0-100%' }
                            ]}
                        >
                            <InputNumber min={0} max={100} placeholder="Nhập tỉ lệ phần trăm. VD: 10 (10%)" style={{ width: '100%' }} />
                        </Form.Item>
                    </>
                )}
                <Form.Item
                    name="report"
                    label="Báo cáo"
                    rules={[{ required: true, message: 'Vui lòng nhập báo cáo' }]}
                >
                    <StyledQuill
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Nhập báo cáo công việc"
                        style={{ minHeight: '200px' }}
                    />
                </Form.Item>
                <Form.Item
                    name="reportImageURL"
                    label={(taskType === "AgreementSigned" || taskType === "BusinessRegistered" || taskType === "SignedContract") ? "File hợp đồng" : "File ảnh"}
                    rules={[{ required: true, message: 'Vui lòng upload file' }]}
                >
                    <Upload
                        name="reportImage"
                        listType="picture"
                        customRequest={handleUpload}
                        accept={(taskType === "AgreementSigned" || taskType === "BusinessRegistered" || taskType === "SignedContract") ? "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" : "image/*"} // Only allow specific files
                        {...((taskType === "AgreementSigned" || taskType === "BusinessRegistered" || taskType === "SignedContract") && { maxCount: 1 })}
                    >
                        <Button icon={<UploadOutlined />}>{(taskType === "AgreementSigned" || taskType === "BusinessRegistered" || taskType === "SignedContract") ? "Tải tài liệu" : "Tải hình ảnh"}</Button>
                    </Upload>
                </Form.Item>
                {taskType === "Design" && (
                    <Form.Item
                        name="equipmentFile"
                        label="File trang thiết bị"
                        rules={[{ required: true, message: 'Vui lòng upload file trang thiết bị' }]}
                    >
                        <Upload
                            name="equipmentFile"
                            customRequest={handleUploadEquipment}
                            accept=".xls,.xlsx" // Only allow Excel files
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Tải file trang thiết bị</Button>
                        </Upload>
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
};

export default SubmitTaskReportModal;