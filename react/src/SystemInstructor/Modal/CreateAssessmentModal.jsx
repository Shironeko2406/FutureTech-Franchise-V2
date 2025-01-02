import {
  Button,
  Card,
  Form,
  Input,
  Typography,
  InputNumber,
  Modal,
  Select,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { CreateAssessmentActionAsync } from "../../Redux/ReducerAPI/CourseReducer";
import { useLoading } from "../../Utils/LoadingContext";

const CreateAssessmentModal = ({ isDrawerVisible, closeDrawer }) => {
  const { assessments } = useSelector((state) => state.CourseReducer);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { id } = useParams();
  const { setLoading } = useLoading();

  const updateNumbers = () => {
    const items = form.getFieldValue("items");
    const updatedItems = items.map((item, index) => ({ ...item, number: index + 1 }));
    form.setFieldsValue({ items: updatedItems });
  };

  const onSubmit = (values) => {
    setLoading(true);
    dispatch(CreateAssessmentActionAsync(values.items, id))
      .then((response) => {
        setLoading(false);
        if (response) {
          closeDrawer();
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <Modal
      title="Tạo tiêu chí đánh giá"
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
            Tạo
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        name="assessment_form"
        style={{
          width: "100%",
        }}
        autoComplete="off"
        initialValues={{
          items: assessments.map(({ id, courseId, ...rest }) => ({
            number: rest.number || 0,
            type: rest.type || "Attendance",
            content: rest.content || "",
            quantity: rest.quantity || 0,
            weight: rest.weight || 0,
            completionCriteria: rest.completionCriteria || 0,
          })),
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
                  title={`Đánh giá ${form.getFieldValue(['items', field.name, 'number'])}`}
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
                  <Form.Item label="Số" name={[field.name, "number"]}>
                    <InputNumber min={0} disabled />
                  </Form.Item>
                  <Form.Item label="Loại" name={[field.name, "type"]}>
                    <Select>
                      <Select.Option value="Attendance">Attendance (Điểm danh)</Select.Option>
                      <Select.Option value="Quiz">Quiz (Kiểm tra trắc nghiệm)</Select.Option>
                      <Select.Option value="Assignment">Assignment (Bài tập thực hành)</Select.Option>
                      <Select.Option value="FinalExam">FinalExam (Kiểm tra cuối khóa)</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="Nội dung" name={[field.name, "content"]}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="Số lượng" name={[field.name, "quantity"]}>
                    <InputNumber min={0} />
                  </Form.Item>
                  <Form.Item label="Trọng số" name={[field.name, "weight"]}>
                    <InputNumber min={0} max={100} />
                  </Form.Item>
                  <Form.Item
                    label="Tiêu chí hoàn thành"
                    name={[field.name, "completionCriteria"]}
                  >
                    <InputNumber min={0} max={100} />
                  </Form.Item>
                </Card>
              ))}

              <Button
                type="dashed"
                onClick={() => {
                  add({
                    number: fields.length,
                    type: "Attendance",
                    content: "",
                    quantity: 0,
                    weight: 0,
                    completionCriteria: 0,
                  });
                  updateNumbers();
                }}
                block
              >
                + Thêm đánh giá
              </Button>
            </div>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default CreateAssessmentModal;

