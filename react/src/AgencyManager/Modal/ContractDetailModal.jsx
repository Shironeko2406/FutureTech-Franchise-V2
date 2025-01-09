import React, { useState } from 'react';
import { Modal, Typography, Descriptions, Card, Tag, Space, Divider, Row, Col, Button, Upload, message } from 'antd';
import { CalendarOutlined, DollarOutlined, PercentageOutlined, FileOutlined, BankOutlined, CheckCircleOutlined, ShopOutlined, UserOutlined, TeamOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { imageDB } from "../../Firebasse/Config";
import { AgencyUploadContractActionAsync } from '../../Redux/ReducerAPI/ContractReducer';

const { Title, Text } = Typography;

const ContractDetailModal = ({ visible, onClose, contractDetail, fromAgencyProgressPage }) => {
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const dispatch = useDispatch();

    const FinancialItem = ({ icon, label, value, color }) => (
        <div className="mb-4">
            <Space align="center" style={{ width: '100%' }}>
                {React.cloneElement(icon, { style: { fontSize: '24px', color } })}
                <Text strong style={{ minWidth: '150px' }}>{label}</Text>
                <Text>{value}</Text>
            </Space>
        </div>
    );

    const handleDownload = (url) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = url.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleUpload = async ({ file, onSuccess, onError }) => {
        const storageRef = ref(imageDB, `contracts/${file.name}`);
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

    const handleSubmitFile = async () => {
        if (!file) {
            message.error('Vui lòng tải lên file hợp đồng đã ký!');
            return;
        }
        setUploading(true);
        try {
            const data = {
                contractDocumentImageURL: file.url,
                agencyId: contractDetail.agencyId,
            };
            await dispatch(AgencyUploadContractActionAsync(data));
            message.success('Nộp file hợp đồng thành công!');
            onClose();
        } catch (error) {
            console.error("Error uploading contract file: ", error);
            message.error('Đã xảy ra lỗi, vui lòng thử lại sau.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width={800}
            styles={{ body: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' } }}
        >
            {contractDetail && (
                <Card>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <Title level={3}>Chi tiết hợp đồng</Title>
                        </div>

                        <Descriptions bordered column={1} labelStyle={{ fontWeight: 'bold' }}>
                            <Descriptions.Item label="Tên đối tác">
                                <Text strong>{contractDetail.agencyName}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Tiêu đề">
                                {contractDetail.title}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left">Thông tin thời gian</Divider>
                        <Space>
                            <CalendarOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                            <Descriptions column={2}>
                                <Descriptions.Item label="Ngày bắt đầu">
                                    {dayjs(contractDetail.startTime).format('DD/MM/YYYY')}
                                </Descriptions.Item>
                                <Descriptions.Item label="Ngày kết thúc">
                                    {dayjs(contractDetail.endTime).format('DD/MM/YYYY')}
                                </Descriptions.Item>
                            </Descriptions>
                        </Space>

                        <Divider orientation="left">Thông tin tài chính</Divider>
                        <div style={{ padding: '0 16px' }}>
                            <Row gutter={[32, 0]}>
                                <Col span={12}>
                                    <FinancialItem
                                        icon={<ShopOutlined />}
                                        label="Phí nhượng quyền:"
                                        value={`${Number(contractDetail.frachiseFee).toLocaleString('vi-VN')} VND`}
                                        color="#1890ff"
                                    />
                                    <FinancialItem
                                        icon={<PercentageOutlined />}
                                        label="Tỷ lệ chia sẻ doanh thu:"
                                        value={`${contractDetail.revenueSharePercentage}%`}
                                        color="#faad14"
                                    />
                                </Col>
                                <Col span={12}>
                                    <FinancialItem
                                        icon={<BankOutlined />}
                                        label="Phần trăm trả trước:"
                                        value={`${contractDetail.depositPercentage}%`}
                                        color="#eb2f96"
                                    />
                                    <FinancialItem
                                        icon={<CheckCircleOutlined />}
                                        label="Số tiền đã trả:"
                                        value={`${Number(contractDetail.paidAmount).toLocaleString('vi-VN')} VND`}
                                        color="#13c2c2"
                                    />
                                </Col>
                            </Row>
                            <Divider style={{ margin: '16px 0' }} />
                            <FinancialItem
                                icon={<DollarOutlined />}
                                label="Tổng số tiền:"
                                value={`${Number(contractDetail.total).toLocaleString('vi-VN')} VND`}
                                color="#52c41a"
                            />
                        </div>

                        <Divider orientation="left">Thông tin gói</Divider>
                        <div style={{ padding: '0 16px' }}>
                            <Row gutter={[32, 0]}>
                                <Col span={12}>
                                    <FinancialItem
                                        icon={<UserOutlined />}
                                        label="Tên gói:"
                                        value={contractDetail.packageViewModel.name}
                                        color="#1890ff"
                                    />
                                    <FinancialItem
                                        icon={<DollarOutlined />}
                                        label="Giá gói:"
                                        value={`${Number(contractDetail.packageViewModel.price).toLocaleString('vi-VN')} VND`}
                                        color="#faad14"
                                    />
                                </Col>
                                <Col span={12}>
                                    {fromAgencyProgressPage ? (
                                        <FinancialItem
                                            icon={<TeamOutlined />}
                                            label="Số lượng người dùng:"
                                            value={contractDetail.packageViewModel.numberOfUsers}
                                            color="#eb2f96"
                                        />
                                    ) : (
                                        <FinancialItem
                                            icon={<TeamOutlined />}
                                            label="Số tài khoản đã dùng:"
                                            value={`${contractDetail.usedAccountCount}/${contractDetail.packageViewModel.numberOfUsers}`}
                                            color="#eb2f96"
                                        />
                                    )}
                                    <FinancialItem
                                        icon={<CheckCircleOutlined />}
                                        label="Trạng thái:"
                                        value={contractDetail.packageViewModel.status === "Standard" ? "Gói mặc định" : "Gói tùy chỉnh"}
                                        color="#13c2c2"
                                    />
                                </Col>
                            </Row>
                        </div>

                        {contractDetail.contractDocumentImageURL && (
                            <>
                                <Divider orientation="left">Tài liệu</Divider>
                                <Space>
                                    <FileOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                                    <Button type="link" onClick={() => handleDownload(contractDetail.contractDocumentImageURL)}>
                                        Xem tài liệu hợp đồng
                                    </Button>
                                </Space>
                            </>
                        )}

                        {fromAgencyProgressPage && (
                            <>
                                <Divider orientation="left">Nộp file hợp đồng đã ký</Divider>
                                <Upload
                                    name="contractFile"
                                    customRequest={handleUpload}
                                    onRemove={handleRemoveFile}
                                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    maxCount={1}
                                >
                                    <Button icon={<UploadOutlined />}>Tải lên tài liệu</Button>
                                </Upload>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                                    <Button onClick={onClose} style={{ marginRight: '8px' }}>
                                        Hủy
                                    </Button>
                                    <Button type="primary" onClick={handleSubmitFile} loading={uploading}>
                                        Nộp file
                                    </Button>
                                </div>
                            </>
                        )}
                    </Space>
                </Card>
            )}
        </Modal>
    );
};

export default ContractDetailModal;

