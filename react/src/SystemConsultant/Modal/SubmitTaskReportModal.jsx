import React, { useState, useEffect } from 'react';
import { Modal, Form, Upload, Button, DatePicker, Input, InputNumber } from 'antd';
import ReactQuill from 'react-quill';
import styled from 'styled-components';
import { quillFormats, quillModules } from '../../TextEditorConfig/Config';
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import { imageDB } from "../../Firebasse/Config";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { useDispatch, useSelector } from 'react-redux';
import { GetTaskDetailByIdActionAsync } from '../../Redux/ReducerAPI/WorkReducer';

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

const SubmitTaskReportModal = ({ visible, onClose, onSubmit, taskType, selectedTask }) => {
    const [form] = Form.useForm();
    const [file, setFile] = useState(null);
    const dispatch = useDispatch();
    const { taskDetail } = useSelector((state) => state.WorkReducer);

    useEffect(() => {
        if (selectedTask) {
            dispatch(GetTaskDetailByIdActionAsync(selectedTask.id));
        }
    }, [selectedTask, dispatch]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            let formattedValues = {
                ...values,
                expirationDate: values.expirationDate ? values.expirationDate.format('YYYY-MM-DD') : null,
                startTime: values.startTime ? values.startTime.format('YYYY-MM-DD') : null,
                endTime: values.endTime ? values.endTime.format('YYYY-MM-DD') : null,
                revenueSharePercentage: parseFloat(values.revenueSharePercentage),
                reportImageURL: file ? file.url : null, // Use fileUrl to store the URL
                type: taskType
            };

            onSubmit(formattedValues);
        } catch (error) {
            console.error("Error submitting task report: ", error);
        }
    };

    const handleUpload = async ({ file, onSuccess, onError }) => {
        const storageRef = ref(imageDB, `files/${file.name}`);
        try {
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setFile({ url, name: file.name }); // Store file name and URL
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
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <div style={{ display: 'flex', gap: '7px' }}>
                        <Button key="back" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button key="submit" type="primary" onClick={handleOk}>
                            Thêm báo cáo
                        </Button>
                    </div>
                </div>
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="report"
                    label="Báo cáo"
                    rules={[
                        { required: true, message: 'Vui lòng nhập báo cáo' },
                        { max: 10000, message: 'Báo cáo không được vượt quá 10000 chữ' }
                    ]}
                >
                    <StyledQuill
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Nhập báo cáo công việc"
                        style={{ minHeight: '200px' }}
                    />
                </Form.Item>
                <Form.Item
                    name="reportFileURL"
                    label={"File đính kèm"}
                >
                    <Upload
                        name="reportFile"
                        customRequest={handleUpload}
                        accept="*"
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>Tải file</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SubmitTaskReportModal;