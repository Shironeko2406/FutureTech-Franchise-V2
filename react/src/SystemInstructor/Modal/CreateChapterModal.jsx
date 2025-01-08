import { Button, Drawer, Form, InputNumber, Input, Modal } from "antd";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CreateChapterActionAsync } from "../../Redux/ReducerAPI/ChapterReducer";
import { useLoading } from "../../Utils/LoadingContext";

const CreateChapterModal = ({ isDrawerVisible, closeDrawer }) => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const dispatch = useDispatch();
  const {setLoading} = useLoading()

  const onSubmit = (value) => {
    const chapterData = {...value, courseId: id}
    setLoading(true)
    dispatch(CreateChapterActionAsync(chapterData))
      .then((response) => {
        setLoading(false)
        if (response) {
          closeDrawer();
          form.resetFields();
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false)
      });
  };

  return (
    <Modal
      title="Tạo buổi học"
      width={550}
      onCancel={closeDrawer}
      open={isDrawerVisible}
      footer={
        <div style={{ textAlign: "right" }}>
          <Button onClick={closeDrawer} className="me-2" danger>
            Hủy
          </Button>
          <Button onClick={() => form.submit()} type="primary">
            Tạo
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" onFinish={onSubmit} requiredMark={false}>
        <Form.Item
          label="Buổi thứ"
          name="number"
          rules={[{ required: true, message: "Vui lòng nhập số buổi học!" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
        
        <Form.Item
          label="Chủ đề"
          name="topic"
          rules={[{ required: true, message: "Vui lòng nhập chủ đề!" }]}
        >
          <Input placeholder="Nhập chủ đề của buổi học" />
        </Form.Item>
        
        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả buổi học!" }]}
        >
          <Input.TextArea rows={4} placeholder="Nhập mô tả của buổi học" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateChapterModal;
