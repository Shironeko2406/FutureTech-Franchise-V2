import { Col, DatePicker, Form, Input, message, Modal, Row, Select, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useLoading } from "../../Utils/LoadingContext";
import { CreateAppointmentActionAsync } from "../../Redux/ReducerAPI/AppointmentReducer";
import ReactQuill from "react-quill";
import styled from "styled-components";
import { quillFormats, quillModules } from "../../TextEditorConfig/Config";
import { getDataJSONStorage } from "../../Utils/UtilsFunction";
import { USER_LOGIN } from "../../Utils/Interceptors";
import moment from "moment";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  .ant-modal-header {
    border-bottom: none;
    padding: 24px 24px 0;
  }
  .ant-modal-body {
    padding: 24px;
  }
  .ant-form-item-label > label {
    font-weight: 600;
  }
`;

const StyledForm = styled(Form)`
  .ant-input,
  .ant-input-number,
  .ant-picker,
  .ant-select-selector {
    border-radius: 6px;
  }
`;

const StyledQuill = styled(ReactQuill)`
  .ql-container {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
  .ql-toolbar {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }
  
  .ql-tooltip {
    z-index: 1000000 !important; // Ensure it's above the modal
    position: fixed !important;
  }
  
  .ql-editing {
    left: 50% !important;
    transform: translateX(-50%);
    background-color: white !important;
    border: 1px solid #ccc !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
    padding: 8px 12px !important;
  }
`;

const translateRole = (role) => ({
  Manager: "Quản lý",
  SystemInstructor: "Giảng viên hệ thống",
  SystemConsultant: "Tư vấn viên hệ thống",
  SystemTechnician: "Kỹ thuật viên hệ thống",
}[role] || "Không xác định");

const CreateAppointmentModal = ({ visible, onClose, workId }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { userManager } = useSelector((state) => state.UserReducer);
  const { setLoading } = useLoading();
  const idUserCreateAppointment = getDataJSONStorage(USER_LOGIN).id

  const handleAddAppointmentSubmit = (values) => {
    setLoading(true);
    const { timeRange, ...data } = values;
    const appointmentData = {
      ...data,
      startTime: timeRange[0].format("YYYY-MM-DDTHH:mm:ss[Z]"),
      endTime: timeRange[1].format("YYYY-MM-DDTHH:mm:ss[Z]"),
      workId,
    };

    const dataNotification = {
      userIds: values.userId.filter(id => id !== idUserCreateAppointment), //lọc và bỏ đi id nếu đó là id của người đang login tạo appointment
      message: values.title
    }

    dispatch(CreateAppointmentActionAsync(appointmentData, dataNotification))
      .then((res) => {
        setLoading(false);
        if (res) {
          onClose();
          form.resetFields();
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <StyledModal
      title={<Title level={3}>Thêm cuộc họp</Title>}
      open={visible}
      onCancel={onClose}
      width={600}
      style={{ top: 20 }}
      onOk={() => form.submit()}
    >
      <StyledForm
        form={form}
        layout="vertical"
        onFinish={handleAddAppointmentSubmit}
        initialValues={{ title: "Họp nội bộ", type: "Internal" }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="title"
              label="Tiêu đề"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề cuộc họp" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="type"
              label="Loại cuộc họp"
              rules={[{ required: true, message: "Vui lòng chọn loại cuộc họp" }]}
            >
              <Select>
                <Select.Option value="Internal">Nội bộ</Select.Option>
                <Select.Option value="WithAgency">Với chi nhánh</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="timeRange"
          label="Thời gian"
          rules={[{ required: true, message: "Vui lòng chọn thời gian cuộc họp" }]}
        >
          <RangePicker
            style={{ width: '100%' }}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            disabledDate={(current) => current && current < moment().startOf('day')}
          />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <StyledQuill
            modules={quillModules}
            formats={quillFormats}
            placeholder="Nhập mô tả công việc"
            style={{ minHeight: '200px' }}
          />
        </Form.Item>
        <Form.Item name="userId" label="Người tham gia">
          <Select
            mode="multiple"
            placeholder="Chọn người tham gia"
            showSearch
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
            optionLabelProp="label"
          >
            {userManager.map((user) => (
              <Select.Option
                key={user.id}
                value={user.id}
                label={user.userName}
              >
                {`${user.userName} (${translateRole(user.role)})`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </StyledForm>
    </StyledModal>
  );
};

export default CreateAppointmentModal;