import { Button, Card, List, Select, Typography } from 'antd';
import React from 'react'
import styled from 'styled-components';

const { Title, Text } = Typography;
const { Option } = Select;

const StyledCard = styled(Card)`
  .ant-card-head-title {
    text-align: center;
  }
`;

const MilestoneButton = styled(Button)`
  height: 140px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  border-radius: 8px;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }

  ${props => props.selected && `
    border-color: #1890ff;
    border-width: 2px;
    background-color: #e6f7ff;
  `}
`;

const ScrollableDiv = styled.div`
  height: 500px;
  overflow-y: auto;

  @media (max-width: 768px) {
    height: 300px;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

const StatusTag = styled.span`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: white;
`;

const CompulsoryTask = styled(List.Item)`
  background-color: #fff1f0 !important;
`;

// Helper functions
const getTypeStatusColor = (status) => {
    switch (status) {
      case "Completed": return '#52c41a';
      case "In Progress": return '#faad14';
      case "Incomplete": return '#f5222d';
      case "Pending":
      default: return '#d9d9d9';
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
  
  const getSubmitColor = (submit) => {
    switch (submit) {
      case "Submited": return '#1890ff';
      case "None":
      default: return '#faad14';
    }
  };

const AgencyActiveDetail = () => {
  return (
    <div>AgencyActiveDetail</div>
  )
}

export default AgencyActiveDetail