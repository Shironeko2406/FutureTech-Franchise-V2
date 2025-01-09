import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, Button, Upload, message, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { GetPackageActionAsync } from '../../Redux/ReducerAPI/PackageReducer';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { imageDB } from "../../Firebasse/Config";
import { CreateSignedContractActionAsync, CreateCustomPackageActionAsync } from '../../Redux/ReducerAPI/ContractReducer';
import moment from 'moment';

const { Option } = Select;

const CreateContractModal = ({ visible, onClose, agencyId, onContractCreated }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const packageTicket = useSelector(state => state.PackageReducer.packageTicket);
    const [loading, setLoading] = useState(false);
    const [isCustomPackage, setIsCustomPackage] = useState(false);
    const [customPackagePrice, setCustomPackagePrice] = useState('');

    useEffect(() => {
        dispatch(GetPackageActionAsync());
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

            if (isCustomPackage) {
                const customPackageData = {
                    ...contractData,
                    createPackageModel: {
                        name: values.customPackageName,
                        description: values.customPackageDescription,
                        price: parseFloat(values.customPackagePrice),
                        numberOfUsers: parseInt(values.customPackageNumberOfUsers, 10),
                        status: "Custom",
                    },
                };
                await dispatch(CreateCustomPackageActionAsync(customPackageData));
            } else {
                await dispatch(CreateSignedContractActionAsync(contractData));
            }

            onContractCreated();
            onClose();
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

    const handlePackageChange = (value) => {
        setIsCustomPackage(value === 'custom');
    };

    const handleCustomPackagePriceChange = (e) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) { // Allow integers and decimals
            setCustomPackagePrice(value);
            form.setFieldsValue({ customPackagePrice: value });
        }
    };

    return (
        <Modal
            title="Tạo hợp đồng"
            style={{ top: 20 }}
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose} disabled={loading}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={form.submit} disabled={loading}>
                    Tạo
                </Button>
            ]}
        >
            <Spin spinning={loading}>
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
                        <Input placeholder="Nhập tiêu đề" />
                    </Form.Item>
                    <Form.Item name="startTime" label="Ngày bắt đầu" rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}>
                        <DatePicker
                            style={{ width: '100%' }}
                            format="YYYY-MM-DD"
                            disabledDate={(current) => current && current < moment().startOf('day')}
                        />
                    </Form.Item>
                    <Form.Item name="endTime" label="Ngày kết thúc" rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}>
                        <DatePicker
                            style={{ width: '100%' }}
                            format="YYYY-MM-DD"
                            disabledDate={(current) => current && current <= form.getFieldValue('startTime')}
                        />
                    </Form.Item>
                    <Form.Item
                        name="depositPercentage"
                        label="Phần trăm trả trước"
                        rules={[
                            { required: true, message: 'Vui lòng nhập phần trăm trả trước' },
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
                        <Input placeholder="Nhập phần trăm trả trước" addonAfter="%" />
                    </Form.Item>
                    <Form.Item
                        name="revenueSharePercentage"
                        label="Tỷ lệ chia sẻ doanh thu"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tỷ lệ chia sẻ doanh thu' },
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
                        <Input placeholder="Nhập tỷ lệ chia sẻ doanh thu" addonAfter="%" />
                    </Form.Item>
                    <Form.Item name="packageId" label="Gói" rules={[{ required: true, message: 'Vui lòng chọn gói' }]}>
                        <Select placeholder="Chọn gói" onChange={handlePackageChange}>
                            {packageTicket.map(pkg => (
                                <Option key={pkg.id} value={pkg.id}>
                                    {pkg.name} - {Number(pkg.price).toLocaleString('vi-VN')} VND - {pkg.numberOfUsers} người dùng
                                </Option>
                            ))}
                            <Option value="custom">Tạo gói tùy chỉnh</Option>
                        </Select>
                    </Form.Item>
                    {isCustomPackage && (
                        <>
                            <Form.Item name="customPackageName" label="Tên gói" rules={[{ required: true, message: 'Vui lòng nhập tên gói' }]}>
                                <Input placeholder="Nhập tên gói" />
                            </Form.Item>
                            <Form.Item name="customPackageDescription" label="Mô tả gói" rules={[{ required: true, message: 'Vui lòng nhập mô tả gói' }]}>
                                <Input placeholder="Nhập mô tả gói" />
                            </Form.Item>
                            <Form.Item
                                name="customPackagePrice"
                                label="Giá gói"
                                rules={[{ required: true, message: 'Vui lòng nhập giá gói' }]}
                            >
                                <Input type="text" onChange={handleCustomPackagePriceChange} placeholder="Nhập giá gói" />
                                {customPackagePrice && (
                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <span>Giá gói: {Number(customPackagePrice).toLocaleString('vi-VN')} VND</span>
                                    </Form.Item>
                                )}
                            </Form.Item>
                            <Form.Item name="customPackageNumberOfUsers" label="Số lượng người dùng" rules={[{ required: true, message: 'Vui lòng nhập số lượng người dùng' }]}>
                                <Input type="number" placeholder="Nhập số lượng người dùng" />
                            </Form.Item>
                        </>
                    )}
                    <Form.Item name="contractDocumentImageURL" label="Tài liệu hợp đồng" rules={[{ required: true, message: 'Vui lòng tải lên tài liệu hợp đồng' }]}>
                        <Upload
                            customRequest={handleFileChange}
                            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Tải lên tài liệu</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default CreateContractModal;
