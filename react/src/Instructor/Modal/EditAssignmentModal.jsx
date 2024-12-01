import React, { useEffect } from 'react'
import { Button, DatePicker, Input, Modal, Form, Select, Typography, Space } from 'antd'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useLoading } from '../../Utils/LoadingContext'
import styled from 'styled-components'
import dayjs from 'dayjs'
import { UpdateAssignmentActionAsync } from '../../Redux/ReducerAPI/AssignmentReducer'

const { TextArea } = Input
const { Title } = Typography
const { RangePicker } = DatePicker

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  .ant-modal-header {
    border-bottom: none;
    padding: 24px 24px 0;
  }
  .ant-modal-body {
    padding: 24px;
  }
  .ant-form-item-label > label {
    font-weight: 600;
  }
`

const StyledForm = styled(Form)`
  .ant-input,
  .ant-input-number,
  .ant-picker,
  .ant-select-selector {
    border-radius: 6px;
  }
`

const EditAssignmentModal = ({ visible, onClose, assignment }) => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const { id: classId } = useParams()
  const { setLoading } = useLoading()

  useEffect(() => {
    if (assignment) {
      form.setFieldsValue({
        title: assignment.title,
        description: assignment.description,
        dateRange: [
          dayjs(assignment.startTime),
          dayjs(assignment.endTime)
        ],
        status: assignment.status
      })
    }
  }, [assignment, form])

  const handleSubmit = (values) => {
    setLoading(true)
    const data = {
      ...values,
      startTime: values.dateRange[0].format('YYYY-MM-DDTHH:mm:ss[Z]'),
      endTime: values.dateRange[1].format('YYYY-MM-DDTHH:mm:ss[Z]'),
      classId,
      id: assignment.id // Include the assignment ID for updating
    }

    delete data.dateRange

    dispatch(UpdateAssignmentActionAsync(data, assignment.id))
      .then(() => {
        setLoading(false)
        onClose()
      })
      .catch((error) => {
        console.error('Error updating assignment:', error)
        setLoading(false)
      })
  }

  const formItems = [
    {
      name: 'title',
      label: 'Tiêu đề',
      rules: [{ required: true, message: 'Vui lòng nhập tiêu đề bài kiểm tra!' }],
      component: <Input placeholder="Nhập tiêu đề bài tập" />,
    },
    {
      name: 'description',
      label: 'Mô tả',
      rules: [{ required: true, message: 'Vui lòng nhập mô tả!' }],
      component: <TextArea placeholder="Nhập mô tả bài tập" autoSize={{ minRows: 3, maxRows: 6 }} />,
    },
    {
      name: 'dateRange',
      label: 'Thời gian bắt đầu và kết thúc',
      rules: [{ required: true, message: 'Vui lòng chọn thời gian!' }],
      component: <RangePicker showTime format="DD/MM/YYYY, HH:mm" style={{ width: '100%' }} />,
    },
    {
      name: 'status',
      label: 'Trạng thái',
      rules: [{ required: true, message: 'Vui lòng chọn trạng thái!' }],
      component: (
        <Select
          placeholder="Chọn trạng thái"
          options={[
            { label: 'Mở', value: 'Open' },
            { label: 'Đóng', value: 'Close' },
          ]}
          style={{ width: '100%' }}
        />
      ),
    },
  ]

  return (
    <StyledModal
      title={<Title level={3}>Chỉnh sửa bài Tập</Title>}
      style={{top:20}}
      open={visible}
      onCancel={onClose}
      footer={
        <Space>
          <Button onClick={onClose}>Hủy</Button>
          <Button onClick={() => form.submit()} type="primary">
            Cập nhật
          </Button>
        </Space>
      }
      width={600}
    >
      <StyledForm form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
        {formItems.map((item) => (
          <Form.Item key={item.name} name={item.name} label={item.label} rules={item.rules}>
            {item.component}
          </Form.Item>
        ))}
      </StyledForm>
    </StyledModal>
  )
}

export default EditAssignmentModal

