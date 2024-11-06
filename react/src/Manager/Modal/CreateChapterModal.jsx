import { Button, Drawer, Form, InputNumber, Input } from "antd";
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
    <Drawer
      title="Tạo chương"
      width={550}
      onClose={closeDrawer}
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
          label="Số chương"
          name="number"
          rules={[{ required: true, message: "Vui lòng nhập số chapter!" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
        
        <Form.Item
          label="Chủ đề"
          name="topic"
          rules={[{ required: true, message: "Vui lòng nhập chủ đề!" }]}
        >
          <Input placeholder="Nhập chủ đề của chapter" />
        </Form.Item>
        
        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả chapter!" }]}
        >
          <Input.TextArea rows={4} placeholder="Nhập mô tả của chapter" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default CreateChapterModal;
