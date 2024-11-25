import React, { useState } from 'react';
import { Modal, Form, Upload, Button } from 'antd';
import ReactQuill from 'react-quill';
import styled from 'styled-components';
import { quillFormats, quillModules } from '../../TextEditorConfig/Config';
import { UploadOutlined } from "@ant-design/icons";
import { imageDB } from "../../Firebasse/Config";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

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

const SubmitTaskReportModal = ({ visible, onClose, onSubmit }) => {
    const [form] = Form.useForm();
    const [imageUrls, setImageUrls] = useState([]);

    const handleOk = () => {
        form.validateFields().then(values => {
            onSubmit({ ...values, imageUrls });
        });
    };

    const handleUpload = async ({ file, onSuccess, onError }) => {
        if (!file.type.startsWith('image/')) {
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
    };

    return (
        <Modal
            title="Nộp báo cáo công việc"
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
            <Form form={form} layout="vertical">
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
                    label="File ảnh"
                    rules={[{ required: true, message: 'Vui lòng upload file' }]}
                >
                    <Upload
                        name="reportImage"
                        listType="picture"
                        multiple
                        customRequest={handleUpload}
                        accept="image/*" // Only allow image files
                    >
                        <Button icon={<UploadOutlined />}>Upload Image</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SubmitTaskReportModal;