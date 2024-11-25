import React, { useState, useEffect } from 'react';
import { Modal, Form, Upload, Button, DatePicker, Input, InputNumber } from 'antd';
import ReactQuill from 'react-quill';
import styled from 'styled-components';
import { quillFormats, quillModules } from '../../TextEditorConfig/Config';
import { UploadOutlined } from "@ant-design/icons";
import { imageDB } from "../../Firebasse/Config";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import moment from 'moment';
import CreateAgreementModal from './CreateAgreementModal';
import CreateBusinessRegistrationModal from './CreateBusinessRegistrationModal';
import CreateSignedContractModal from './CreateSignedContractModal';
import UploadEquipmentFileModal from './UploadEquipmentFileModal';
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
    const [imageUrls, setImageUrls] = useState([]);
    const [file, setFile] = useState(null);
    const [modalCreateAgreementVisible, setModalCreateAgreementVisible] = useState(false);
    const [modalCreateBusinessRegistrationVisible, setModalCreateBusinessRegistrationVisible] = useState(false);
    const [modalCreateSignedContractVisible, setModalCreateSignedContractVisible] = useState(false);
    const [modalUploadEquipmentFileVisible, setModalUploadEquipmentFileVisible] = useState(false);
    const dispatch = useDispatch();
    const { taskDetail } = useSelector((state) => state.WorkReducer);
    const { setLoading } = useLoading();

    useEffect(() => {
        if (selectedTask) {
            dispatch(GetTaskDetailByIdActionAsync(selectedTask.id));
        }
    }, [selectedTask, dispatch]);

    const handleOk = () => {
        form.validateFields().then(values => {
            const formattedValues = {
                ...values,
                expirationDate: values.expirationDate ? values.expirationDate.format('YYYY-MM-DD') : null,
                startTime: values.startTime ? values.startTime.format('YYYY-MM-DD') : null,
                endTime: values.endTime ? values.endTime.format('YYYY-MM-DD') : null,
                revenueSharePercentage: parseFloat(values.revenueSharePercentage),
                imageUrls: imageUrls.length > 0 ? imageUrls : null,
                file: file || null,
                type: taskType
            };
            onSubmit(formattedValues);
        });
    };

    const handleUpload = async ({ file, onSuccess, onError }) => {
        if (taskType !== "Design" && !file.type.startsWith('image/')) {
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
        setFile(file);
    };

    return (
        <Modal
            title="Nộp báo cáo công việc"
            open={visible}
            onCancel={onClose}
            footer={[
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
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
                    {taskType === "Design" && (
                        <Button key="uploadEquipmentFile" type="primary" onClick={() => setModalUploadEquipmentFileVisible(true)}>
                            Tải file trang thiết bị
                        </Button>
                    )}
                </div>,
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button key="back" onClick={onClose}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        Thêm báo cáo
                    </Button>,
                </div>
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
                    label={taskType === "Design" ? "File đính kèm" : "File ảnh"}
                >
                    <Upload
                        name="reportImage"
                        listType="picture"
                        customRequest={handleUpload}
                        accept={taskType === "Design" ? "*" : "image/*"}
                    >
                        <Button icon={<UploadOutlined />}>{taskType === "Design" ? "Tải file" : "Tải hình ảnh"}</Button>
                    </Upload>
                </Form.Item>
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
            <UploadEquipmentFileModal
                visible={modalUploadEquipmentFileVisible}
                onClose={() => setModalUploadEquipmentFileVisible(false)}
                agencyId={taskDetail?.agencyId}
            />
        </Modal>
    );
};

export default SubmitTaskReportModal;