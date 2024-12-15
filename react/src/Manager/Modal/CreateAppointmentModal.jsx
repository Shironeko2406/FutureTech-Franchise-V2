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
import { useEffect, useRef, useState } from "react";
import { checkCharacterCount } from "../../Utils/Validator/EditorValid";
import { GetManagerUserAddAppointmentActionAsync } from "../../Redux/ReducerAPI/UserReducer";

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
    z-index: 1000000 !important;
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
  AgencyManager: "Đối tác chi nhánh",
}[role] || "Không xác định");

const CreateAppointmentModal = ({ visible, onClose, workId, selectedType}) => {
  const reactQuillRef = useRef(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { userManager } = useSelector((state) => state.UserReducer);
  const { taskDetail } = useSelector((state) => state.WorkReducer);
  const { setLoading } = useLoading();
  const idUserCreateAppointment = getDataJSONStorage(USER_LOGIN).id
  const [filtersTimeUser, setFiltersTimeUser] = useState(null);
  const [isTimeRangeSelected, setIsTimeRangeSelected] = useState(false);

  useEffect(() => {
    if (visible && filtersTimeUser) {
      dispatch(GetManagerUserAddAppointmentActionAsync(filtersTimeUser));
    }
  }, [visible, filtersTimeUser, dispatch]);

  const filterUsersByRole = (user, type) => {
    const rolePermissions = {
      Manager: [
        'Interview', 'AgreementSigned', 'BusinessRegistered', 'SiteSurvey',
        'Design', 'Quotation', 'SignedContract', 'ConstructionAndTrainning',
        'Handover', 'EducationLicenseRegistered', 'TrainningInternal', 
        'RepairingEquipment', 'EducationalSupervision', 'RenewContract',
        'RenewEducationLicense', 'Other'
      ],
      SystemTechnician: ['Design', 'Quotation', 'SiteSurvey', 'ConstructionAndTrainning', 'Handover', 'RepairingEquipment', 'Other'],
      SystemInstructor: ['ConstructionAndTrainning', 'EducationLicenseRegistered', 'TrainningInternal', 'EducationalSupervision', 'Other'],
      SystemConsultant: ['Other'],

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

    const userIds = values.userId || [];
    const dataNotification = {
      userIds: userIds.filter(id => id !== idUserCreateAppointment),
      message: values.title
    };

    dispatch(CreateAppointmentActionAsync(appointmentData, dataNotification))
      .then((res) => {
        setLoading(false);
        if (res) {
          onClose();
          form.resetFields();
          setFiltersTimeUser(null)
          setIsTimeRangeSelected(false)
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
              const startDate = moment(taskDetail.startDate);
              const endDate = moment(taskDetail.endDate);
              return current < startDate.startOf('day') || current > endDate.endOf('day');
            }}
            disabledTime={(current) => {
              const startDate = moment(taskDetail.startDate);
              const endDate = moment(taskDetail.endDate);

              if (!current) return false;

              if (current.isSame(startDate, 'day')) {
                return {
                  disabledHours: () => Array.from({ length: startDate.hour() }, (_, i) => i),
                  disabledMinutes: (hour) => (hour === startDate.hour() ? Array.from({ length: startDate.minute() }, (_, i) => i) : []),
                };
              }

              if (current.isSame(endDate, 'day')) {
                return {
                  disabledHours: () => Array.from({ length: 24 - endDate.hour() - 1 }, (_, i) => endDate.hour() + i + 1),
                  disabledMinutes: (hour) => (hour === endDate.hour() ? Array.from({ length: 60 - endDate.minute() }, (_, i) => endDate.minute() + i) : []),
                };
              }

              return false;
            }}
            onChange={(dates) => {
              if (dates && dates.length === 2) {
                setFiltersTimeUser({
                  startTimeFilter: dates[0].format("YYYY-MM-DDTHH:mm:ss[Z]"),
                  endTimeFilter: dates[1].format("YYYY-MM-DDTHH:mm:ss[Z]"),
                });
                setIsTimeRangeSelected(true);
              } else {
                setIsTimeRangeSelected(false);
                setFiltersTimeUser(null);
              }
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
        <Form.Item
          name="userId"
          label="Người tham gia"
          rules={[
            { required: true, message: "Vui lòng chọn người tham gia" },
            () => ({
              validator(_, value) {
                if (!isTimeRangeSelected) {
                  return Promise.reject("Hãy chọn thời gian bắt đầu và kết thúc trước");
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn người tham gia"
            showSearch
            filterOption={(input, option) => {
              if (option && option.label) {
                return option.label.toLowerCase().includes(input.toLowerCase());
              }
              return false;
            }}
            optionLabelProp="label"
            disabled={!isTimeRangeSelected}
            onClick={() => {
              if (!isTimeRangeSelected) {
                form.setFields([
                  {
                    name: 'userId',
                    errors: ['Hãy chọn thời gian bắt đầu và kết thúc trước'],
                  },
                ]);
              }
            }}
          >
          {userManager
            .filter((user) => filterUsersByRole(user, selectedType))
            .map((user) => (
              <Select.Option
                key={user.id}
                value={user.id}
                label={`${user.fullName} - ${user.userName} - (${translateRole(user.role)})`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{`${user.fullName} - ${user.userName} - (${translateRole(user.role)})`}</span>
                  <span style={{ marginLeft: '10px', color: '#888' }}>{`Công việc: ${user.workCount}`}</span>
                </div>
              </Select.Option>
            ))}
        </Select>
        </Form.Item>
      </StyledForm>
    </StyledModal>
  );
};

export default CreateAppointmentModal;

