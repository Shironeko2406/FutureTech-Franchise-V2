import React, { useState, useEffect } from 'react';
import { Steps, Card, Button, message, Tag, Typography, Space, Row, Col, Tooltip, Progress } from 'antd';
import { UploadOutlined, CheckCircleOutlined, FileOutlined, LeftOutlined, RightOutlined, InfoCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { GetAllDocumentsByAgencyIdActionAsync } from '../../../Redux/ReducerAPI/DocumentReducer';
import ShowDocumentModal from '../../Modal/ShowDocumentModal';
import { GetContractDetailByAgencyIdActionAsync } from '../../../Redux/ReducerAPI/ContractReducer';
import { CreatePaymentContractActionAsync } from '../../../Redux/ReducerAPI/PaymentReducer';
import ContractDetailModal from '../../Modal/ContractDetailModal';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const AgencyProgressPage = () => {
    const { id } = useParams();
    const [localDocuments, setLocalDocuments] = useState({
        businessLicense: null,
        educationLicense: null
    });
    const [documentInfo, setDocumentInfo] = useState({
        businessLicense: { title: '', expirationDate: null, urlFile: '' },
        educationLicense: { title: '', expirationDate: null, urlFile: '' }
    });
    const [showDocumentModalVisible, setShowDocumentModalVisible] = useState({
        businessLicense: false,
        educationLicense: false
    });
    const [showContractDetailModal, setShowContractDetailModal] = useState(false);

    const dispatch = useDispatch();
    const documents = useSelector(state => state.DocumentReducer.documents);
    const contractDetail = useSelector(state => state.ContractReducer.contractDetail);

    const fetchDocuments = async () => {
        if (id) {
            await dispatch(GetAllDocumentsByAgencyIdActionAsync(id));
        }
    };

    const fetchContractDetail = async () => {
        await dispatch(GetContractDetailByAgencyIdActionAsync(id));
    };

    useEffect(() => {
        fetchDocuments();
        fetchContractDetail();
    }, [dispatch, id]);

    useEffect(() => {
        const businessLicense = documents.find(doc => doc.type === 'BusinessLicense');
        const educationLicense = documents.find(doc => doc.type === 'EducationalOperationLicense');
        setLocalDocuments({
            businessLicense: businessLicense || null,
            educationLicense: educationLicense || null
        });
        setDocumentInfo({
            businessLicense: {
                title: businessLicense?.title || '',
                expirationDate: businessLicense ? moment(businessLicense.expirationDate) : null,
                urlFile: businessLicense?.urlFile || ''
            },
            educationLicense: {
                title: educationLicense?.title || '',
                expirationDate: educationLicense ? moment(educationLicense.expirationDate) : null,
                urlFile: educationLicense?.urlFile || ''
            }
        });
    }, [documents]);

    const handleShowDocumentModalOpen = (type) => {
        setShowDocumentModalVisible(prev => ({ ...prev, [type]: true }));
    };

    const handleShowDocumentModalClose = async (type) => {
        setShowDocumentModalVisible(prev => ({ ...prev, [type]: false }));
        await fetchDocuments();
    };

    const handlePayment = async () => {
        if (contractDetail) {
            await dispatch(CreatePaymentContractActionAsync(contractDetail.id));
        }
    };

    const renderDocumentCard = (docType) => {
        const isSubmitted = localDocuments[docType] && documentInfo[docType].title && documentInfo[docType].expirationDate;
        const title = docType === 'businessLicense' ? 'Giấy phép kinh doanh' : 'Giấy phép giáo dục';

        return (
            <Card
                key={docType}
                type="inner"
                title={title}
            >
                {isSubmitted ? (
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Button type="primary" icon={<EyeOutlined />} onClick={() => handleShowDocumentModalOpen(docType)}>
                            Xem tài liệu
                        </Button>
                    </Space>
                ) : (
                    <Tag color="default">Chưa nộp {title}</Tag>
                )}
            </Card>
        );
    };

    const renderContractSection = () => {
        if (contractDetail) {
            return (
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Button type="primary" onClick={() => setShowContractDetailModal(true)}>
                        Xem hợp đồng
                    </Button>
                    {contractDetail.paidAmount === 0 && (
                        <Button type="primary" icon={<CheckCircleOutlined />} onClick={handlePayment}>
                            Thanh toán hợp đồng
                        </Button>
                    )}
                </Space>
            );
        } else {
            return <Tag color="default">Chưa có hợp đồng</Tag>;
        }
    };

    return (
        <div className="agency-progress-page" style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
            <Title level={2} style={{ textAlign: 'center', color: '#1890ff', marginBottom: '2rem' }}>
                Tiến Trình Nhượng Quyền
            </Title>

            <Card
                style={{
                    marginBottom: '2rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    borderRadius: '15px',
                    background: 'linear-gradient(145deg, #ffffff, #f0f2f5)'
                }}
                hoverable
            >
                <Steps current={1} style={{ marginBottom: '2rem' }}>
                    <Step title="Cung cấp tài liệu" icon={<UploadOutlined />} />
                    <Step title="Tạo hợp đồng & Thanh toán" icon={<FileOutlined />} />
                </Steps>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card title="Bước 1: Cung cấp tài liệu" bordered={false}>
                        <Space direction="vertical" style={{ width: '100%' }} size="large">
                            {renderDocumentCard('businessLicense')}
                            {renderDocumentCard('educationLicense')}
                        </Space>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card title="Bước 2: Tạo hợp đồng và Thanh toán" bordered={false}>
                        {renderContractSection()}
                    </Card>
                </motion.div>
            </Card>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                    <Card
                        style={{
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            borderRadius: '15px',
                            background: '#f0f8ff',
                            height: '100%'
                        }}
                    >
                        <Title level={4}>Tổng quan tiến trình</Title>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Tooltip title="Số lượng tài liệu đã tải lên">
                                <Progress
                                    percent={Math.round((Object.values(localDocuments).filter(Boolean).length / 2) * 100)}
                                    format={() => `${Object.values(localDocuments).filter(Boolean).length}/2`}
                                />
                            </Tooltip>
                            <Tooltip title="Trạng thái hợp đồng">
                                <Progress
                                    percent={contractDetail ? 100 : 0}
                                    status={contractDetail ? 'success' : 'active'}
                                    format={() => contractDetail ? 'Đã tải lên' : 'Chưa tải lên'}
                                />
                            </Tooltip>
                            <Tooltip title="Trạng thái thanh toán">
                                <Progress
                                    percent={contractDetail && contractDetail.paidAmount > 0 ? 100 : 0}
                                    status={contractDetail && contractDetail.paidAmount > 0 ? 'success' : 'active'}
                                    format={() => contractDetail && contractDetail.paidAmount > 0 ? 'Hoàn tất' : 'Chưa thanh toán'}
                                />
                            </Tooltip>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card
                        style={{
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            borderRadius: '15px',
                            background: 'linear-gradient(145deg, #f0f8ff, #e6f7ff)',
                            height: '100%'
                        }}
                    >
                        <Title level={4}>Hướng dẫn <InfoCircleOutlined /></Title>
                        <Paragraph>
                            <ul>
                                <li>
                                    <Text strong>Bước 1: Cung cấp tài liệu</Text>
                                    <ul>
                                        <li>Đợi khách hàng cung cấp tài liệu</li>
                                        <li>Kiểm tra và duyệt tài liệu</li>
                                    </ul>
                                </li>
                                <li>
                                    <Text strong>Bước 2: Tạo hợp đồng và Thanh toán</Text>
                                    <ul>
                                        <li>Tạo hợp đồng và gửi cho khách hàng</li>
                                        <li>Đợi khách hàng tải lên hợp đồng đã ký và thanh toán</li>
                                    </ul>
                                </li>
                            </ul>
                        </Paragraph>
                        <Paragraph>
                            <Text type="secondary">
                                Lưu ý: Đảm bảo tất cả các bước đều được hoàn thành đầy đủ và chính xác.
                            </Text>
                        </Paragraph>
                    </Card>
                </Col>
            </Row>

            <ShowDocumentModal
                visible={showDocumentModalVisible.businessLicense}
                onClose={() => handleShowDocumentModalClose('businessLicense')}
                document={localDocuments.businessLicense}
                documentInfo={documentInfo.businessLicense}
                agencyId={id}
            />
            <ShowDocumentModal
                visible={showDocumentModalVisible.educationLicense}
                onClose={() => handleShowDocumentModalClose('educationLicense')}
                document={localDocuments.educationLicense}
                documentInfo={documentInfo.educationLicense}
                agencyId={id}
            />
            <ContractDetailModal
                visible={showContractDetailModal}
                onClose={() => setShowContractDetailModal(false)}
                contractDetail={contractDetail}
                fromAgencyProgressPage={true}
            />
        </div>
    );
};

export default AgencyProgressPage;
