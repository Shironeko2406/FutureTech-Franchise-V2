import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, InputNumber, Button, Upload } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { imageDB } from "../../Firebasse/Config";
import { useDispatch } from 'react-redux';
import { CreateSignedContractActionAsync, DownloadSampleContractActionAsync } from '../../Redux/ReducerAPI/ContractReducer';
import { useLoading } from '../../Utils/LoadingContext';

const CreateSignedContractModal = ({ visible, onClose, agencyId }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [file, setFile] = useState(null);
    const { setLoading } = useLoading();
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);

    const handleOk = async () => {
        setUploadLoading(true);
        try {
            const values = await form.validateFields();
            const storageRef = ref(imageDB, `documents/${file.name}`);
            await uploadBytes(storageRef, file);
            const fileURL = await getDownloadURL(storageRef);
            const contractData = {
                title: values.title,
                startTime: values.startTime.format('YYYY-MM-DD'),
                endTime: values.endTime.format('YYYY-MM-DD'),
                contractDocumentImageURL: fileURL,
                revenueSharePercentage: parseFloat(values.revenueSharePercentage),
                agencyId: agencyId, // Use the passed agencyId
            };
            await dispatch(CreateSignedContractActionAsync(contractData));
            onClose();
        } catch (error) {
            console.error("Error creating signed contract: ", error);
        } finally {
            setUploadLoading(false);
        }
    };

    const handleUpload = async ({ file, onSuccess, onError }) => {
        if (!file.type.startsWith('application/')) {
            onError(new Error('Only document files are allowed!'));
            return;
        }
        setFile(file);
        onSuccess(null, file);
    };

    const downloadSampleContract = async () => {
        setDownloadLoading(true);
        await dispatch(DownloadSampleContractActionAsync(agencyId));
        setDownloadLoading(false);
    };

    return (
        <Modal
            title="Thêm mới Hợp đồng Chuyển nhượng"
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="downloadSample" icon={<DownloadOutlined />} onClick={downloadSampleContract} loading={downloadLoading}>
                    Tải file mẫu
                </Button>,
                <Button key="back" onClick={onClose}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk} loading={uploadLoading}>
                    Thêm mới
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
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
                        {
                            pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
                            message: "Vui lòng nhập số thực hợp lệ (VD: 10.5).",
                        },
                        {
                            validator: (_, value) => {
                                if (!value || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("Phần trăm phải nằm trong khoảng 0 đến 100!"));
                            },
                        },
                    ]}
                >
                    <Input min={0} max={100} placeholder="Nhập tỉ lệ phần trăm. VD: 10.5)" addonAfter="%" style={{ width: '100%' }} />
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
                        <Button icon={<UploadOutlined />}>Tải tài liệu</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateSignedContractModal;