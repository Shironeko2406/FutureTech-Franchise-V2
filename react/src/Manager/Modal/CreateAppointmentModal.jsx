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
import { useRef } from "react";
import { checkCharacterCount } from "../../Utils/Validator/EditorValid";

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

const CreateAppointmentModal = ({ visible, onClose, workId, selectedType}) => {
  const reactQuillRef = useRef(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { userManager } = useSelector((state) => state.UserReducer);
  const { taskDetail } = useSelector((state) => state.WorkReducer);
  const { setLoading } = useLoading();
  const idUserCreateAppointment = getDataJSONStorage(USER_LOGIN).id

  const filterUsersByRole = (user, type) => {
    const rolePermissions = {
      Manager: [
        'Interview', 'AgreementSigned', 'BusinessRegistered', 'SiteSurvey',
        'Design', 'Quotation', 'SignedContract', 'ConstructionAndTrainning',
        'Handover', 'EducationLicenseRegistered',
      ],
      SystemTechnician: ['Design', 'Quotation', 'SiteSurvey', 'ConstructionAndTrainning'],
      SystemInstructor: ['ConstructionAndTrainning', 'EducationLicenseRegistered'],
    };
  
    return rolePermissions[user.role]?.includes(type);
  };
  

  const handleKeyDown = (event) => {
    checkCharacterCount(reactQuillRef, 2000, event);
  };

  const handleAddAppointmentSubmit = (values) => {
    setLoading(true);
    const { timeRange, ...data } = values;
    const appointmentData = {
      ...data,
      startTime: timeRange[0].format("YYYY-MM-DDTHH:mm:ss[Z]"),
      endTime: timeRange[1].format("YYYY-MM-DDTHH:mm:ss[Z]"),
      workId,
    };

    const userIds = values.userId || []; // Nếu values.userId undefined, gán giá trị mặc định là mảng rỗng
    const dataNotification = {
      userIds: userIds.filter(id => id !== idUserCreateAppointment), // Lọc và bỏ đi id của người đang tạo appointment
      message: values.title
    };

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
              <Input maxLength={150} />
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
            format="YYYY-MM-DD HH:mm"
            disabledDate={(current) => {
              const startDate = moment(taskDetail.startDate).add(1, 'day');
              const endDate = moment(taskDetail.endDate);
              
              // Disable dates before today, after endDate, and before startDate + 1 day
              return (
                current < moment().startOf('day') ||
                current > endDate ||
                current < startDate
              );
            }}
          />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <StyledQuill
            ref={reactQuillRef}
            onKeyDown={handleKeyDown}
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
            {userManager
            .filter((user) => filterUsersByRole(user, selectedType))
            .map((user) => (
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