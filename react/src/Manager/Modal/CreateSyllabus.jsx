import { Button, Drawer, Form, Input, InputNumber, Row, Col } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { CreateSyllabusActionAsync } from "../../Redux/ReducerAPI/SyllabusReducer";

const CreateSyllabus = ({ isDrawerVisible, closeDrawer }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { id } = useParams();

  const onFinish = (values) => {
    const syllabusData = { ...values, courseId: id };
    dispatch(CreateSyllabusActionAsync(syllabusData))
      .then((response) => {
        if (response) {
          closeDrawer();
          form.resetFields();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Drawer
      title="Tạo syllabus khóa học"
      width={720}
      onClose={closeDrawer}
      open={isDrawerVisible}
      styles={{ body: { paddingBottom: 80 } }}
      footer={
        <div style={{ textAlign: "right" }}>
          <Button onClick={closeDrawer} className="me-2">
            Cancel
          </Button>
          <Button onClick={() => form.submit()} type="primary">
            Submit
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="description"
          label="Mô tả khóa học"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input.TextArea placeholder="Enter syllabus description" />
        </Form.Item>

        <Form.Item
          name="studentTask"
          label="Công việc"
          rules={[{ required: true, message: "Please enter student tasks" }]}
        >
          <Input.TextArea placeholder="Enter student tasks" />
        </Form.Item>

        <Form.Item
          name="timeAllocation"
          label="Phân bổ thời gian"
          rules={[{ required: true, message: "Please enter time allocation" }]}
        >
          <Input placeholder="Enter time allocation in hours" />
        </Form.Item>

        <Form.Item
          name="toolsRequire"
          label="Công cụ yêu cầu"
          rules={[{ required: true, message: "Please enter required tools" }]}
        >
          <Input.TextArea placeholder="Enter required tools" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="scale"
              label="Điểm tổng"
              rules={[
                { required: true, message: "Please enter the grading scale" },
              ]}
            >
              <InputNumber
                min={0}
                max={100}
                style={{ width: "100%" }}
                placeholder="Enter grading scale (e.g., 1-10)"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="minAvgMarkToPass"
              label="Điểm trung bình để pass"
              rules={[
                {
                  required: true,
                  message: "Please enter minimum average mark",
                },
              ]}
            >
              <InputNumber
                min={0}
                max={100}
                placeholder="Enter minimum average mark to pass"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default CreateSyllabus;
