import React, { useState } from 'react';
import { Steps, Card, Upload, Button, message, Tag, Typography, Space, Row, Col, Tooltip, Progress } from 'antd';
import { UploadOutlined, CheckCircleOutlined, DollarCircleOutlined, FileOutlined, LeftOutlined, RightOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const AgencyDetail = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [paymentAmount, setPaymentAmount] = useState(null);
  const [paymentDate, setPaymentDate] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const handleDocumentUpload = (info) => {
    const { status } = info.file;
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
      setDocuments([...documents, info.file]);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
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

  const simulatePayment = () => {
    setPaymentStatus('completed');
    setPaymentAmount(50000000); // 50,000,000 VND
    setPaymentDate(new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }));
  };

  const requiredDocuments = ['Giấy phép kinh doanh', 'Hợp đồng', 'Giấy phép hoạt động giáo dục'];

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
              <Space direction="vertical" style={{ width: '100%' }}>
                {requiredDocuments.map((doc, index) => (
                  <Tag key={index} color={documents.length > index ? 'success' : 'default'} icon={<FileOutlined />}>
                    {doc}
                  </Tag>
                ))}
                <Upload
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  onChange={handleDocumentUpload}
                  multiple
                >
                  <Button icon={<UploadOutlined />} type="primary">
                    Tải lên tài liệu
                  </Button>
                </Upload>
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
            <Card title="Bước 2: Trạng thái thanh toán và Kích hoạt" bordered={false}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Tag color={paymentStatus === 'completed' ? 'success' : 'warning'}>
                  {paymentStatus === 'completed' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                </Tag>
                {paymentStatus === 'completed' ? (
                  <>
                    <Text strong>Số tiền: {paymentAmount?.toLocaleString('vi-VN')} VND</Text>
                    <Text strong>Thời gian: {paymentDate}</Text>
                    <Button
                      type="primary"
                      icon={<CheckCircleOutlined />}
                      onClick={handleActivate}
                      loading={isLoading}
                      style={{ marginTop: '1rem', width: '100%' }}
                    >
                      Kích hoạt trung tâm
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={simulatePayment}
                    type="primary"
                  >
                    (Giả lập) Cập nhật trạng thái thanh toán
                  </Button>
                )}
              </Space>
            </Card>
          </motion.div>
        );
      default:
        return null;
    }
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
          <Step title="Thanh toán và Kích hoạt" icon={<DollarCircleOutlined />} />
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
                  percent={Math.round((documents.length / requiredDocuments.length) * 100)}
                  format={() => `${documents.length}/${requiredDocuments.length}`}
                />
              </Tooltip>
              <Tooltip title="Trạng thái thanh toán">
                <Progress
                  percent={paymentStatus === 'completed' ? 100 : 0}
                  status={paymentStatus === 'completed' ? 'success' : 'active'}
                  format={() => paymentStatus === 'completed' ? 'Hoàn tất' : 'Chờ thanh toán'}
                />
              </Tooltip>
              <Tooltip title="Trạng thái kích hoạt">
                <Progress
                  percent={isLoading ? 50 : (paymentStatus === 'completed' ? 100 : 0)}
                  status={isLoading ? 'active' : (paymentStatus === 'completed' ? 'success' : 'exception')}
                  format={() => isLoading ? 'Đang xử lý' : (paymentStatus === 'completed' ? 'Sẵn sàng' : 'Chưa sẵn sàng')}
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
                    <li>Tải lên tất cả các tài liệu cần thiết</li>
                    <li>Đảm bảo tất cả tài liệu đều hợp lệ và đầy đủ</li>
                  </ul>
                </li>
                <li>
                  <Text strong>Bước 2: Thanh toán và Kích hoạt</Text>
                  <ul>
                    <li>Đợi khách hàng hoàn tất thanh toán</li>
                    <li>Sau khi thanh toán hoàn tất, kích hoạt trung tâm</li>
                  </ul>
                </li>
              </ul>
            </Paragraph>
            <Paragraph>
              <Text type="secondary">
                Lưu ý: Đảm bảo tất cả các bước đều được hoàn thành trước khi kích hoạt trung tâm.
              </Text>
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AgencyDetail;