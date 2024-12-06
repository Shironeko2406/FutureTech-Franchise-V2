import React, { useEffect, useRef, useState } from 'react';
import { Modal, Form, Input, DatePicker, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { UpdateDocumentActionAsync } from '../../Redux/ReducerAPI/DocumentReducer';
import dayjs from 'dayjs';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { imageDB } from "../../Firebasse/Config";
import { useLoading } from '../../Utils/LoadingContext';

const EditDocumentModal = ({ visible, onClose, document }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const uploadedDocumentFileURLRef = useRef(null);
    const { setLoading } = useLoading();

    useEffect(() => {
        if (document) {
            form.setFieldsValue({
                title: document.title,
                expirationDate: document.expirationDate ? dayjs(document.expirationDate) : null,
                urlFile: document.urlFile ? [{
                    uid: '-1',
                    name: 'Tệp tài liệu hiện tại',
                    status: 'done',
                    url: document.urlFile,
                }] : [],
            });
        }
    }, [document, form]);

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
        setLoading(true);
        try {
            const values = await form.validateFields();
            const formattedValues = {
                ...values,
                expirationDate: values.expirationDate ? values.expirationDate.format('YYYY-MM-DD') : null,
                urlFile: uploadedDocumentFileURLRef.current || (values.urlFile && values.urlFile[0] ? values.urlFile[0].url : document?.urlFile),
                type: document.type,
            };
            await dispatch(UpdateDocumentActionAsync(document.id, formattedValues));
            onClose();
        } catch (error) {
            console.error("Error saving document: ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Chỉnh sửa tài liệu"
            visible={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose} >Hủy</Button>,
                <Button key="save" type="primary" onClick={handleSave} >Lưu</Button>,
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
                    rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn' }]}
                >
                    <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
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
                        defaultFileList={document?.urlFile ? [{
                            uid: '-1',
                            name: 'Tệp tài liệu hiện tại',
                            status: 'done',
                            url: document.urlFile,
                        }] : []}
                    >
                        <Button icon={<UploadOutlined />}>Tải tài liệu</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditDocumentModal;