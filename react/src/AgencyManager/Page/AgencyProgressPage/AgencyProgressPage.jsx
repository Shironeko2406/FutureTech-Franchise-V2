import React, { useState, useEffect } from 'react';
import { Steps, Card, Button, message, Tag, Typography, Space, Row, Col, Tooltip, Progress, Modal, Upload, Input, DatePicker, Form } from 'antd';
import { UploadOutlined, CheckCircleOutlined, DollarCircleOutlined, FileOutlined, LeftOutlined, RightOutlined, InfoCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { GetAllDocumentsByAgencyIdActionAsync } from '../../../Redux/ReducerAPI/DocumentReducer';
import { GetContractDetailByAgencyIdActionAsync } from '../../../Redux/ReducerAPI/ContractReducer';
import { CreatePaymentContractActionAsync } from '../../../Redux/ReducerAPI/PaymentReducer';
import CreateDocumentModal from '../../Modal/CreateDocumentModal';
import ShowDocumentModal from '../../Modal/ShowDocumentModal';
import ContractDetailModal from '../../Modal/ContractDetailModal';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const AgencyProgressPage = () => {
  const [localDocuments, setLocalDocuments] = useState({
    businessLicense: null,
    educationLicense: null
  });
  const [documentInfo, setDocumentInfo] = useState({
    businessLicense: { title: '', expirationDate: null, urlFile: '' },
    educationLicense: { title: '', expirationDate: null, urlFile: '' }
  });
  const [modalVisible, setModalVisible] = useState({
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

  const dispatch = useDispatch();
  const userLogin = useSelector(state => state.AuthenticationReducer.userLogin);
  const documents = useSelector(state => state.DocumentReducer.documents);

  const [form] = Form.useForm();

  const [createDocumentModalVisible, setCreateDocumentModalVisible] = useState({
    businessLicense: false,
    educationLicense: false
  });

  const [showDocumentModalVisible, setShowDocumentModalVisible] = useState({
    businessLicense: false,
    educationLicense: false
  });

  const handleCreateDocumentModalOpen = (type) => {
    setCreateDocumentModalVisible(prev => ({ ...prev, [type]: true }));
  };

  const handleCreateDocumentModalClose = (type) => {
    setCreateDocumentModalVisible(prev => ({ ...prev, [type]: false }));
  };

  const handleShowDocumentModalOpen = (type) => {
    setShowDocumentModalVisible(prev => ({ ...prev, [type]: true }));
  };

  const handleShowDocumentModalClose = (type) => {
    setShowDocumentModalVisible(prev => ({ ...prev, [type]: false }));
  };

  const fetchDocuments = async () => {
    const agencyId = userLogin?.agencyId;
    if (agencyId) {
      await dispatch(GetAllDocumentsByAgencyIdActionAsync(agencyId));
    }
  };

  const fetchContractDetail = async () => {
    const agencyId = userLogin?.agencyId;
    if (agencyId) {
      const contract = await dispatch(GetContractDetailByAgencyIdActionAsync(agencyId));
      if (contract) {
        setContractDetail(contract);
        setPaymentStatus(contract.paidAmount === 0 || contract.paidAmount === null ? 'pending' : 'completed');
        setPaymentAmount(contract.paidAmount);
      }
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [dispatch, userLogin]);

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

  const handleDocumentUpload = (type, info) => {
    const { status } = info.file;
    if (status === 'done') {
      message.success(`${info.file.name} đã được tải lên thành công.`);
      setLocalDocuments(prev => ({ ...prev, [type]: info.file }));
    } else if (status === 'error') {
      message.error(`Tải lên ${info.file.name} thất bại.`);
    }
  };

  const handleDocumentInfoChange = (type, field, value) => {
    setDocumentInfo(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }));
  };

  const handleModalClose = (type) => {
    setModalVisible(prev => ({ ...prev, [type]: false }));
  };

  const handleSubmitDocument = (type) => {
    form.validateFields()
      .then(() => {
        if (!localDocuments[type] || !documentInfo[type].title || !documentInfo[type].expirationDate) {
          message.error('Vui lòng điền đầy đủ thông tin tài liệu.');
          return;
        }
        message.success(`Tài liệu ${type === 'businessLicense' ? 'Giấy phép kinh doanh' : 'Giấy phép giáo dục'} đã được nộp thành công.`);
        handleModalClose(type);

        // Simulate approval process
        setTimeout(() => {
          setDocumentApproval(prev => ({ ...prev, [type]: true }));
          message.success(`Tài liệu ${type === 'businessLicense' ? 'Giấy phép kinh doanh' : 'Giấy phép giáo dục'} đã được duyệt.`);
        }, 5000);
      })
      .catch((errorInfo) => {
        console.error('Validate Failed:', errorInfo);
      });
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

  const handlePayment = async () => {
    if (contractDetail) {
      setIsLoading(true);
      try {
        await dispatch(CreatePaymentContractActionAsync(contractDetail.id));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderDocumentModal = (type) => (
    <Modal
      title={type === 'businessLicense' ? 'Nộp Giấy phép kinh doanh' : 'Nộp Giấy phép giáo dục'}
      visible={modalVisible[type]}
      onCancel={() => handleModalClose(type)}
      footer={[
        <Button key="back" onClick={() => handleModalClose(type)}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={() => handleSubmitDocument(type)}>
          Nộp
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Form.Item
            name={`${type}_file`}
            rules={[{ required: true, message: 'Vui lòng tải lên tài liệu' }]}
          >
            <Upload
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              onChange={(info) => handleDocumentUpload(type, info)}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Tải lên tài liệu</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name={`${type}_title`}
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input
              placeholder="Tiêu đề"
              value={documentInfo[type].title}
              onChange={(e) => handleDocumentInfoChange(type, 'title', e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name={`${type}_expirationDate`}
            rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn' }]}
          >
            <DatePicker
              placeholder="Ngày hết hạn"
              value={documentInfo[type].expirationDate}
              onChange={(date) => handleDocumentInfoChange(type, 'expirationDate', date)}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Space>
      </Form>
    </Modal>
  );

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
              Xem tài liệu đã nộp
            </Button>
            <Tag color={isApproved ? 'success' : 'processing'}>
              {isApproved ? 'Đã duyệt' : 'Đang chờ duyệt'}
            </Tag>
          </Space>
        ) : (
          <Button onClick={() => handleCreateDocumentModalOpen(docType)}>
            Nộp {title}
          </Button>
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
              {renderDocumentModal('businessLicense')}
              {renderDocumentModal('educationLicense')}
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
            <Card title="Bước 2: Hợp đồng & Thanh toán" bordered={false}>
              <Space direction="vertical" style={{ width: '100%' }}>
                {contractDetail ? (
                  <Button type="primary" onClick={() => setShowContractDetailModal(true)}>
                    Xem hợp đồng
                  </Button>
                ) : (
                  <Tag color="default">Chưa có hợp đồng</Tag>
                )}
                <Tag color={paymentStatus === 'completed' ? 'success' : 'warning'}>
                  {paymentStatus === 'completed' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </Tag>
                {paymentStatus === 'completed' ? (
                  <Text strong>Số tiền đã thanh toán: {paymentAmount?.toLocaleString('vi-VN')} VND</Text>
                ) : (
                  <Input.Group compact>
                    <Button
                      type="primary"
                      onClick={handlePayment}
                      loading={isLoading}
                      style={{ width: '200px' }}
                    >
                      Thanh toán
                    </Button>
                  </Input.Group>
                )}
              </Space>
            </Card>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card title="Bước 3: Chờ xác nhận và kích hoạt" bordered={false}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text>
                  Cảm ơn bạn đã hoàn tất quá trình đăng ký và thanh toán. Trung tâm chính đang xem xét hồ sơ của bạn.
                </Text>
                <Text strong>
                  Trạng thái: Đang chờ xác nhận và kích hoạt từ trung tâm chính
                </Text>
                <Text type="secondary">
                  Chúng tôi sẽ liên hệ với bạn qua email khi quá trình xác nhận hoàn tất.
                </Text>
              </Space>
            </Card>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="franchise-progress-customer" style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
      <Title level={2} style={{ textAlign: 'center', color: '#1890ff', marginBottom: '2rem' }}>
        Tiến Trình Đăng Ký Nhượng Quyền
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
          <Step title="Hợp đồng & Thanh toán" icon={<DollarCircleOutlined />} />
          <Step title="Chờ xác nhận" icon={<CheckCircleOutlined />} />
        </Steps>

        {renderStepContent()}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <Button onClick={prevStep} disabled={currentStep === 0} icon={<LeftOutlined />}>
            Quay lại
          </Button>
          <Button onClick={nextStep} disabled={currentStep === 2 || (currentStep === 1 && paymentStatus !== 'completed')} icon={<RightOutlined />}>
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
                    <li>Nhấn vào nút "Nộp Giấy phép kinh doanh" và "Nộp Giấy phép giáo dục"</li>
                    <li>Tải lên tài liệu, điền tiêu đề và chọn ngày hết hạn cho mỗi giấy phép</li>
                    <li>Nhấn "Nộp" để hoàn tất việc nộp từng tài liệu</li>
                  </ul>
                </li>
                <li>
                  <Text strong>Bước 2: Tải lên hợp đồng đã ký và Thanh toán</Text>
                  <ul>
                    <li>Tải lên hợp đồng đã ký</li>
                    <li>Tiến hành thanh toán theo hướng dẫn</li>
                  </ul>
                </li>
                <li>
                  <Text strong>Bước 3: Chờ xác nhận và kích hoạt</Text>
                  <ul>
                    <li>Sau khi hoàn tất việc nộp tài liệu, tải hợp đồng và thanh toán</li>
                    <li>Đợi trung tâm chính kiểm tra và kích hoạt</li>
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

      <CreateDocumentModal
        visible={createDocumentModalVisible.businessLicense}
        onClose={() => handleCreateDocumentModalClose('businessLicense')}
        documentType="BusinessLicense"
        onRefreshDocuments={fetchDocuments}
      />
      <CreateDocumentModal
        visible={createDocumentModalVisible.educationLicense}
        onClose={() => handleCreateDocumentModalClose('educationLicense')}
        documentType="EducationalOperationLicense"
        onRefreshDocuments={fetchDocuments}
      />
      <ShowDocumentModal
        visible={showDocumentModalVisible.businessLicense}
        onClose={() => handleShowDocumentModalClose('businessLicense')}
        document={localDocuments.businessLicense}
        documentInfo={documentInfo.businessLicense}
        documentApproval={documentApproval.businessLicense}
      />
      <ShowDocumentModal
        visible={showDocumentModalVisible.educationLicense}
        onClose={() => handleShowDocumentModalClose('educationLicense')}
        document={localDocuments.educationLicense}
        documentInfo={documentInfo.educationLicense}
        documentApproval={documentApproval.educationLicense}
      />
      <ContractDetailModal
        visible={showContractDetailModal}
        onClose={() => setShowContractDetailModal(false)}
        contractDetail={contractDetail}
        fromAgencyProgressPage={true}
        agencyId={userLogin?.agencyId}
      />
    </div>
  );
};

export default AgencyProgressPage;

