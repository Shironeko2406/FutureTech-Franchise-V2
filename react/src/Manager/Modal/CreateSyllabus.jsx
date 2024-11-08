import { Button, Drawer, Form, Input, InputNumber, Row, Col, Modal } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { CreateSyllabusActionAsync } from "../../Redux/ReducerAPI/SyllabusReducer";
import { useLoading } from "../../Utils/LoadingContext";

const CreateSyllabus = ({ isDrawerVisible, closeDrawer }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { id } = useParams();
  const {setLoading} = useLoading()

  const onFinish = (values) => {
    const syllabusData = { ...values, courseId: id };
    setLoading(true)
    dispatch(CreateSyllabusActionAsync(syllabusData))
      .then((response) => {
        setLoading(false)
        if (response) {
          closeDrawer();
          form.resetFields();
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error);
      });
  };

  return (
    <Modal
      title="Tạo giáo trình"
      width={700}
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
        layout="vertical"
        requiredMark={false}
        onFinish={onFinish}
      >
        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
        >
          <Input.TextArea placeholder="Mô tả khóa học (ví dụ: mục tiêu học tập, nội dung chính)" rows={4} />
        </Form.Item>

        <Form.Item
          name="studentTask"
          label="Công việc"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập công việc của sinh viên",
            },
          ]}
        >
          <Input.TextArea placeholder="Công việc sinh viên cần hoàn thành (ví dụ: làm bài tập, thực hành, thảo luận)" />
        </Form.Item>

        <Form.Item
          name="timeAllocation"
          label="Phân bổ thời gian"
          rules={[
            { required: true, message: "Vui lòng nhập phân bổ thời gian" },
          ]}
        >
          <Input placeholder="Thời gian học (ví dụ: 45 giờ học trên lớp, 104 giờ tự học)" />
        </Form.Item>

        <Form.Item
          name="toolsRequire"
          label="Công cụ yêu cầu"
          rules={[{ required: true, message: "Vui lòng nhập công cụ yêu cầu" }]}
        >
          <Input.TextArea placeholder="Công cụ học tập cần thiết (ví dụ: phần mềm, sách giáo khoa)" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="scale"
              label="Thang điểm"
              rules={[{ required: true, message: "Vui lòng nhập thang điểm" }]}
            >
              <InputNumber
                min={0}
                max={100}
                style={{ width: "100%" }}
                placeholder="Thang điểm tối đa (ví dụ: 100)"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="minAvgMarkToPass"
              label="Điểm trung bình để đạt"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập điểm trung bình để đạt",
                },
              ]}
            >
              <InputNumber
                min={0}
                max={100}
                placeholder="Điểm tối thiểu để vượt qua (ví dụ: 60)"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateSyllabus;
