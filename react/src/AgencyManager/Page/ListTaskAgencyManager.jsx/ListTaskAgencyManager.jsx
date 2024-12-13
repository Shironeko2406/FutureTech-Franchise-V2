import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, List, Typography, Button, Tag } from 'antd';
import { UploadOutlined, EyeOutlined } from "@ant-design/icons";
import { CalendarOutlined, RightCircleOutlined, CheckCircleFilled, DownloadOutlined, CloseCircleFilled, MinusCircleFilled, FlagOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import moment from 'moment';
import DynamicFilter from '../../Component/DynamicFilter';
import { GetTaskUserByLoginActionAsync } from '../../../Redux/ReducerAPI/UserReducer';
import { GetTaskDetailByIdActionAsync, UpdateTaskStatusActionAsync, GetTaskForAgencyActionAsync } from '../../../Redux/ReducerAPI/WorkReducer';
import ShowReportModal from '../../Modal/ShowReportModal';
import ViewTaskDetailModal from '../../Modal/ViewTaskDetailModal';
import CreateAgreementModal from '../../Modal/CreateAgreementModal';
import CreateBusinessRegistrationModal from '../../Modal/CreateBusinessRegistrationModal';
import CreateSignedContractModal from '../../Modal/CreateSignedContractModal';
import CreateEducationalOperationLicenseModal from '../../Modal/CreateEducationalOperationLicenseModal';
import UploadFileModal from '../../Modal/UploadFileModal';
import { useLoading } from '../../../Utils/LoadingContext';

const { Title, Text } = Typography;

const CompulsoryTask = styled(List.Item)`
  background-color: #fff1f0 !important;
`;

const StatusTag = styled(Tag)`
  margin-right: 8px;
`;

const getStatusIcon = (status) => {
    const iconStyle = { fontSize: 24, color: getStatusColor(status) };
    switch (status) {
        case "Approved": return <CheckCircleFilled style={iconStyle} />;
        case "Rejected": return <CloseCircleFilled style={iconStyle} />;
        case "None":
        default: return <MinusCircleFilled style={iconStyle} />;
    }
};

const getStatusColor = (status) => {
    switch (status) {
        case "Approved": return '#52c41a';
        case "Rejected": return '#f5222d';
        case "None":
        default: return '#d9d9d9';
    }
};

const translateStatus = (status) => {
    const translations = {
        "Approved": "Đã duyệt",
        "Rejected": "Từ chối",
        "None": "Chưa xử lý",
    };
    return translations[status] || status;
};

const translateSubmitStatus = (submit) => {
    return submit === "Submited" ? "Người phụ trách đã nộp" : "Người phụ trách chưa nộp";
};

const getSubmitStatusColor = (submit) => {
    return submit === "Submited" ? '#1890ff' : '#faad14';
};

const ListTaskAgencyManager = () => {
    const { taskUser, totalPagesCount } = useSelector((state) => state.UserReducer);
    const dispatch = useDispatch();
    const { setLoading } = useLoading();
    const [filters, setFilters] = useState({
        searchText: '',
        levelFilter: '',
        statusFilter: 'None',
        submitFilter: 'None',
    });
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [modalShowTaskDetailVisible, setModalShowTaskDetailVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [taskType, setTaskType] = useState(null);
    const [modalShowReportVisible, setModalShowReportVisible] = useState(false);
    const [modalCreateAgreementVisible, setModalCreateAgreementVisible] = useState(false);
    const [modalCreateBusinessRegistrationVisible, setModalCreateBusinessRegistrationVisible] = useState(false);
    const [modalCreateSignedContractVisible, setModalCreateSignedContractVisible] = useState(false);
    const [modalCreateEducationalOperationLicenseVisible, setModalCreateEducationalOperationLicenseVisible] = useState(false);
    const [modalUploadFileVisible, setModalUploadFileVisible] = useState(false);
    const [taskToUpload, setTaskToUpload] = useState(null);

    const handleFilterChange = (key, value) => {
        setFilters(prevFilters => ({ ...prevFilters, [key]: value }));
        setPageIndex(1);
    };

    const handlePageChange = (page, pageSize) => {
        setPageIndex(page);
        setPageSize(pageSize);
    };

    console.log(taskUser)
    useEffect(() => {
        setLoading(true);
        dispatch(GetTaskForAgencyActionAsync(
            filters.searchText,
            filters.levelFilter,
            filters.statusFilter,
            filters.submitFilter,
            pageIndex,
            pageSize
        )).finally(() => setLoading(false));
    }, [filters, pageIndex, pageSize, dispatch]);

    const handleOpenModal = (taskType, task) => {
        if (taskType === "AgreementSigned") {
            setTaskToUpload(task);
            setModalUploadFileVisible(true);
        } else {
            switch (taskType) {
                case "BusinessRegistered":
                    setModalCreateBusinessRegistrationVisible(true);
                    setSelectedTask(task);
                    break;
                case "SignedContract":
                    setModalCreateSignedContractVisible(true);
                    setSelectedTask(task);
                    break;
                case "EducationLicenseRegistered":
                    setModalCreateEducationalOperationLicenseVisible(true);
                    setSelectedTask(task);
                    break;
                default:
                    console.warn("Loại công việc không xác định:", taskType);
                    break;
            }
        }
    };

    const openModalShowTaskDetail = (id) => {
        setModalShowTaskDetailVisible(true);
        dispatch(GetTaskDetailByIdActionAsync(id));
    };

    const handleCloseModalShowTaskDetail = () => {
        setModalShowTaskDetailVisible(false);
    };

    // const openModalSubmitTaskReport = (task) => {
    //     setSelectedTask(task);
    //     setTaskType(task.type);
    //     setModalSubmitTaskReportVisible(true);
    //     dispatch(GetTaskDetailByIdActionAsync(task.id)); // Fetch task details
    // };

    // const handleCloseModalSubmitTaskReport = () => {
    //     setModalSubmitTaskReportVisible(false);
    //     setSelectedTask(null);
    // };

    const openDocumentShow = (task) => {
        setSelectedTask(task);
        setTaskType(task.type);
        setModalShowReportVisible(true);
        dispatch(GetTaskDetailByIdActionAsync(task.id));
    };

    const handleCloseModalShowReport = () => {
        setModalShowReportVisible(false);
        setSelectedTask(null);
    };

    const handleRefreshTasks = () => {
        dispatch(GetTaskForAgencyActionAsync(
            filters.searchText,
            filters.levelFilter,
            filters.statusFilter,
            filters.submitFilter,
            pageIndex,
            pageSize
        ));
    };

    // const handleSubmitTaskReport = async (contractData) => {
    //     if (selectedTask) {
    //         setLoading(true);
    //         try {
    //             let formData = { ...contractData };
    //             if (contractData.type === "Design" && contractData.equipmentFile) {
    //                 const equipmentFormData = new FormData();
    //                 equipmentFormData.append('file', contractData.equipmentFile);
    //                 const equipmentResponse = await dispatch(CreateEquipmentActionAsync(selectedTask.agencyId, equipmentFormData));
    //                 if (!equipmentResponse) {
    //                     throw new Error("Error creating equipment");
    //                 }
    //             }
    //             await dispatch(CreateSignedContractActionAsync(formData));
    //             handleCloseModalSubmitTaskReport();
    //             await dispatch(GetTaskForAgencyActionAsync(
    //                 filters.searchText,
    //                 filters.levelFilter,
    //                 filters.statusFilter,
    //                 filters.submitFilter,
    //                 pageIndex,
    //                 pageSize
    //             ));
    //         } catch (error) {
    //             message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
    //             console.error("Error uploading file: ", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     }
    // };

    const handleUpdateTaskStatus = async (task) => {
        setLoading(true);
        const newStatus = task.submit === "Submited" ? "None" : "Submited";
        await dispatch(UpdateTaskStatusActionAsync(task.id, newStatus));
        await dispatch(GetTaskUserByLoginActionAsync(
            filters.searchText,
            filters.levelFilter,
            filters.statusFilter,
            filters.submitFilter,
            pageIndex,
            pageSize
        ));
        setLoading(false);
    };

    const renderItem = (task) => {
        const TaskItem = task.level === "Compulsory" ? CompulsoryTask : List.Item;
        const actions = [
            <Button
                type="text"
                style={{ color: "#1890ff" }}
                icon={<RightCircleOutlined />}
                onClick={() => openModalShowTaskDetail(task.id)}
            />
        ];

        const validTaskTypes = ["AgreementSigned", "BusinessRegistered", "SignedContract", "EducationLicenseRegistered"];
        if (task.level === "Compulsory" && validTaskTypes.includes(task.type) && task.customerSubmit === null) {
            actions.push(
                <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    onClick={() => handleOpenModal(task.type, task)}
                >
                    {task.type === "AgreementSigned" ? "Nộp tài liệu" : "Thêm giấy tờ"}
                </Button>
            );
        }

        if (task.type === "AgreementSigned" && task.submit === "Submited") {
            actions.push(
                <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => openDocumentShow(task)}
                >
                    Xem tài liệu
                </Button>
            );
        }

        if (task.type === "SignedContract" && task.submit === "Submited") {
            actions.push(
                <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => openDocumentShow(task)}
                >
                    Xem tài liệu
                </Button>
            );
        }


        if ((task.type === "AgreementSigned" || task.type === "SignedContract") && task.level === "Compulsory" && task.customerSubmit !== null) {
            actions.push(
                <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={() => window.open(task.customerSubmit, "_blank")}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Xem file đã tải
                </Button>
            );
            if (task.status !== "Approved") {
                actions.push(
                    <Button
                        type="primary"
                        icon={<UploadOutlined />}
                        onClick={() => handleOpenModal(task.type, task)}
                    >
                        Thêm file khác
                    </Button>
                );
            }
        }

        if (task.type === "BusinessRegistered" && task.level === "Compulsory" && task.customerSubmit !== null) {
            actions.push(
                <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => openDocumentShow(task)}
                >
                    Xem tài liệu đã tải
                </Button>
            );
        }

        if (task.type === "EducationLicenseRegistered" && task.level === "Compulsory" && task.customerSubmit !== null) {
            actions.push(
                <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => openDocumentShow(task)}
                >
                    Xem tài liệu đã tải
                </Button>
            );
        }

        return (
            <TaskItem
                style={{
                    backgroundColor: task.level === "Compulsory" ? "#fff1f0" : "#f0f5ff",
                    marginBottom: "8px",
                    borderRadius: "8px",
                    padding: "12px",
                }}
                key={task.id}
                actions={actions}
            >
                <List.Item.Meta
                    avatar={getStatusIcon(task.status)}
                    title={
                        <span>
                            {task.title}
                            {task.level === "Compulsory" && (
                                <>
                                    <FlagOutlined
                                        style={{ color: "#ff4d4f", marginLeft: "8px" }}
                                    />
                                    <Text type="danger" strong style={{ marginLeft: "4px" }}>
                                        (Quan trọng)
                                    </Text>
                                </>
                            )}
                        </span>
                    }
                    description={
                        <div>
                            <StatusTag color={getStatusColor(task.status)}>
                                {translateStatus(task.status).toUpperCase()}
                            </StatusTag>
                            <StatusTag color={getSubmitStatusColor(task.submit)}>
                                {translateSubmitStatus(task.submit).toUpperCase()}
                            </StatusTag>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginTop: "4px",
                                }}
                            >
                                <CalendarOutlined style={{ marginRight: "4px" }} />
                                <Text type="secondary">
                                    {moment(task.startDate).format("DD/MM/YYYY HH:mm")} -{" "}
                                    {moment(task.endDate).format("DD/MM/YYYY HH:mm")}
                                </Text>
                            </div>
                        </div>
                    }
                />
            </TaskItem>
        );
    };

    return (
        <Card>
            <Title level={4}>
                <CalendarOutlined /> Danh sách công việc
            </Title>
            <DynamicFilter onFilterChange={handleFilterChange} defaultFilters={filters} />
            <List
                dataSource={taskUser}
                renderItem={renderItem}
                pagination={{
                    current: pageIndex,
                    pageSize,
                    total: totalPagesCount * pageSize,
                    onChange: handlePageChange,
                    showSizeChanger: true,
                    pageSizeOptions: ['7', '10'],
                }}
                style={{ marginTop: '16px' }}
            />
            <ViewTaskDetailModal
                visible={modalShowTaskDetailVisible}
                onClose={handleCloseModalShowTaskDetail}
                setVisible={setModalShowTaskDetailVisible}
                selectedType={taskType}
            />

            <CreateAgreementModal
                visible={modalCreateAgreementVisible}
                onClose={() => setModalCreateAgreementVisible(false)}
            />

            <CreateBusinessRegistrationModal
                visible={modalCreateBusinessRegistrationVisible}
                onClose={() => setModalCreateBusinessRegistrationVisible(false)}
                onRefreshTasks={handleRefreshTasks}
                taskId={selectedTask?.id} // Pass taskId here
            />

            <CreateSignedContractModal
                visible={modalCreateSignedContractVisible}
                onClose={() => setModalCreateSignedContractVisible(false)}
                taskType={taskType}
                taskId={selectedTask?.id}
                filters={filters}
                pageIndex={pageIndex}
                pageSize={pageSize}
                onRefreshTasks={handleRefreshTasks}
            />
            <CreateEducationalOperationLicenseModal
                visible={modalCreateEducationalOperationLicenseVisible}
                onClose={() => setModalCreateEducationalOperationLicenseVisible(false)}
                onRefreshTasks={handleRefreshTasks}
                taskId={selectedTask?.id}
            />
            <ShowReportModal
                visible={modalShowReportVisible}
                onClose={handleCloseModalShowReport}
                taskId={selectedTask?.id}
                taskType={taskType}
                agencyId={selectedTask?.agencyId}
                taskSubmit={selectedTask?.submit}
            />

            <UploadFileModal
                visible={modalUploadFileVisible}
                onClose={() => setModalUploadFileVisible(false)}
                task={taskToUpload}
                onRefreshTasks={handleRefreshTasks}
            />
        </Card>
    );
};

export default ListTaskAgencyManager;