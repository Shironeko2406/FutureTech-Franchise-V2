import { Button, Table, Dropdown, Space, Typography, Input, Modal, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined, SearchOutlined, EllipsisOutlined, DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { GetDocumentsActionAsync, DeleteDocumentActionAsync } from "../../../Redux/ReducerAPI/DocumentReducer";
import { useLoading } from "../../../Utils/LoadingContext";
import EditDocumentModal from "../../Modal/EditDocumentModal";
import CreateDocumentModal from "../../Modal/CreateDocumentModal";
import { GetAgencyActionAsync } from "../../../Redux/ReducerAPI/AgencyReducer";

const { Text } = Typography;

const DocumentManagement = () => {
    const { documents, totalPagesCount } = useSelector((state) => state.DocumentReducer);
    const dispatch = useDispatch();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [type, setType] = useState(null);
    const [status, setStatus] = useState(null);
    const { setLoading } = useLoading();
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const { agencyData } = useSelector((state) => state.AgencyReducer);

    useEffect(() => {
        setLoading(true);
        dispatch(GetDocumentsActionAsync({ pageIndex, pageSize, type, status }))
            .finally(() => setLoading(false));
    }, [dispatch, pageIndex, pageSize, type, status]);

    const handleTableChange = (pagination, filters) => {
        setPageIndex(pagination.current);
        setPageSize(pagination.pageSize);
        setType(filters.type ? filters.type[0] : null);
        setStatus(filters.status ? filters.status[0] : null);
    };

    const handleDelete = async (documentId) => {
        setLoading(true);
        try {
            await dispatch(DeleteDocumentActionAsync(documentId));
            await dispatch(GetDocumentsActionAsync(pageIndex, pageSize, type, status));
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (document) => {
        setSelectedDocument(document);
        setIsEditModalVisible(true);
    };

    const handleEditModalClose = async () => {
        setIsEditModalVisible(false);
        setLoading(true);
        await dispatch(GetDocumentsActionAsync({ pageIndex, pageSize, type, status }));
        setLoading(false);
    };

    const handleCreateModalClose = async () => {
        setIsCreateModalVisible(false);
        setLoading(true);
        await dispatch(GetDocumentsActionAsync({ pageIndex, pageSize, type, status }));
        setLoading(false);
    };

    const handleCreateModalOpen = () => {
        dispatch(GetAgencyActionAsync(1, 1000));
        setIsCreateModalVisible(true);
    };

    const renderStatusBadge = (status) => {
        const statusConfig = {
            Active: {
                text: "Hoạt động",
                color: "green",
                backgroundColor: "#f6ffed",
                borderColor: "#b7eb8f",
            },
            Expired: {
                text: "Hết hạn",
                color: "red",
                backgroundColor: "#fff2f0",
                borderColor: "#ffa39e",
            },
        };

        const config = statusConfig[status] || statusConfig.Active;

        return (
            <div
                style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    backgroundColor: config.backgroundColor,
                    border: `1px solid ${config.borderColor}`,
                }}
            >
                <Text strong style={{ color: config.color }}>
                    {config.text}
                </Text>
            </div>
        );
    };

    const renderTypeBadge = (type) => {
        const typeConfig = {
            AgreementContract: "Hợp đồng thỏa thuận",
            BusinessLicense: "Giấy phép kinh doanh",
            EducationalOperationLicense: "Giấy phép hoạt động giáo dục",
            Handover: "Giấy nghiệm thu",
            Other: "Giấy tờ khác",
        };

        return typeConfig[type] || typeConfig.AgreementContract;
    };

    const getActionItems = () => [
        {
            label: "Sửa",
            key: "edit",
            icon: <EditOutlined style={{ color: "#faad14" }} />,
        },
        {
            label: "Xóa",
            key: "delete",
            icon: <DeleteOutlined style={{ color: "red" }} />,
        },
    ];

    const handleMenuClick = async (record, key) => {
        if (key === "edit") {
            handleEdit(record);
        } else if (key === "delete") {
            Modal.confirm({
                title: "Bạn có chắc chắn muốn xóa tài liệu này?",
                content: "Hành động này không thể hoàn tác.",
                okText: "Xóa",
                okType: "danger",
                cancelText: "Hủy",
                onOk: async () => {
                    await handleDelete(record.id);
                },
            });
        }
    };

    const handleDownload = (url) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = url.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const columns = [
        {
            title: "STT",
            dataIndex: "no",
            key: "no",
            align: "center",
            render: (text, record, index) => index + 1 + (pageIndex - 1) * pageSize,
        },
        {
            title: "Tên tài liệu",
            dataIndex: "title",
            key: "title",
            align: "center",
        },
        {
            title: "Tên chi nhánh",
            dataIndex: "agencyName",
            key: "agencyName",
            align: "center",
        },
        {
            title: "Loại tài liệu",
            dataIndex: "type",
            key: "type",
            align: "center",
            filters: [
                { text: "Hợp đồng thỏa thuận", value: "AgreementContract" },
                { text: "Giấy phép kinh doanh", value: "BusinessLicense" },
                { text: "Giấy phép hoạt động giáo dục", value: "EducationalOperationLicense" },
                { text: "Giấy nghiệm thu", value: "Handover" },
                { text: "Giấy tờ khác", value: "Other" },
            ],
            filterMultiple: false,
            render: (type) => renderTypeBadge(type),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            align: "center",
            filters: [
                { text: "Hoạt động", value: "Active" },
                { text: "Hết hạn", value: "Expired" },
            ],
            filterMultiple: false,
            render: (status) => renderStatusBadge(status),
        },
        {
            title: "Ngày hết hạn",
            dataIndex: "expirationDate",
            key: "expirationDate",
            align: "center",
        },
        {
            title: "Hành động",
            key: "action",
            align: "center",
            render: (_, record) => (
                <Space>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="default"
                            icon={<EditOutlined />}
                            style={{ backgroundColor: "#faad14", color: "#fff" }}
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Tải xuống file tài liệu">
                        <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            onClick={() => handleDownload(record.urlFile)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="card">
            <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h5 className="card-title mb-3">Quản lý tài liệu</h5>
                    <Button type="primary" onClick={handleCreateModalOpen} icon={<PlusOutlined />}>
                        Tạo tài liệu
                    </Button>
                </div>
                <Table
                    bordered
                    columns={columns}
                    dataSource={documents}
                    rowKey={(record) => record.id}
                    pagination={{
                        current: pageIndex,
                        pageSize,
                        total: totalPagesCount * pageSize,
                        showSizeChanger: true,
                        pageSizeOptions: ["10", "20", "50"],
                    }}
                    onChange={handleTableChange}
                />
            </div>
            <EditDocumentModal
                visible={isEditModalVisible}
                onClose={handleEditModalClose}
                document={selectedDocument}
            />
            <CreateDocumentModal
                visible={isCreateModalVisible}
                onClose={handleCreateModalClose}
                agencyData={agencyData}
            />
        </div>
    );
};

export default DocumentManagement;