import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Button, Upload, Spin } from 'antd'; // Import Spin
import { UploadOutlined } from '@ant-design/icons';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { imageDB } from "../../Firebasse/Config";
import { useDispatch } from 'react-redux';
import { CreateDocumentActionAsync } from '../../Redux/ReducerAPI/DocumentReducer';
import moment from 'moment';
import { AgencySubmitTaskActionAsync } from '../../Redux/ReducerAPI/WorkReducer';
import { USER_LOGIN } from '../../Utils/Interceptors';
import { getDataJSONStorage } from '../../Utils/UtilsFunction';
import { message } from 'antd';

const CreateEducationalOperationLicenseModal = ({ visible, onClose, onRefreshTasks, taskId }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [fileUrl, setFileUrl] = useState(null);
    const [loading, setLoading] = useState(false); // Local loading state
    const agencyId = getDataJSONStorage(USER_LOGIN).agencyId
    const currentTaskId = taskId;


    const handleOk = async () => {
        setLoading(true);
        try {
            const values = await form.validateFields();
            const documentData = {
                title: values.title,
                urlFile: fileUrl,
                expirationDate: values.expirationDate ? values.expirationDate.format('YYYY-MM-DD') : null,
                documentType: "EducationalOperationLicense",
                agencyId: agencyId, // Use the passed agencyId
            };
            const data = await dispatch(CreateDocumentActionAsync(documentData));
            if (data === true) {
                console.log("currentTaskId", currentTaskId)
                await dispatch(AgencySubmitTaskActionAsync(currentTaskId, fileUrl));
            }
            onClose();
            onRefreshTasks();
            form.resetFields();
        } catch (error) {
            console.error("Error creating agreement: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async ({ file, onSuccess, onError }) => {
        const storageRef = ref(imageDB, `files/${file.name}`);
        try {
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setFileUrl(url);
            onSuccess(null, file);
        } catch (error) {
            console.error("Upload error: ", error);
            onError(error);
            message.error("Tải tài liệu thất bại");
        }
    };

    return (
        <Modal
            title="Thêm mới Giấy Phép Hoạt Động Giáo Dục"
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose} disabled={loading}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk} disabled={loading}>
                    Thêm mới
                </Button>,
            ]}
        >
            <Spin spinning={loading}>
                <Form form={form} layout="vertical">
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
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            disabledDate={(current) => current && current < moment().endOf('day')}
                        />
                    </Form.Item>
                    <Form.Item
                        name="file"
                        label="File hợp đồng"
                        rules={[{ required: true, message: 'Vui lòng upload file' }]}
                    >
                        <Upload
                            name="file"
                            customRequest={handleUpload}
                            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Thêm file</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default CreateEducationalOperationLicenseModal;