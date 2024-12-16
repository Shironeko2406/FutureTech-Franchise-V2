import React, { useState, useEffect } from 'react';
import { Modal, Form, Upload, Button, Input, Typography, message } from 'antd';
import ReactQuill from 'react-quill';
import styled from 'styled-components';
import { quillFormats, quillModules } from '../../TextEditorConfig/Config';
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import { imageDB } from "../../Firebasse/Config";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { useDispatch, useSelector } from 'react-redux';
import { GetTaskDetailByIdActionAsync } from '../../Redux/ReducerAPI/WorkReducer';

const { Text } = Typography;

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

const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
};

const SubmitTaskReportModal = ({ visible, onClose, onSubmit, taskType, selectedTask }) => {
    const [form] = Form.useForm();
    const [fileEquipment, setFileEquipment] = useState(null);
    const [file, setFile] = useState(null);
    const [designFee, setDesignFee] = useState("");
    const [formattedDesignFee, setFormattedDesignFee] = useState("");
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
            if (taskType === "Design") {
                if ((designFee && !file)) {
                    message.error('Hãy tải lên file thiết kế nếu nhập giá tiền!');
                    return;
                }
                if (file && !designFee) {
                    message.error('Hãy nhập giá tiền nếu đã tải lên file thiết kế!');
                    return;
                }
            }
            let formattedValues = {
                ...values,
                expirationDate: values.expirationDate ? values.expirationDate.format('YYYY-MM-DD') : null,
                startTime: values.startTime ? values.startTime.format('YYYY-MM-DD') : null,
                endTime: values.endTime ? values.endTime.format('YYYY-MM-DD') : null,
                revenueSharePercentage: parseFloat(values.revenueSharePercentage),
                reportImageURL: file ? file.url : null,
                type: taskType
            };

            if (taskType === "Design" && fileEquipment) {
                formattedValues.equipmentFile = fileEquipment;
            }
            if (taskType === "Design" && designFee) {
                formattedValues.designFee = designFee;
            }

            console.log("formattedValues: ", formattedValues);
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

    const handleRemoveFile = () => {
        setFile(null);
    };

    const handleUploadFileEquipment = async ({ file, onSuccess, onError }) => {
        setFileEquipment(file);
        onSuccess(null, file);
    };

    const handleRemoveFileEquipment = () => {
        setFileEquipment(null);
    };

    const downloadSampleFile = () => {
        const link = document.createElement('a');
        link.href = '/Equipment.xlsx';
        link.download = 'Equipment.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDesignFeeChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) { // Only allow integers
            setDesignFee(value);
            setFormattedDesignFee(formatCurrency(value));
        }
    };

    return (
        <Modal
            title="Nộp báo cáo công việc"
            open={visible}
            onCancel={onClose}
            footer={[
                <div style={{ display: 'flex', justifyContent: taskType === "Design" ? 'space-between' : 'flex-end', width: '100%' }}>
                    {taskType === "Design" && (
                        <Button key="downloadSample" icon={<DownloadOutlined />} onClick={downloadSampleFile} type="primary">
                            Tải file trang thiết bị mẫu
                        </Button>
                    )}
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
                {taskType === "Design" && (
                    <>
                        <Form.Item
                            name="reportFileURL"
                            label="File thiết kế"
                            style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginRight: '16px' }}
                        >
                            <Upload
                                name="reportFile"
                                customRequest={handleUpload}
                                onRemove={handleRemoveFile}
                                accept="*"
                                maxCount={1}
                            >
                                <Button icon={<UploadOutlined />}>Thêm file</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item
                            label="Giá tiền thiết kế"
                            name="designFee"
                            rules={[
                                { pattern: /^\d+$/, message: "Vui lòng nhập số nguyên" }
                            ]}
                            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                        >
                            <Input type="text" onChange={handleDesignFeeChange} placeholder="Ví dụ 5 triệu đồng: 5000000" />
                            {formattedDesignFee && (
                                <Form.Item style={{ marginBottom: 0 }}>
                                    <Text type="secondary">Giá tiền thiết kế: {formattedDesignFee}</Text>
                                </Form.Item>
                            )}
                        </Form.Item>
                        <Form.Item
                            name="equipmentFile"
                            label="File trang thiết bị"
                        >
                            <Upload
                                name="equipmentFile"
                                customRequest={handleUploadFileEquipment}
                                onRemove={handleRemoveFileEquipment}
                                accept=".xls,.xlsx"
                                maxCount={1}
                            >
                                <Button icon={<UploadOutlined />}>Thêm file trang thiết bị</Button>
                            </Upload>
                        </Form.Item>
                    </>
                )}
                {taskType !== "Design" && (
                    <Form.Item
                        name="reportFileURL"
                        label="File đính kèm"
                    >
                        <Upload
                            name="reportFile"
                            customRequest={handleUpload}
                            onRemove={handleRemoveFile}
                            accept="*"
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Thêm file</Button>
                        </Upload>
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
};

export default SubmitTaskReportModal;