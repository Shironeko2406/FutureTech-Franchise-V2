import React from "react";
import {
  Button,
  Card,
  Drawer,
  Form,
  Input,
  Typography,
  InputNumber,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { CreateSessionActionAsync } from "../../Redux/ReducerAPI/CourseReducer";

const CreateSessionModal = ({ isDrawerVisible, closeDrawer }) => {
  const { sessions } = useSelector((state) => state.CourseReducer);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { id } = useParams();

  const updateNumbers = () => {
    const items = form.getFieldValue("items");
    const updatedItems = items.map((item, index) => ({ ...item, number: index + 1 }));
    form.setFieldsValue({ items: updatedItems });
  };

  const onSubmit = (values) => {
    dispatch(CreateSessionActionAsync(values.items, id))
      .then((response) => {
        if (response) {
          closeDrawer();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Drawer
      title="Tạo buổi học"
      width={550}
      onClose={closeDrawer}
      open={isDrawerVisible}
      footer={
        <div style={{ textAlign: "right" }}>
          <Button onClick={closeDrawer} className="me-2">
            Hủy
          </Button>
          <Button onClick={() => form.submit()} type="primary">
            Submit
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
    </Drawer>
  );
};

export default CreateSessionModal;
