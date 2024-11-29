import React, { useEffect, useState } from 'react'
import { Modal, Typography, Space, Tag, Avatar, Card, Tabs, Tooltip, Button, Select, message } from 'antd'
import { CalendarOutlined, ClockCircleOutlined, FileTextOutlined, TeamOutlined, LinkOutlined, PlusOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { useLoading } from '../../Utils/LoadingContext'
import DOMPurify from 'dompurify';
import { UpdateUserListInAppointmentActionAsync } from '../../Redux/ReducerAPI/AppointmentReducer'
import { getDataJSONStorage } from '../../Utils/UtilsFunction'
import { USER_LOGIN } from '../../Utils/Interceptors'

const { Title, Text } = Typography

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 12px;
    overflow: hidden;
  }
  .ant-modal-body {
    padding: 0;
    max-height: calc(100vh - 200px);
    overflow-y: auto;
  }
`

const StyledCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  margin-bottom: 16px;
`

const DetailItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
`

const IconWrapper = styled.span`
  margin-right: 8px;
  font-size: 18px;
  color: #1890ff;
`

const AvatarGroup = styled.div`
  display: flex;
  margin-right: 8px;
`

const ParticipantTag = styled(Tag)`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 16px;
`

const StyledAvatar = styled(Avatar)`
  cursor: pointer;
  &:not(:first-child) {
    margin-left: -8px;
  }
`

const AddButton = styled(Button)`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
`
const HTMLContent = styled.div`
  h1, h2, h3, h4, h5, h6 {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
  ul, ol {
    padding-left: 20px;
  }
`;

const translateRole = (role) => ({
  Manager: "Quản lý",
  SystemInstructor: "Giảng viên hệ thống",
  SystemConsultant: "Tư vấn viên hệ thống",
  SystemTechnician: "Kỹ thuật viên hệ thống",
}[role] || "Không xác định");

export default function ViewAppointmentDetailModal({ visible, onClose, selectedType }) {
  const { appointmentDetail } = useSelector((state) => state.AppointmentReducer);
  const { agencyStatus } = useSelector((state) => state.AgencyReducer);
  const { taskDetail } = useSelector((state) => state.WorkReducer);
  const { userManager } = useSelector((state) => state.UserReducer);
  const dispatch = useDispatch()
  const idUserCreateAppointment = getDataJSONStorage(USER_LOGIN).id
  const { setLoading } = useLoading()
  const [isSelectingUsers, setIsSelectingUsers] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState([]);

  const filterUsersByRole = (user, type) => {
    const rolePermissions = {
      Manager: [
        'Interview', 'AgreementSigned', 'BusinessRegistered', 'SiteSurvey',
        'Design', 'Quotation', 'SignedContract', 'ConstructionAndTrainning',
        'Handover', 'EducationLicenseRegistered',
      ],
      SystemTechnician: ['Design', 'Quotation', 'SiteSurvey', 'ConstructionAndTrainning'],
      SystemInstructor: ['ConstructionAndTrainning', 'EducationLicenseRegistered'],
    };
  
    return rolePermissions[user.role]?.includes(type);
  };

  useEffect(() => {
    if (appointmentDetail.user) {
      setSelectedUsers(appointmentDetail.user.map(user => user.id))
    }
  }, [appointmentDetail])

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAddUsers = () => {
    setIsSelectingUsers(true)
  }

  const handleUserSelection = (selectedUserIds) => {
    setSelectedUsers(selectedUserIds)
  }

  const handleConfirmAddUsers = () => {
    setLoading(true)
    // Tập hợp các userId cần loại trừ
    const existingUserIds = new Set([
      ...appointmentDetail.user.map((user) => user.id),
      idUserCreateAppointment,
    ]);

    // Lọc các userId mới
    const newUserIds = selectedUsers.filter((userId) => !existingUserIds.has(userId));

    const notificationData = {
      userIds: newUserIds, //lọc và loại ra những userId dẵ nằm trong appoinment và idUserCreateAppointment chỉ gởi thông báo người mới được thêm
      message: appointmentDetail.title
    }
    dispatch(UpdateUserListInAppointmentActionAsync(selectedUsers, appointmentDetail.id, notificationData)).finally(() => { setLoading(false); setIsSelectingUsers(false) })
  }

  const renderUserSelection = () => (
    <>
      <div className='mb-3'>
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Thêm nhân viên"
          onChange={handleUserSelection}
          value={selectedUsers}
          showSearch
          filterOption={(input, option) =>
            option?.children?.toLowerCase().includes(input.toLowerCase())
          }
          optionLabelProp="label"
        >
          {userManager
            .filter((user) => filterUsersByRole(user, selectedType))
            .map((user) => (
              <Select.Option
                key={user.id}
                value={user.id}
                label={user.userName}
              >
                {`${user.userName} (${translateRole(user.role)})`}
              </Select.Option>
            ))}
        </Select>
      </div>

      <div className="d-flex justify-content-end gap-2">
        <Button onClick={() => setIsSelectingUsers(false)}>Hủy</Button>
        <Button type="primary" onClick={handleConfirmAddUsers}>Cập nhật</Button>
      </div>
    </>
  )

  // const renderAvatars = () => {
  //   const users = appointmentDetail.user || [];
  //   const visibleUsers = users.slice(0, 3);
  //   const remainingUsers = users.slice(3);

  //   return (
  //     <AvatarGroup>
  //       {visibleUsers.map((user) => (
  //         <Tooltip key={user.id} title={user.fullName}>
  //           <StyledAvatar>{user.username?.[0] || '?'}</StyledAvatar>
  //         </Tooltip>
  //       ))}
  //       {remainingUsers.length > 0 && (
  //         <Tooltip
  //           title={
  //             <div>
  //               {remainingUsers.map((user) => (
  //                 <div key={user.id}>{user.fullName}</div>
  //               ))}
  //             </div>
  //           }
  //         >
  //           <StyledAvatar style={{ backgroundColor: '#1890ff' }}>
  //             +{remainingUsers.length}
  //           </StyledAvatar>
  //         </Tooltip>
  //       )}
  //     </AvatarGroup>
  //   );
  // };

  const sanitizeHTML = (html) => {
    return {
      __html: DOMPurify.sanitize(html)
    };
  };

  const renderParticipants = () => {
    const user = appointmentDetail.user || []
    return (
      <div className='d-flex flex-wrap gap-2 mb-3'>
        {user.map((user) => (
          <ParticipantTag key={user.id} color="blue">
            <Avatar size="small">{user.username?.[0] || '?'}</Avatar>
            <span>{user.fullName}</span>
          </ParticipantTag>
        ))}
      </div>
    )
  }

  return (
    <StyledModal
      open={visible}
      onCancel={onClose}
      footer={null}
      title={
        <Space direction="vertical" size={0}>
          <Title level={4}>{appointmentDetail.title || 'Untitled Appointment'}</Title>
          <Tag color={appointmentDetail.type === 'Internal' ? 'blue' : 'green'}>
            {appointmentDetail.type === 'Internal' ? 'Nội bộ' : 'Với bên liên quan'}
          </Tag>
        </Space>
      }
      width={650}
    >
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: '1',
            label: 'Thông tin',
            children: (
              <StyledCard>
                <DetailItem>
                  <IconWrapper><CalendarOutlined /></IconWrapper>
                  <Space direction="vertical" size={0}>
                    <Text strong>Bắt đầu:</Text>
                    <Text>{formatDate(appointmentDetail.startTime)}</Text>
                  </Space>
                </DetailItem>
                <DetailItem>
                  <IconWrapper><ClockCircleOutlined /></IconWrapper>
                  <Space direction="vertical" size={0}>
                    <Text strong>Kết thúc:</Text>
                    <Text>{formatDate(appointmentDetail.endTime)}</Text>
                  </Space>
                </DetailItem>
              </StyledCard>
            ),
          },
          {
            key: '2',
            label: 'Nội dung',
            children: (
              <StyledCard>
                <DetailItem>
                  <IconWrapper><FileTextOutlined /></IconWrapper>
                  <Space direction="vertical" size={0}>
                    <Text strong>Mô tả:</Text>
                    {appointmentDetail?.description ? (
                      <HTMLContent dangerouslySetInnerHTML={sanitizeHTML(appointmentDetail.description)} />
                    ) : (
                      <Text>Không có mô tả</Text>
                    )}
                  </Space>
                </DetailItem>
                <DetailItem>
                  <IconWrapper><FileTextOutlined /></IconWrapper>
                  <Space direction="vertical" size={0}>
                    <Text strong>Báo cáo:</Text>
                    <Text>{appointmentDetail.report || 'No report available'}</Text>
                    {appointmentDetail.reportImageURL && (
                      <a href={appointmentDetail.reportImageURL} target="_blank" rel="noopener noreferrer">
                        <LinkOutlined /> Xem thêm
                      </a>
                    )}
                  </Space>
                </DetailItem>
              </StyledCard>
            ),
          },
          {
            key: '3',
            label: 'Người tham gia',
            children: (
              <StyledCard>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Space>
                    <TeamOutlined style={{ fontSize: 18, color: '#1890ff' }} />
                    <Text strong>Danh sách người tham gia:</Text>
                  </Space>

                  {isSelectingUsers ? renderUserSelection() : (
                    <>
                      {/* {renderAvatars()} */}
                      {renderParticipants()}
                      {taskDetail?.status === "None" &&
                        ['Processing', 'Approved'].includes(agencyStatus) && (
                          <Button icon={<PlusOutlined />} onClick={handleAddUsers}>
                            Thêm người tham gia
                          </Button>
                        )}
                    </>
                  )}

                </Space>
              </StyledCard>
            ),
          },
        ]}
      />
    </StyledModal>
  )
}



// import React, { useState, useEffect } from 'react'
// import { Modal, Typography, Space, Tag, Avatar, Card, Tabs, Tooltip, Button, Select } from 'antd'
// import { CalendarOutlined, ClockCircleOutlined, FileTextOutlined, TeamOutlined, LinkOutlined, PlusOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
// import styled from 'styled-components'
// import { useSelector } from 'react-redux'

// const { Title, Text } = Typography

// const StyledModal = styled(Modal)`
//   .ant-modal-content {
//     border-radius: 12px;
//     overflow: hidden;
//   }
//   .ant-modal-body {
//     padding: 0;
//     max-height: calc(100vh - 200px);
//     overflow-y: auto;
//   }
// `

// const StyledCard = styled(Card)`
//   border-radius: 8px;
//   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
//   margin-bottom: 16px;
// `

// const DetailItem = styled.div`
//   display: flex;
//   align-items: flex-start;
//   margin-bottom: 12px;
// `

// const IconWrapper = styled.span`
//   margin-right: 8px;
//   font-size: 18px;
//   color: #1890ff;
// `

// const ParticipantList = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 8px;
//   margin-bottom: 16px;
// `

// const ParticipantTag = styled(Tag)`
//   display: flex;
//   align-items: center;
//   gap: 4px;
//   padding: 4px 8px;
//   border-radius: 16px;
// `

// const SelectWrapper = styled.div`
//   margin-bottom: 16px;
// `

// const ButtonGroup = styled.div`
//   display: flex;
//   justify-content: flex-end;
//   gap: 8px;
// `

// export default function ViewAppointmentDetail({ visible, onClose }) {
//   const { appointmentDetail } = useSelector((state) => state.AppointmentReducer)
//   const { userManager } = useSelector((state) => state.UserReducer)
//   const [isSelectingUsers, setIsSelectingUsers] = useState(false)
//   const [selectedUsers, setSelectedUsers] = useState([])
//   const [participants, setParticipants] = useState([])

//   useEffect(() => {
//     if (appointmentDetail.user) {
//       setParticipants(appointmentDetail.user)
//       setSelectedUsers(appointmentDetail.user.map(user => user.id))
//     }
//   }, [appointmentDetail])

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Not set'
//     const date = new Date(dateString)
//     return date.toLocaleString('vi-VN', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     })
//   }

//   const handleAddUsers = () => {
//     setIsSelectingUsers(true)
//   }

//   const handleUserSelection = (selectedUserIds) => {
//     setSelectedUsers(selectedUserIds)
//   }

//   const handleConfirmAddUsers = () => {
//     const newParticipants = userManager.filter(user => selectedUsers.includes(user.id))
//     setParticipants(newParticipants)
//     setIsSelectingUsers(false)
//   }

//   const handleCancelAddUsers = () => {
//     setSelectedUsers(participants.map(user => user.id))
//     setIsSelectingUsers(false)
//   }

//   const translateRole = (role) => ({
//     Manager: "Quản lý",
//     SystemInstructor: "Giảng viên hệ thống",
//     SystemConsultant: "Tư vấn viên hệ thống",
//     SystemTechnician: "Kỹ thuật viên hệ thống",
//   }[role] || "Không xác định")

//   const renderParticipants = () => (
//     <ParticipantList>
//       {participants.map((user) => (
//         <ParticipantTag key={user.id} color="blue">
//           <Avatar size="small">{user.username?.[0] || '?'}</Avatar>
//           <span>{user.fullName}</span>
//         </ParticipantTag>
//       ))}
//     </ParticipantList>
//   )

//   const renderUserSelection = () => (
//     <>
//       <SelectWrapper>
//         <Select
//           mode="multiple"
//           style={{ width: '100%' }}
//           placeholder="Thêm nhân viên"
//           onChange={handleUserSelection}
//           value={selectedUsers}
//           showSearch
//           filterOption={(input, option) =>
//             option?.label?.toLowerCase().includes(input.toLowerCase())
//           }
//           options={userManager.map(user => ({
//             value: user.id,
//             label: `${user.userName} (${translateRole(user.role)})`,
//           }))}
//         />
//       </SelectWrapper>
//       <ButtonGroup>
//         <Button icon={<CloseOutlined />} onClick={handleCancelAddUsers}>Hủy</Button>
//         <Button type="primary" icon={<CheckOutlined />} onClick={handleConfirmAddUsers}>Xác nhận</Button>
//       </ButtonGroup>
//     </>
//   )

//   return (
//     <StyledModal
//       open={visible}
//       onCancel={onClose}
//       footer={null}
//       title={
//         <Space direction="vertical" size={0}>
//           <Title level={4}>{appointmentDetail.title || 'Untitled Appointment'}</Title>
//           <Tag color={appointmentDetail.type === 'Internal' ? 'blue' : 'green'}>
//             {appointmentDetail.type || 'Unspecified'}
//           </Tag>
//         </Space>
//       }
//       width={600}
//     >
//       <Tabs
//         defaultActiveKey="1"
//         items={[
//           {
//             key: '1',
//             label: 'Thông tin',
//             children: (
//               <StyledCard>
//                 <DetailItem>
//                   <IconWrapper><CalendarOutlined /></IconWrapper>
//                   <Space direction="vertical" size={0}>
//                     <Text strong>Bắt đầu:</Text>
//                     <Text>{formatDate(appointmentDetail.startTime)}</Text>
//                   </Space>
//                 </DetailItem>
//                 <DetailItem>
//                   <IconWrapper><ClockCircleOutlined /></IconWrapper>
//                   <Space direction="vertical" size={0}>
//                     <Text strong>Kết thúc:</Text>
//                     <Text>{formatDate(appointmentDetail.endTime)}</Text>
//                   </Space>
//                 </DetailItem>
//               </StyledCard>
//             ),
//           },
//           {
//             key: '2',
//             label: 'Nội dung',
//             children: (
//               <StyledCard>
//                 <DetailItem>
//                   <IconWrapper><FileTextOutlined /></IconWrapper>
//                   <Space direction="vertical" size={0}>
//                     <Text strong>Mô tả:</Text>
//                     <Text>{appointmentDetail.description || 'No description provided'}</Text>
//                   </Space>
//                 </DetailItem>
//                 <DetailItem>
//                   <IconWrapper><FileTextOutlined /></IconWrapper>
//                   <Space direction="vertical" size={0}>
//                     <Text strong>Báo cáo:</Text>
//                     <Text>{appointmentDetail.report || 'No report available'}</Text>
//                     {appointmentDetail.reportImageURL && (
//                       <a href={appointmentDetail.reportImageURL} target="_blank" rel="noopener noreferrer">
//                         <LinkOutlined /> Xem thêm
//                       </a>
//                     )}
//                   </Space>
//                 </DetailItem>
//               </StyledCard>
//             ),
//           },
//           {
//             key: '3',
//             label: 'Người tham gia',
//             children: (
//               <StyledCard>
//                 <Space direction="vertical" style={{ width: '100%' }}>
//                   <Space>
//                     <TeamOutlined style={{ fontSize: 18, color: '#1890ff' }} />
//                     <Text strong>Danh sách người tham gia:</Text>
//                   </Space>
//                   {isSelectingUsers ? renderUserSelection() : (
//                     <>
//                       {renderParticipants()}
//                       <Button icon={<PlusOutlined />} onClick={handleAddUsers}>
//                         Thêm người tham gia
//                       </Button>
//                     </>
//                   )}
//                 </Space>
//               </StyledCard>
//             ),
//           },
//         ]}
//       />
//     </StyledModal>
//   )
// }