import React, { useState } from 'react'
import { Button, DatePicker, Input, Modal, Form, Select, Typography, Space, message, Upload } from 'antd';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useLoading } from '../../Utils/LoadingContext';
import styled from 'styled-components';
import { CreateAssignmentActionAsync } from '../../Redux/ReducerAPI/AssignmentReducer';
import { imageDB } from '../../Firebasse/Config';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title } = Typography;
const { RangePicker } = DatePicker;

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
`;

const StyledForm = styled(Form)`
  .ant-input,
  .ant-input-number,
  .ant-picker,
  .ant-select-selector {
    border-radius: 6px;
  }
`;

const CreateAssignmentModal = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { id: classId } = useParams();
  const { setLoading } = useLoading();
  const [fileList, setFileList] = useState([])
  const [fileUrl, setFileUrl] = useState("");

  const handleUpload = ({ file, onSuccess, onError }) => {
    const storageRef = ref(imageDB, `assignments/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        message.error("Upload failed!")
        console.error(error)
        onError(error)
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          setFileUrl(downloadURL)
          setFileList([
            {
              uid: file.uid,
              name: file.name,
              status: 'done',
              url: downloadURL,
            },
          ])
          form.setFieldsValue({ fileURL: downloadURL })
          message.success("Upload successful!")
          onSuccess(null, file)
        } catch (err) {
          message.error("Failed to retrieve file URL.")
          console.error(err)
          onError(err)
        }
      }
    )
  }

  const handleSubmit = (values) => {
    setLoading(true);
    const data = {
        ...values,
        startTime: values.dateRange[0].format('YYYY-MM-DDTHH:mm:ss[Z]'),
        endTime: values.dateRange[1].format('YYYY-MM-DDTHH:mm:ss[Z]'),
        classId,
        fileURL: fileUrl
    };

    delete data.dateRange;

    dispatch(CreateAssignmentActionAsync(data))
      .then((response) => {
        setLoading(false);
        if (response) {
          form.resetFields();
          onClose();
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error('Error creating assignment:', err);
      });
  };

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
      name: 'fileURL',
      label: 'File đề bài',
      rules: [{ required: true, message: 'Vui lòng tải lên tệp PDF!' }],
      valuePropName: "file",
      getValueFromEvent: (e) => e && e.fileList,
      component: (
        <Upload
          customRequest={handleUpload}
          fileList={fileList}
          onChange={({ fileList }) => setFileList(fileList)}
          accept=".pdf"
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Tải lên tệp PDF</Button>
        </Upload>
      ),
    },
  ];

  return (
    <StyledModal
      title={<Title level={3}>Tạo Bài Tập</Title>}
      style={{top:20}}
      open={visible}
      onCancel={onClose}
      footer={
        <Space>
          <Button onClick={onClose}>Hủy</Button>
          <Button onClick={() => form.submit()} type="primary">
            Tạo
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

export default CreateAssignmentModal
