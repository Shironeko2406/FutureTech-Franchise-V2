import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Upload } from "antd";
import React, { useState } from "react";
import { imageDB } from "../../Firebasse/Config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useDispatch } from "react-redux";
import { CreateMaterialChapterIdActionAsync } from "../../Redux/ReducerAPI/CourseReducer";
import { useParams } from "react-router-dom";
import { useLoading } from "../../Utils/LoadingContext";

const CreateMaterialModal = ({ visible, onClose, chapter }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [fileURL, setFileURL] = useState(null);
  const { setLoading } = useLoading();

  const handleUpload = async ({ file, onSuccess }) => {
    try {
      const storageRef = ref(imageDB, `pdfs/${file.name}`);

      await uploadBytes(storageRef, file);

      const url = await getDownloadURL(storageRef);
      setFileURL(url);

      onSuccess(file);
      message.success("Tải lên thành công");
    } catch (error) {
      console.error("Upload failed:", error);
      message.error("Có lỗi xảy ra trong quá trình tải lên:");
    }

    return false;
  };

  const onSubmit = (value) => {
    const sendData = { ...value, url: fileURL, chapterId: chapter.id };
    setLoading(true);
    dispatch(CreateMaterialChapterIdActionAsync(sendData, id))
      .then((response) => {
        setLoading(false);
        if (response) {
          onClose();
          form.resetFields();
          setFileURL(null);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <Modal
      title={
        chapter
          ? `Thêm tài nguyên chương ${chapter.number}`
          : "Thêm tài nguyên chương"
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} danger>
          Thoát
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Thêm
        </Button>,
      ]}
    >
      <Form
        requiredMark={false}
        form={form}
        layout="vertical"
        name="createMaterialForm"
        onFinish={onSubmit}
      >
        <Form.Item
          label="Số thứ tự"
          name="number"
          rules={[{ required: true, message: "Vui lòng nhập số thứ tự!" }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          label="URL (Tải lên tệp)"
          name="url"
          valuePropName="fileList"
          getValueFromEvent={(e) => e.fileList}
          rules={[{ required: true, message: "Vui lòng tải lên tệp!" }]}
        >
          <Upload customRequest={handleUpload} accept=".pdf" maxCount={1}>
            <Button icon={<UploadOutlined />}>Chọn tệp</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateMaterialModal;
