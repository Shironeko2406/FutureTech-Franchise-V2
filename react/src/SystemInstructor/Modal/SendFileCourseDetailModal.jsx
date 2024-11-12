import { Button, Form, Modal, Upload, Space, Typography, Divider } from "antd";
import React from "react";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { CreateCourseDetailByFileActionAsync } from "../../Redux/ReducerAPI/CourseReducer";
import { useLoading } from "../../Utils/LoadingContext";

const { Title, Text } = Typography;

const SendFileCourseDetailModal = ({
  visible,
  onClose,
  status,
  pageIndex,
  pageSize,
  searchTerm,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { setLoading } = useLoading();

  const handleUpload = ({ file, onSuccess, onError }) => {
    // Giả sử upload thành công
    setTimeout(() => {
      onSuccess(file);
    }, 1000);
  };

  const handleSubmit = async (value) => {
    const courseFile = value.courseFile[0].originFileObj;
    const questionFile = value.questionFile[0].originFileObj;
    const chapterMaterialFile = value.chapterMaterialFile[0].originFileObj;

    const formData = new FormData();
    formData.append("CourseFile", courseFile);
    formData.append("QuestionFile", questionFile);
    formData.append("ChapterMaterialFile", chapterMaterialFile);
    console.log(formData)
    setLoading(true);
    dispatch(
      CreateCourseDetailByFileActionAsync(
        formData,
        status,
        pageIndex,
        pageSize,
        searchTerm
      )
    )
      .then((response) => {
        setLoading(false);
        if (response) {
          form.resetFields();
          onClose();
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/FilesTemplate.rar';
    link.download = 'FilesTemplate.rar';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal
      title="Thêm file"
      style={{top:20}}
      open={visible}
      onCancel={onClose}
      width={600}
      footer={[
        <Button key="cancel" onClick={onClose} danger>
          Thoát
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Xác nhận
        </Button>,
      ]}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={5}>Tải xuống mẫu file</Title>
          <Text type="secondary">
            Tải xuống mẫu file để đảm bảo định dạng chính xác cho việc tải lên.
          </Text>
          <Button 
            icon={<DownloadOutlined />} 
            onClick={handleDownloadTemplate}
            type="primary"
            style={{ marginTop: 16 }}
            block
          >
            Tải xuống mẫu file
          </Button>
        </div>

        <Divider />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            name="courseFile"
            label="Tải lên file khóa học"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
            rules={[{ required: true, message: "Vui lòng tải lên file" }]}
          >
            <Upload accept=".xlsx" maxCount={1} customRequest={handleUpload} className="d-flex gap-2">
              <Button icon={<UploadOutlined />}>Chọn file</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="questionFile"
            label="Tải lên file câu hỏi"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
            rules={[{ required: true, message: "Vui lòng tải lên file" }]}
          >
            <Upload accept=".xlsx" maxCount={1} customRequest={handleUpload} className="d-flex gap-2">
              <Button icon={<UploadOutlined />}>Chọn file</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="chapterMaterialFile"
            label="Tải lên file tài nguyên"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
            rules={[{ required: true, message: "Vui lòng tải lên file" }]}
          >
            <Upload accept=".xlsx" maxCount={1} customRequest={handleUpload} className="d-flex gap-2">
              <Button icon={<UploadOutlined />}>Chọn file</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Space>
    </Modal>
  );
};

export default SendFileCourseDetailModal;