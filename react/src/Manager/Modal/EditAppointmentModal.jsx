import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, Upload, message, Row, Col, Typography } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { imageDB } from "../../Firebasse/Config";
import { useLoading } from '../../Utils/LoadingContext';
import { useDispatch, useSelector } from 'react-redux';
import { EditAppointmentByIdActionAsync } from '../../Redux/ReducerAPI/AppointmentReducer';
import ReactQuill from 'react-quill';
import styled from 'styled-components';
import { quillFormats, quillModules } from '../../TextEditorConfig/Config';
import moment from "moment";

const { RangePicker } = DatePicker;
const { TextArea } = Input;
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

const CompactAppointmentModal = ({ visible, onClose, workId }) => {
  const [form] = Form.useForm();
  const { appointmentDetail } = useSelector((state) => state.AppointmentReducer);
  const { taskDetail } = useSelector((state) => state.WorkReducer);
  const dispatch = useDispatch()
  const {setLoading} = useLoading()
  const [fileReportUrl, setFileReportUrl] = useState("");
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (visible && appointmentDetail) {
      form.setFieldsValue({
        title: appointmentDetail.title,
        description: appointmentDetail.description,
        report: appointmentDetail.report,
        reportImageURL: appointmentDetail.reportImageURL,
        type: appointmentDetail.type,
        timeRange: [
          dayjs(appointmentDetail.startTime),
          dayjs(appointmentDetail.endTime)
        ],
      });
      setFileReportUrl(appointmentDetail.reportImageURL);
      setFileList(appointmentDetail.reportImageURL ? [{
        uid: '-1',
        name: 'PDF file',
        status: 'done',
        url: appointmentDetail.reportImageURL,
      }] : []);
    }
  }, [appointmentDetail, form, visible]);

  const handleUpload = ({ file, onSuccess, onError }) => {
    const storageRef = ref(imageDB, `pdfs/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        message.error("Upload failed!");
        console.error(error);
        onError(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFileReportUrl(downloadURL);
          setFileList([{ uid: file.uid, name: file.name, status: 'done', url: downloadURL }]);
          form.setFieldValue('reportImageURL', downloadURL);
          message.success("Upload successful!");
          onSuccess(null, file);
        } catch (err) {
          message.error("Failed to retrieve PDF URL.");
          console.error(err);
          onError(err);
        }
      }
    );
  };

  const onFinish = (values) => {
    setLoading(true)
    const [startTime, endTime] = values.timeRange;
    const updatedAppointment = {
      ...values,
      startTime: startTime.format('YYYY-MM-DDTHH:mm:ss[Z]'),
      endTime: endTime.format('YYYY-MM-DDTHH:mm:ss[Z]'),
      reportImageURL: fileReportUrl,
    };
    delete updatedAppointment.timeRange;

    dispatch(EditAppointmentByIdActionAsync(appointmentDetail.id, updatedAppointment, workId)).then((res) => {
        setLoading(false)
        if (res) {
            onClose()
        }
    }).catch((err) => {
        console.log(err)
        setLoading(false)
    });
  };

  return (
    <StyledModal
      title={<Title level={3}>Cập nhật cuộc họp</Title>}
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      style={{ top: 20 }}
      width={800}
    >
      <StyledForm form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="type" label="Loại cuộc họp" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Internal">Nội bộ</Select.Option>
                <Select.Option value="WithAgency">Với bên liên quan</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="timeRange" label="Thời gian bắt đầu và kết thúc" rules={[{ required: true }]}>
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
            modules={quillModules}
            formats={quillFormats}
            placeholder="Nhập mô tả"
            style={{ minHeight: '200px' }}
          />
        </Form.Item>

        <Form.Item name="report" label="Báo cáo">
          <TextArea rows={4} />
        </Form.Item>


        <Form.Item name="reportImageURL" label="File báo cáo">
          <Upload.Dragger
            accept=".pdf"
            multiple={false}
            customRequest={handleUpload}
            fileList={fileList}
            onRemove={() => {
              setFileReportUrl("");
              setFileList([]);
              form.setFieldsValue({ reportImageURL: "" });
            }}
            onChange={({ fileList }) => setFileList(fileList.slice(-1))}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Hãy chọn file báo cáo</p>
          </Upload.Dragger>
        </Form.Item>
      </StyledForm>
    </StyledModal>
  );
};

export default CompactAppointmentModal;

