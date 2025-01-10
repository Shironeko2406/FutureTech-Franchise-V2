import React, { useEffect, useState } from 'react';
import { Card, Result, Button, Typography, Spin } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const PaymentFailure = () => {
  const [contractId, setContractId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const orderIdParam = searchParams.get('orderId');
    setContractId(orderIdParam);
    setLoading(false);
  }, [location]);

  const handleReturnToDashboard = () => {
    navigate('/agency-manager/');
  };

  if (loading) {
    return (
      <Card style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </Card>
    );
  }

  return (
    <Card>
      <Result
        icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
        status="error"
        title={<Title level={2}>Thanh toán hợp đồng thất bại!</Title>}
        subTitle={
          <Paragraph>
            Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại sau.
          </Paragraph>
        }
        extra={[
          <Button
            key="dashboard"
            onClick={handleReturnToDashboard}
          >
            Trở về
          </Button>
        ]}
      />
    </Card>
  );
};

export default PaymentFailure;
