import {
    Button,
    Card,
    Drawer,
    Form,
    Input,
    Typography,
    InputNumber,
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
    const {setLoading} = useLoading()
  
    const updateNumbers = () => {
      const items = form.getFieldValue("items");
      const updatedItems = items.map((item, index) => ({ ...item, number: index + 1 }));
      form.setFieldsValue({ items: updatedItems });
    };
  
    const onSubmit = (values) => {
      setLoading(true)
      dispatch(CreateAssessmentActionAsync(values.items, id))
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
      <Drawer
        title="Tạo tiêu chí đánh giá"
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
        <Form
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 18 }}
          name="assessment_form"
          style={{
            width: "100%",
          }}
          autoComplete="off"
          initialValues={{
            items: assessments.map(({ id, courseId, ...rest }) => rest),
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
                    title={`Đánh giá ${field.name + 1}`}
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
                      <Input />
                    </Form.Item>
                    <Form.Item label="Nội dung" name={[field.name, "content"]}>
                      <Input />
                    </Form.Item>
                    <Form.Item label="Số lượng" name={[field.name, "quatity"]}>
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
                    <Form.Item label="Hình thức" name={[field.name, "method"]}>
                      <Select
                        options={[
                          { label: "Offline", value: "Offline" },
                          { label: "Online", value: "Online" },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item label="Thời gian" name={[field.name, "duration"]}>
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="	Loại câu hỏi"
                      name={[field.name, "questionType"]}
                    >
                      <Input />
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
                  + Thêm đánh giá
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
  
  export default CreateAssessmentModal;
  