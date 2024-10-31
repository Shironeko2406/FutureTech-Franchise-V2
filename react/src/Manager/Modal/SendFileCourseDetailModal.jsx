import { Button, Form, Modal, Upload } from "antd";
import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { CreateCourseDetailByFileActionAsync } from "../../Redux/ReducerAPI/CourseReducer";
import { useLoading } from "../../Utils/LoadingContext";

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

  return (
    <Modal
      title="Thêm file"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} danger>
          Thoát
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Xác nhận
        </Button>,
      ]}
    >
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
          <Upload accept=".xlsx" maxCount={1} customRequest={handleUpload}>
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
          <Upload accept=".xlsx" maxCount={1} customRequest={handleUpload}>
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
          <Upload accept=".xlsx" maxCount={1} customRequest={handleUpload}>
            <Button icon={<UploadOutlined />}>Chọn file</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SendFileCourseDetailModal;
