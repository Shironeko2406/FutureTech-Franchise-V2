import { EditOutlined } from '@ant-design/icons'
import { Typography } from 'antd';
import React from 'react'

const { Title } = Typography;


const AgencyEdit = () => {
  return (
    <Card>
      <Title level={4}>
        <EditOutlined /> Chỉnh sửa chi nhánh
      </Title>
      
    </Card>
  )
}

export default AgencyEdit
