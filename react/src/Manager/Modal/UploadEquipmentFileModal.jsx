import React, { useState } from 'react';
import { Modal, Form, Upload, Button } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { CreateEquipmentActionAsync } from '../../Redux/ReducerAPI/EquipmentReducer';
import { useLoading } from '../../Utils/LoadingContext';

const UploadEquipmentFileModal = ({ visible, onClose, agencyId }) => {
    const [form] = Form.useForm();
    const [file, setFile] = useState(null);
    const dispatch = useDispatch();
    const { setLoading, loading } = useLoading();

    const handleOk = async () => {
        setLoading(true);
        try {
            const values = await form.validateFields();
            const formData = new FormData();
            formData.append('file', file);
            await dispatch(CreateEquipmentActionAsync(agencyId, formData));
            onClose();
        } catch (error) {
            console.error("Error uploading equipment file: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async ({ file, onSuccess, onError }) => {
        setLoading(true);
        if (!file.type.startsWith('application/vnd.ms-excel') && !file.type.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
            onError(new Error('Only Excel files are allowed!'));
            setLoading(false);
            return;
        }
        setFile(file);
        onSuccess(null, file);
        setLoading(false);
    };

    const downloadSampleFile = () => {
        const link = document.createElement('a');
        link.href = '/path/to/Equipment.xlsx'; // Update this path to the actual location of the sample file
        link.download = 'Equipment.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Modal
            title="Tải file trang thiết bị"
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="downloadSample" icon={<DownloadOutlined />} onClick={downloadSampleFile}>
                    Tải file mẫu
                </Button>,
                <Button key="back" onClick={onClose}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk} loading={loading}>
                    Tải lên
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="equipmentFile"
                    label="File trang thiết bị"
                    rules={[{ required: true, message: 'Vui lòng upload file' }]}
                >
                    <Upload
                        name="equipmentFile"
                        customRequest={handleUpload}
                        accept=".xls,.xlsx"
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>Tải file trang thiết bị</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UploadEquipmentFileModal;