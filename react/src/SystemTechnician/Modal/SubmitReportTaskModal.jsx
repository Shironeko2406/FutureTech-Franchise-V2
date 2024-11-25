import { Form, Input, message, Modal, Typography, Upload } from 'antd';
import React, { useEffect, useState } from 'react'
import { useLoading } from '../../Utils/LoadingContext';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { imageDB } from "../../Firebasse/Config";
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { InboxOutlined } from '@ant-design/icons';
import { StaffSubmitReportTaskByIdActionAsync } from '../../Redux/ReducerAPI/WorkReducer';

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

const SubmitReportTaskModal = ({ visible, onClose }) => {
    const [form] = Form.useForm();
    const { taskDetail } = useSelector((state) => state.WorkReducer);
    const dispatch = useDispatch()
    const {setLoading} = useLoading()
    const [fileReportUrl, setFileReportUrl] = useState("");
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (visible && taskDetail) {
          form.setFieldsValue({
            report: taskDetail.report,
            reportImageURL: taskDetail.reportImageURL,
          });
          setFileReportUrl(taskDetail.reportImageURL);
          setFileList(taskDetail.reportImageURL ? [{
            uid: '-1',
            name: 'PDF file',
            status: 'done',
            url: taskDetail.reportImageURL,
          }] : []);
        }
      }, [taskDetail, form, visible]);

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
        const dataSubmit = {...values, reportImageURL: fileReportUrl,};
        console.log(dataSubmit)
    
        dispatch(StaffSubmitReportTaskByIdActionAsync(dataSubmit, taskDetail.id)).then((res) => {
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
      title={<Title level={3}>Nộp báo cáo</Title>}
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      style={{ top: 20 }}
      width={800}
    >
      <StyledForm form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="report" label="Báo cáo">
          <Input/>
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
  )
}

export default SubmitReportTaskModal