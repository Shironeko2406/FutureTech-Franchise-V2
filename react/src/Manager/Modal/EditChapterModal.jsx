import React, { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { EditChapterByIdActionAsync } from "../../Redux/ReducerAPI/ChapterReducer";
import { useLoading } from "../../Utils/LoadingContext";

const EditChapterModal = ({ visible, onClose, chapter }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { id } = useParams();
  const {setLoading} = useLoading()

  useEffect(() => {
    if (chapter) {
      form.setFieldsValue({
        topic: chapter.topic,
        description: chapter.description,
      });
    }
  }, [chapter]);

  const onSubmit = (value) => {
    const dataEdit = { ...value, number: chapter.number };
    setLoading(true)
    dispatch(EditChapterByIdActionAsync(chapter.id, dataEdit, id))
      .then((response) => {
        setLoading(false)
        if (response) {
          onClose();
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false)
      });
  };

  return (
    <Modal
      title={chapter ? `Chỉnh sửa chương ${chapter.number}` : "Chỉnh sửa chương"}
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
        requiredMark={false}
        form={form}
        layout="vertical"
        name="editChapterForm"
        onFinish={onSubmit}
      >
        <Form.Item
          label="Chủ đề"
          name="topic"
          rules={[{ required: true, message: "Vui lòng nhập chủ đề!" }]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <Input.TextArea rows={5} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditChapterModal;
