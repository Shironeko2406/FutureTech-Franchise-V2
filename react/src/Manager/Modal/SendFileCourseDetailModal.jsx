import { Button, Form, message, Modal, Upload } from "antd";
import React, { useState } from "react";
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
  const [fileList, setFileList] = useState([]);
  const dispatch = useDispatch();
  const { setLoading } = useLoading();

  const handleUpload = ({ file, onSuccess, onError }) => {
    // Giả sử upload thành công
    setTimeout(() => {
      onSuccess(file);
    }, 1000);
  };

  const handleChange = ({ fileList }) => {
    setFileList(fileList); // Cập nhật danh sách file khi thay đổi
  };

  const handleSubmit = async () => {
    const file = fileList[0]?.originFileObj;
    const fileData = new FormData();

    // Đính kèm file vào form data
    fileData.append("file", file);
    setLoading(true);
    dispatch(
      CreateCourseDetailByFileActionAsync(
        fileData,
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
          setFileList([]); // Reset file list
          onClose(); // Đóng modal sau khi reset
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
      <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
        <Form.Item
          name="file"
          label="Tải lên file excel"
          rules={[{ required: true, message: "Vui lòng tải lên file" }]}
        >
          <Upload
            accept=".xlsx"
            fileList={fileList}
            maxCount={1}
            onChange={handleChange}
            onRemove={() => setFileList([])}
            customRequest={handleUpload}
          >
            <Button icon={<UploadOutlined />}>Chọn file</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SendFileCourseDetailModal;
