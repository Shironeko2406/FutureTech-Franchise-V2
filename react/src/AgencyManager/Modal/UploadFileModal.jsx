import React, { useState, useEffect } from 'react';
import { Modal, Upload, Button, message, Spin } from 'antd';
import { UploadOutlined, EyeOutlined } from '@ant-design/icons';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { useDispatch, useSelector } from 'react-redux';
import { GetTaskDetailByIdActionAsync, AgencySubmitTaskActionAsync } from '../../Redux/ReducerAPI/WorkReducer';
import { imageDB } from "../../Firebasse/Config";
import ShowReportModal from './ShowReportModal';

const UploadFileModal = ({ visible, onClose, task, onRefreshTasks }) => {
    const [fileUrl, setFileUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalShowReportVisible, setModalShowReportVisible] = useState(false);
    const dispatch = useDispatch();
    const { taskDetail } = useSelector((state) => state.WorkReducer);

    useEffect(() => {
        if (visible && task?.id) {
            dispatch(GetTaskDetailByIdActionAsync(task.id));
        }
    }, [visible, task, dispatch]);

    const handleUpload = async ({ file, onSuccess, onError }) => {
        const storageRef = ref(imageDB, `files/${file.name}`);
        try {
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setFileUrl(url);
            onSuccess(null, file);
        } catch (error) {
            console.error("Upload error: ", error);
            onError(error);
            message.error("Tải tài liệu thất bại");
        }
    };

    const handleSubmit = async () => {
        if (!fileUrl) {
            message.error("Vui lòng chọn file để tải lên");
            return;
        }
        setLoading(true);
        const success = await dispatch(AgencySubmitTaskActionAsync(taskDetail.id, fileUrl));
        setLoading(false);
        if (success) {
            message.success("Nộp tài liệu thành công");
            onClose();
            onRefreshTasks();
        }
    };

    const openDocumentShow = () => {
        setModalShowReportVisible(true);
    };

    const handleCloseModalShowReport = () => {
        setModalShowReportVisible(false);
    };

    return (
        <>
            <Modal
                title="Tải giấy thỏa thuận đã ký"
                open={visible}
                onCancel={onClose}
                onOk={handleSubmit}
                okText="Nộp"
                cancelText="Hủy"
                footer={[
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Button key="view" type="primary" icon={<EyeOutlined />} onClick={openDocumentShow}>
                            Xem tài liệu
                        </Button>
                        <div>
                            <Button key="cancel" onClick={onClose} style={{ marginRight: '8px' }}>
                                Hủy
                            </Button>
                            <Button key="submit" type="primary" onClick={handleSubmit} loading={loading}>
                                Nộp
                            </Button>
                        </div>
                    </div>
                ]}
            >
                <Spin spinning={loading}>
                    <div style={{ margin: '25px 0px' }}>
                        <Upload
                            customRequest={handleUpload}
                            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        >
                            <Button icon={<UploadOutlined />}>Chọn file</Button>
                        </Upload>
                    </div>
                </Spin>
            </Modal>
            <ShowReportModal
                visible={modalShowReportVisible}
                onClose={handleCloseModalShowReport}
                taskId={taskDetail?.id}
                taskType={taskDetail?.type}
                agencyId={taskDetail?.agencyId}
            />
        </>
    );
};

export default UploadFileModal;