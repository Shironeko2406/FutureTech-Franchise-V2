import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, Button, Upload, message, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPackages } from '../../Redux/ReducerAPI/PackageReducer';
import { httpClient } from '../../Utils/Interceptors';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { imageDB } from "../../Firebasse/Config";

const { Option } = Select;

const CreateContractModal = ({ visible, onClose, agencyId }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const packages = useSelector(state => state.PackageReducer.packages);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        dispatch(fetchPackages());
    }, [dispatch]);

    const handleUpload = async (file) => {
        const storageRef = ref(imageDB, `contracts/${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const contractDocumentImageURL = await handleUpload(values.contractDocumentImageURL.file);
            const contractData = {
                ...values,
                contractDocumentImageURL,
                agencyId,
            };
            const response = await httpClient.put("/api/v1/contracts", contractData);
            if (response.isSuccess) {
                message.success("Tạo hợp đồng thành công!");
                onClose();
            } else {
                message.error(response.message);
            }
        } catch (error) {
            message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = ({ file, onSuccess, onError }) => {
        if (!file.type.startsWith('application/')) {
            onError(new Error('Only document files are allowed!'));
            return;
        }
        onSuccess(null, file);
    };

    return (
        <Modal
            visible={visible}
            title="Tạo hợp đồng"
            onCancel={onClose}
            footer={null}
        >
            <Spin spinning={loading}>
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="startTime" label="Ngày bắt đầu" rules={[{ required: true }]}>
                        <DatePicker showTime />
                    </Form.Item>
                    <Form.Item name="endTime" label="Ngày kết thúc" rules={[{ required: true }]}>
                        <DatePicker showTime />
                    </Form.Item>
                    <Form.Item name="depositPercentage" label="Phần trăm trả trước" rules={[{ required: true }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="revenueSharePercentage" label="Tỷ lệ chia sẻ doanh thu" rules={[{ required: true }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="packageId" label="Gói" rules={[{ required: true }]}>
                        <Select>
                            {packages.map(pkg => (
                                <Option key={pkg.id} value={pkg.id}>
                                    {pkg.name} - {pkg.price} VND - {pkg.numberOfUsers} người dùng
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="contractDocumentImageURL" label="Tài liệu hợp đồng" rules={[{ required: true }]}>
                        <Upload
                            customRequest={handleFileChange}
                            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Tải lên tài liệu</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Tạo hợp đồng
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default CreateContractModal;
