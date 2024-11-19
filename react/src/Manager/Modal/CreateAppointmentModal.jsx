import { DatePicker, Form, Input, Modal, Select } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { useLoading } from "../../Utils/LoadingContext";
import { CreateAppointmentActionAsync } from "../../Redux/ReducerAPI/AppointmentReducer";

const { RangePicker } = DatePicker;

// Mock data for user selection
const mockUsers = [
  { id: 1, name: "Nguyễn Văn A" },
  { id: 2, name: "Trần Thị B" },
];

const CreateAppointmentModal = ({ visible, onClose, workId }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { setLoading } = useLoading();

  const handleAddAppointmentSubmit = (values) => {
    setLoading(true);
    const data = {
      ...values,
      startTime: values.timeRange[0].format("YYYY-MM-DDTHH:mm:ss[Z]"),
      endTime: values.timeRange[1].format("YYYY-MM-DDTHH:mm:ss[Z]"),
      workId,
    };

    delete data.timeRange;

    dispatch(CreateAppointmentActionAsync(data))
      .then((res) => {
        setLoading(false);
        if (res) {
          onClose();
          form.resetFields();
        }
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      });
  };

  return (
    <Modal
      title="Thêm cuộc họp"
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleAddAppointmentSubmit}
        initialValues={{
          title: "Họp nội bộ",
          type: "Internal",
        }}
      >
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[
            { required: true, message: "Vui lòng nhập tiêu đề cuộc họp" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="timeRange"
          label="Thời gian"
          rules={[
            { required: true, message: "Vui lòng chọn thời gian cuộc họp" },
          ]}
        >
          <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item
          name="type"
          label="Loại cuộc họp"
          rules={[{ required: true, message: "Vui lòng chọn loại cuộc họp" }]}
        >
          <Select>
            <Select.Option value="Internal">Nội bộ</Select.Option>
            <Select.Option value="WithAgency">Bên ngoài</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="userId"
          label="Người tham gia"
          // rules={[{ required: true, message: 'Vui lòng chọn người tham gia' }]}
        >
          <Select mode="multiple" placeholder="Chọn người tham gia">
            {mockUsers.map((user) => (
              <Select.Option key={user.id} value={user.id}>
                {user.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateAppointmentModal;
