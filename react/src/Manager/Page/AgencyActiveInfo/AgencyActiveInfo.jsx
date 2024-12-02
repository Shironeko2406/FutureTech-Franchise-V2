import React, { useEffect } from "react";
import { ShopOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined, CheckCircleOutlined, ArrowLeftOutlined, ToolOutlined, FileTextOutlined, TeamOutlined } from "@ant-design/icons";
import { Card, Typography, Descriptions, Tag, Space, Avatar, Row, Col, Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetAgencyDetailByIdActionAsync } from "../../../Redux/ReducerAPI/AgencyReducer";

const { Title, Text } = Typography;

const translateStatus = (status) => {
    const statusTranslations = {
      Active: 'Hoạt động',
      Inactive: 'Không hoạt động',
      // Thêm các trạng thái khác nếu cần
    };
    
    return statusTranslations[status] || status;  // Trả về trạng thái đã dịch hoặc trả về chính trạng thái nếu không tìm thấy
  };

const AgencyActiveInfo = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {id} = useParams()
  const { agencyDetail } = useSelector((state) => state.AgencyReducer);

  useEffect(()=>{
    dispatch(GetAgencyDetailByIdActionAsync(id))
  },[id])

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Row gutter={16} align="middle">
          <Col>
            <Avatar size={64} icon={<ShopOutlined />} />
          </Col>
          <Col>
            <Title level={3}>{agencyDetail.name || 'N/A'}</Title>
            {agencyDetail.status && (
              <Tag color="green" icon={<CheckCircleOutlined />}>
                {translateStatus(agencyDetail.status)}
              </Tag>
            )}
          </Col>
        </Row>

        <Descriptions column={1} bordered>
          <Descriptions.Item label={<Space><EnvironmentOutlined /> Địa chỉ</Space>}>
            {agencyDetail.address && agencyDetail.ward && agencyDetail.district && agencyDetail.city
              ? `${agencyDetail.address}, ${agencyDetail.ward}, ${agencyDetail.district}, ${agencyDetail.city}`
              : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label={<Space><PhoneOutlined /> Số điện thoại</Space>}>
            {agencyDetail.phoneNumber || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label={<Space><MailOutlined /> Email</Space>}>
            {agencyDetail.email || 'N/A'}
          </Descriptions.Item>
        </Descriptions>

        <Row gutter={[16, 16]}>
          <Col>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/manager/agency-active")}>Trở lại</Button>
          </Col>
          <Col>
            <Button icon={<TeamOutlined />} onClick={() => navigate(`/manager/agency-active/${id}/task-detail`)}>Công việc</Button>
          </Col>
          <Col>
            <Button icon={<ToolOutlined />} onClick={() => navigate(`/manager/agency-active/${id}/equipments`)}>Quản lý thiết bị</Button>
          </Col>
          <Col>
            <Button icon={<FileTextOutlined />}>Hợp đồng</Button>
          </Col>
        </Row>
      </Space>
    </Card>
  );
};

export default AgencyActiveInfo;

