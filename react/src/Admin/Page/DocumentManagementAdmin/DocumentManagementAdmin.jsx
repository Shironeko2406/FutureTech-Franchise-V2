import { Button, Table, Dropdown, Space, Typography, Modal, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined, EllipsisOutlined, DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { GetDocumentsActionAsync, DeleteDocumentActionAsync } from "../../../Redux/ReducerAPI/DocumentReducer";
import { useLoading } from "../../../Utils/LoadingContext";
import { GetAgencyActionAsync } from "../../../Redux/ReducerAPI/AgencyReducer";

const { Text } = Typography;

const DocumentManagementAdmin = () => {
    const { documents, totalPagesCount } = useSelector((state) => state.DocumentReducer);
    const dispatch = useDispatch();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [type, setType] = useState(null);
    const [status, setStatus] = useState(null);
    const { setLoading } = useLoading();

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
        };

        return typeConfig[type] || typeConfig.AgreementContract;
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
                    <Tooltip title="Tải xuống file tài liệu">
                        <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            onClick={() => window.open(record.urlFile, "_blank")}
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
        </div>
    );
};

export default DocumentManagementAdmin;