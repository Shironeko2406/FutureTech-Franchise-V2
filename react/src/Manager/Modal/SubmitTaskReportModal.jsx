import React, { useState, useEffect } from 'react';
import { Modal, Form, Upload, Button, DatePicker, Input, InputNumber } from 'antd';
import ReactQuill from 'react-quill';
import styled from 'styled-components';
import { quillFormats, quillModules } from '../../TextEditorConfig/Config';
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import { imageDB } from "../../Firebasse/Config";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import moment from 'moment';
import CreateAgreementModal from './CreateAgreementModal';
import CreateBusinessRegistrationModal from './CreateBusinessRegistrationModal';
import CreateSignedContractModal from './CreateSignedContractModal';
import CreateEducationalOperationLicenseModal from './CreateEducationalOperationLicenseModal';
import { useDispatch, useSelector } from 'react-redux';
import { GetTaskDetailByIdActionAsync } from '../../Redux/ReducerAPI/WorkReducer';
import { useLoading } from '../../Utils/LoadingContext';

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
    const [fileEquipment, setFileEquipment] = useState([]);
    const [file, setFile] = useState(null);
    const [modalCreateAgreementVisible, setModalCreateAgreementVisible] = useState(false);
    const [modalCreateBusinessRegistrationVisible, setModalCreateBusinessRegistrationVisible] = useState(false);
    const [modalCreateSignedContractVisible, setModalCreateSignedContractVisible] = useState(false);
    const [modalCreateEducationalOperationLicenseVisible, setModalCreateEducationalOperationLicenseVisible] = useState(false);
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

            if (taskType === "Design" && fileEquipment) {
                formattedValues.equipmentFile = fileEquipment; // Pass the equipment file separately
            }

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

    const handleUploadFileEquipment = async ({ file, onSuccess, onError }) => {
        setFileEquipment(file);
        onSuccess(null, file);
    };

    const downloadSampleFile = () => {
        const link = document.createElement('a');
        link.href = '/Equipment.xlsx';
        link.download = 'Equipment.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                            Tải file mẫu
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
                <Form.Item
                    name="reportFileURL"
                    label={taskType === "Design" ? "File thiết kế" : "File đính kèm"}
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
                {taskType === "Design" && (
                    <Form.Item
                        name="equipmentFile"
                        label="File trang thiết bị"
                    >
                        <Upload
                            name="equipmentFile"
                            customRequest={handleUploadFileEquipment}
                            accept=".xls,.xlsx"
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Tải file trang thiết bị</Button>
                        </Upload>
                    </Form.Item>
                )}
                {taskType === "AgreementSigned" && (
                    <Button key="createAgreement" type="primary" onClick={() => setModalCreateAgreementVisible(true)}>
                        Thêm mới Thỏa Thuận Nguyên Tắc
                    </Button>
                )}
                {taskType === "BusinessRegistered" && (
                    <Button key="createBusinessRegistration" type="primary" onClick={() => setModalCreateBusinessRegistrationVisible(true)}>
                        Thêm mới Giấy Đăng Ký Doanh Nghiệp
                    </Button>
                )}
                {taskType === "SignedContract" && (
                    <Button key="createSignedContract" type="primary" onClick={() => setModalCreateSignedContractVisible(true)}>
                        Thêm mới Hợp đồng Chuyển nhượng
                    </Button>
                )}
                {taskType === "EducationLicenseRegistered" && (
                    <Button key="createEducationalOperationLicense" type="primary" onClick={() => setModalCreateEducationalOperationLicenseVisible(true)}>
                        Thêm mới giấy phép đăng ký giáo dục
                    </Button>
                )}
            </Form>
            <CreateAgreementModal
                visible={modalCreateAgreementVisible}
                onClose={() => setModalCreateAgreementVisible(false)}
                agencyId={taskDetail?.agencyId}
            />
            <CreateBusinessRegistrationModal
                visible={modalCreateBusinessRegistrationVisible}
                onClose={() => setModalCreateBusinessRegistrationVisible(false)}
                agencyId={taskDetail?.agencyId}
            />
            <CreateSignedContractModal
                visible={modalCreateSignedContractVisible}
                onClose={() => setModalCreateSignedContractVisible(false)}
                agencyId={taskDetail?.agencyId}
            />

            <CreateEducationalOperationLicenseModal
                visible={modalCreateEducationalOperationLicenseVisible}
                onClose={() => setModalCreateEducationalOperationLicenseVisible(false)}
                agencyId={taskDetail?.agencyId}
            />
        </Modal>
    );
};

export default SubmitTaskReportModal;