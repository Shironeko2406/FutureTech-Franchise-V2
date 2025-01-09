import React, { useState, useEffect } from 'react';
import { Steps, Card, Button, message, Tag, Typography, Space, Row, Col, Tooltip, Progress, Upload } from 'antd';
import { UploadOutlined, CheckCircleOutlined, FileOutlined, LeftOutlined, RightOutlined, InfoCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { GetAllDocumentsByAgencyIdActionAsync } from '../../../Redux/ReducerAPI/DocumentReducer';
import ShowDocumentModal from '../../Modal/ShowDocumentModal';
import { GetContractDetailByAgencyIdActionAsync } from '../../../Redux/ReducerAPI/ContractReducer';
import ContractDetailModal from '../../Modal/ContractDetailModal';
import CreateContractModal from '../../Modal/CreateContractModal';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const AgencyDetail = () => {
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
  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [paymentAmount, setPaymentAmount] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [documentApproval, setDocumentApproval] = useState({
    businessLicense: false,
    educationLicense: false
  });
  const [contractDetail, setContractDetail] = useState(null);
  const [showContractDetailModal, setShowContractDetailModal] = useState(false);
  const [showCreateContractModal, setShowCreateContractModal] = useState(false);

  const dispatch = useDispatch();
  const documents = useSelector(state => state.DocumentReducer.documents);

  const fetchDocuments = async () => {
    if (id) {
      setIsLoading(true);
      await dispatch(GetAllDocumentsByAgencyIdActionAsync(id));
      setIsLoading(false);
    }
  };

  const fetchContractDetail = async () => {
    const contract = await dispatch(GetContractDetailByAgencyIdActionAsync(id));
    if (contract) {
      setContractDetail(contract);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [dispatch, id]);

  useEffect(() => {
    const businessLicense = documents.find(doc => doc.type === 'BusinessLicense');
    const educationLicense = documents.find(doc => doc.type === 'EducationalOperationLicense');
    setLocalDocuments({
      businessLicense: businessLicense || null,
      educationLicense: educationLicense || null
    });
    setDocumentApproval({
      businessLicense: businessLicense?.appoved || false,
      educationLicense: educationLicense?.appoved || false
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

  useEffect(() => {
    if (currentStep === 1) {
      fetchContractDetail();
    }
  }, [currentStep]);

  const handleShowDocumentModalOpen = (type) => {
    setShowDocumentModalVisible(prev => ({ ...prev, [type]: true }));
  };

  const handleShowDocumentModalClose = async (type) => {
    setShowDocumentModalVisible(prev => ({ ...prev, [type]: false }));
    await fetchDocuments();
  };

  const handleContractUpload = (info) => {
    const { status } = info.file;
    if (status === 'done') {
      message.success(`${info.file.name} hợp đồng đã được tải lên thành công.`);
      setContract(info.file);
    } else if (status === 'error') {
      message.error(`Tải lên hợp đồng ${info.file.name} thất bại.`);
    }
  };

  const handleActivate = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      message.success('Trung tâm đã được kích hoạt thành công!');
    }, 2000);
  };

  const nextStep = () => {
    if (currentStep < 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderDocumentCard = (docType) => {
    const isSubmitted = localDocuments[docType] && documentInfo[docType].title && documentInfo[docType].expirationDate;
    const isApproved = documentApproval[docType];
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
            <Tag color={isApproved ? 'success' : 'processing'}>
              {isApproved ? 'Đã duyệt' : 'Đang chờ duyệt'}
            </Tag>
          </Space>
        ) : (
          <Tag color="default">Chưa nộp {title}</Tag>
        )}
      </Card>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
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
        );
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card title="Bước 2: Tạo hợp đồng và Thanh toán" bordered={false}>
              <Space direction="vertical" style={{ width: '100%' }}>
                {contractDetail ? (
                  <Button type="primary" onClick={() => setShowContractDetailModal(true)}>
                    Xem hợp đồng
                  </Button>
                ) : (
                  <Button type="primary" onClick={() => setShowCreateContractModal(true)}>
                    Tạo hợp đồng
                  </Button>
                )}
                <Tag color={paymentStatus === 'completed' ? 'success' : 'warning'}>
                  {paymentStatus === 'completed' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </Tag>
                {paymentStatus === 'completed' ? (
                  <Text strong>Số tiền đã thanh toán: {paymentAmount?.toLocaleString('vi-VN')} VND</Text>
                ) : (
                  <Text type="secondary">Khách hàng chưa thanh toán</Text>
                )}
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={handleActivate}
                  loading={isLoading}
                  style={{ marginTop: '1rem', width: '100%' }}
                  disabled={paymentStatus !== 'completed'}
                >
                  Kích hoạt trung tâm
                </Button>
              </Space>
            </Card>
          </motion.div>
        );
      default:
        return null;
    }
  };

  const handleContractCreated = async () => {
    await fetchContractDetail();
    setShowCreateContractModal(false);
  };

  return (
    <div className="franchise-progress-manager" style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
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
        <Steps current={currentStep} style={{ marginBottom: '2rem' }}>
          <Step title="Cung cấp tài liệu" icon={<UploadOutlined />} />
          <Step title="Tạo hợp đồng & Thanh toán" icon={<FileOutlined />} />
        </Steps>

        {renderStepContent()}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <Button onClick={prevStep} disabled={currentStep === 0} icon={<LeftOutlined />}>
            Quay lại
          </Button>
          <Button onClick={nextStep} disabled={currentStep === 1} icon={<RightOutlined />}>
            Tiếp theo
          </Button>
        </div>
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
                  percent={contract ? 100 : 0}
                  status={contract ? 'success' : 'active'}
                  format={() => contract ? 'Đã tải lên' : 'Chưa tải lên'}
                />
              </Tooltip>
              <Tooltip title="Trạng thái thanh toán">
                <Progress
                  percent={paymentStatus === 'completed' ? 100 : 0}
                  status={paymentStatus === 'completed' ? 'success' : 'active'}
                  format={() => paymentStatus === 'completed' ? 'Hoàn tất' : 'Chưa thanh toán'}
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
        documentApproval={documentApproval.businessLicense}
        agencyId={id}
      />
      <ShowDocumentModal
        visible={showDocumentModalVisible.educationLicense}
        onClose={() => handleShowDocumentModalClose('educationLicense')}
        document={localDocuments.educationLicense}
        documentInfo={documentInfo.educationLicense}
        documentApproval={documentApproval.educationLicense}
        agencyId={id}
      />
      <ContractDetailModal
        visible={showContractDetailModal}
        onClose={() => setShowContractDetailModal(false)}
        contractDetail={contractDetail}
      />
      <CreateContractModal
        visible={showCreateContractModal}
        onClose={() => setShowCreateContractModal(false)}
        agencyId={id}
        onContractCreated={handleContractCreated}
      />
    </div>
  );
};

export default AgencyDetail;