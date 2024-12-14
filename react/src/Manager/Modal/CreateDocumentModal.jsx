import React, { useState, useRef } from 'react';
import { Modal, Form, Input, DatePicker, Button, Upload, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { CreateDocumentActionAsync } from '../../Redux/ReducerAPI/DocumentReducer';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { imageDB } from "../../Firebasse/Config";
import { useLoading } from '../../Utils/LoadingContext';
import dayjs from 'dayjs';

const CreateDocumentModal = ({ visible, onClose, agencyData }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const uploadedDocumentFileURLRef = useRef(null);
    const { setLoading } = useLoading();
    const [isSaving, setIsSaving] = useState(false);

    const handleUploadDocumentFile = async ({ file, onSuccess, onError }) => {
        const storageRef = ref(imageDB, `files/${file.name}`);
        try {
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            uploadedDocumentFileURLRef.current = url;
            onSuccess({ url }, file);
        } catch (error) {
            console.error("Upload error: ", error);
            onError(error);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setLoading(true);
        try {
            const values = await form.validateFields();
            const formattedValues = {
                ...values,
                expirationDate: values.expirationDate ? values.expirationDate.format('YYYY-MM-DD') : null,
                urlFile: uploadedDocumentFileURLRef.current,
                documentType: values.documentType,
                agencyId: values.agencyId,
            };
            await dispatch(CreateDocumentActionAsync(formattedValues));
            onClose();
        } catch (error) {
            console.error("Error creating document: ", error);
        } finally {
            setIsSaving(false);
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Tạo tài liệu"
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose} disabled={isSaving}>Hủy</Button>,
                <Button key="save" type="primary" onClick={handleSave} loading={isSaving}>Lưu</Button>,
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
                    name="expirationDate"
                    label="Ngày hết hạn"
                >
                    <DatePicker
                        style={{ width: '100%' }}
                        format="YYYY-MM-DD"
                        disabledDate={(current) => current && current < dayjs().startOf('day')}
                    />
                </Form.Item>
                <Form.Item
                    name="documentType"
                    label="Loại tài liệu"
                    rules={[{ required: true, message: 'Vui lòng chọn loại tài liệu' }]}
                >
                    <Select placeholder="Chọn loại tài liệu">
                        <Select.Option value="AgreementContract">Hợp đồng thỏa thuận</Select.Option>
                        <Select.Option value="BusinessLicense">Giấy phép kinh doanh</Select.Option>
                        <Select.Option value="EducationalOperationLicense">Giấy phép hoạt động giáo dục</Select.Option>
                        <Select.Option value="Handover">Giấy nghiệm thu</Select.Option>
                        <Select.Option value="Other">Giấy tờ khác</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="agencyId"
                    label="Chi nhánh"
                    rules={[{ required: true, message: 'Vui lòng chọn chi nhánh' }]}
                >
                    <Select placeholder="Chọn chi nhánh">
                        {agencyData.map((agency) => (
                            <Select.Option key={agency.id} value={agency.id}>
                                {agency.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="urlFile"
                    label="Tài liệu"
                    rules={[{ required: true, message: 'Vui lòng upload tài liệu' }]}
                >
                    <Upload
                        name="documentFile"
                        customRequest={handleUploadDocumentFile}
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

export default CreateDocumentModal;