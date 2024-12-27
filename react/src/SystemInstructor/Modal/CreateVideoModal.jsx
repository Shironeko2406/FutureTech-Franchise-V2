import React, { useEffect } from "react";
import { Modal, Form, Button, Upload, message, Input, Space } from "antd";
import { InboxOutlined, CopyOutlined } from "@ant-design/icons";
import { useLoading } from "../../Utils/LoadingContext";
import { useDispatch, useSelector } from "react-redux";
import { CreateVideoActionAsync } from "../../Redux/ReducerAPI/VideoReducer";

const { Dragger } = Upload;

const CreateVideoModal = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { setLoading } = useLoading();
  const { videoUrlCopy } = useSelector((state) => state.VideoReducer);

  const handleUpload = ({ file, onSuccess, onError }) => {
    if (file.type !== "video/mp4") {
      message.error("You can only upload MP4 video files!");
      onError("File type error");
    } else {
      onSuccess(file);
    }
  };

  const handleSubmit = async (values) => {
    const videoFile = values.video[0].originFileObj;
    const fileName = videoFile.name;

    const formData = new FormData();
    formData.append("videoFile", videoFile);

    setLoading(true);
    dispatch(CreateVideoActionAsync(fileName, formData)).finally(() => setLoading(false));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(videoUrlCopy)
      .then(() => message.success("Copy thành công"))
      .catch(() => message.error("Copy thất bại"));
  };

  return (
    <Modal
      title="Tải lên video"
      style={{ top: 20 }}
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
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item
          name="video"
          valuePropName="fileList"
          getValueFromEvent={(e) => e.fileList}
          rules={[{ required: true, message: "Vui lòng tải lên video MP4" }]}
        >
          <Dragger
            name="file"
            multiple={false}
            customRequest={handleUpload}
            maxCount={1}
            accept="video/mp4"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Nhấp hoặc kéo file video MP4 vào khu vực này để tải lên
            </p>
          </Dragger>
        </Form.Item>

        {videoUrlCopy && (
          <Form.Item name="videoUrl" label="Video URL">
            <Space.Compact style={{ width: '100%' }}>
              <Input value={videoUrlCopy} readOnly />
              <Button icon={<CopyOutlined />} onClick={handleCopy}>
                Copy
              </Button>
            </Space.Compact>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default CreateVideoModal;

