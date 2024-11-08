import React from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Typography,
  InputNumber,
  Modal,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { CreateSessionActionAsync } from "../../Redux/ReducerAPI/CourseReducer";
import { useLoading } from "../../Utils/LoadingContext";

const CreateSessionModal = ({ isDrawerVisible, closeDrawer }) => {
  const { sessions } = useSelector((state) => state.CourseReducer);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { id } = useParams();
  const {setLoading} = useLoading()

  const updateNumbers = () => {
    const items = form.getFieldValue("items");
    const updatedItems = items.map((item, index) => ({ ...item, number: index + 1 }));
    form.setFieldsValue({ items: updatedItems });
  };

  const onSubmit = (values) => {
    setLoading(true)
    dispatch(CreateSessionActionAsync(values.items, id))
      .then((response) => {
        setLoading(false)
        if (response) {
          closeDrawer();
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
      width={700}
      styles={{ body: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}}
      style={{top: 20}}
      onCancel={closeDrawer}
      open={isDrawerVisible}
      footer={
        <div style={{ textAlign: "right" }}>
          <Button onClick={closeDrawer} className="me-2" danger>
            Hủy
          </Button>
          <Button onClick={() => form.submit()} type="primary">
            Nộp
          </Button>
        </div>
      }
    >
      <Form
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 18 }}
        form={form}
        name="session_form"
        style={{ width: "100%" }}
        autoComplete="off"
        initialValues={{
          items: sessions.map(({ id, courseId, ...rest }) => rest),
        }}
        onFinish={onSubmit}
      >
        <Form.List name="items">
          {(fields, { add, remove }) => (
            <div
              style={{
                display: "flex",
                rowGap: 16,
                flexDirection: "column",
              }}
            >
              {fields.map((field) => (
                <Card
                  size="small"
                  title={`Buổi học ${field.name + 1}`}
                  key={field.key}
                  extra={
                    <CloseOutlined
                      onClick={() => {
                        remove(field.name);
                        updateNumbers();
                      }}
                    />
                  }
                >
                  <Form.Item label="Buổi" name={[field.name, "number"]}>
                    <InputNumber min={0} disabled />
                  </Form.Item>
                  <Form.Item label="Chương" name={[field.name, "chapter"]}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="Chủ đề" name={[field.name, "topic"]}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Mô tả"
                    name={[field.name, "description"]}
                  >
                    <Input.TextArea rows={4} />
                  </Form.Item>
                </Card>
              ))}

              <Button
                type="dashed"
                onClick={() => {
                  add();
                  updateNumbers();
                }}
                block
              >
                + Thêm buổi học
              </Button>
            </div>
          )}
        </Form.List>

        <Form.Item noStyle shouldUpdate>
          {() => (
            <Typography>
              <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
            </Typography>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateSessionModal;
