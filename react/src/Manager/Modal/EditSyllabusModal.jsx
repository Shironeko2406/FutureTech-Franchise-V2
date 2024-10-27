import React, { useEffect } from "react";
import { Button, Drawer, Form, Input, InputNumber, Row, Col } from "antd";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import { DelateSyllabusActionAsync, EditSyllabusActionAsync } from "../../Redux/ReducerAPI/SyllabusReducer";

const EditSyllabusModal = ({ visible, onClose, syllabus }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (syllabus) {
      form.setFieldsValue({
        description: syllabus.description,
        studentTask: syllabus.studentTask,
        timeAllocation: syllabus.timeAllocation,
        toolsRequire: syllabus.toolsRequire,
        scale: syllabus.scale,
        minAvgMarkToPass: syllabus.minAvgMarkToPass,
      });
    }
  }, [syllabus]);

  const onFinish = (values) => {
    dispatch(EditSyllabusActionAsync(values, syllabus.id, id))
      .then((response) => {
        if (response) {
          onClose();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Drawer
      title={"Sửa giáo trình"}
      width={720}
      onClose={onClose}
      open={visible}
      styles={{ body: { paddingBottom: 80 } }}
      footer={
        <div style={{ textAlign: "right" }}>
          <Button className="me-2" onClick={onClose} danger>
            Hủy
          </Button>
          <Button onClick={() => form.submit()} type="primary">
            Sửa
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
      >
        <Form.Item
          name="description"
          label="Mô tả khóa học"
          rules={[{ required: true, message: "Vui lòng nhập mô tả khóa học" }]}
        >
          <Input.TextArea placeholder="Nhập mô tả chương trình học" rows={4} />
        </Form.Item>

        <Form.Item
          name="studentTask"
          label="Công việc của sinh viên"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập công việc của sinh viên",
            },
          ]}
        >
          <Input.TextArea placeholder="Nhập công việc của sinh viên" rows={4} />
        </Form.Item>

        <Form.Item
          name="timeAllocation"
          label="Phân bổ thời gian"
          rules={[
            { required: true, message: "Vui lòng nhập phân bổ thời gian" },
          ]}
        >
          <Input placeholder="Nhập phân bổ thời gian (giờ)" />
        </Form.Item>

        <Form.Item
          name="toolsRequire"
          label="Công cụ yêu cầu"
          rules={[{ required: true, message: "Vui lòng nhập công cụ yêu cầu" }]}
        >
          <Input.TextArea placeholder="Nhập công cụ yêu cầu" />
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
                placeholder="Nhập thang điểm (ví dụ: 1-10)"
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
                placeholder="Nhập điểm trung bình để đạt"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default EditSyllabusModal;
