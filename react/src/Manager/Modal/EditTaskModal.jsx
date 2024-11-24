// import { DatePicker, Form, Input, Modal } from 'antd';
// import dayjs from 'dayjs';
// import React, { useEffect } from 'react'
// import { useLoading } from '../../Utils/LoadingContext';
// import { useDispatch } from 'react-redux';

// const { RangePicker } = DatePicker

// const EditTaskModal = ({ visible, onClose, task }) => {
//   const [form] = Form.useForm();
//   const {setLoading} = useLoading()
//   const dispatch = useDispatch()


//   useEffect(() => {
//     if (task && visible) {
//       form.setFieldsValue({
//         title: task.title,
//         description: task.description,
//         dateRange: [
//           dayjs(task.startDate),
//           dayjs(task.startDate)
//         ],
//       });
//     }
//   }, [task, form, visible]);

//   const onFinish = (values) => {
//     // setLoading(true)
//     const [startDate, endDate] = values.dateRange;
//     const taskUpdate = {
//       ...values,
//       startDate: startDate.format('YYYY-MM-DDTHH:mm:ss[Z]'),
//       endDate: endDate.format('YYYY-MM-DDTHH:mm:ss[Z]'),
//     };
//     delete taskUpdate.dateRange;

//     console.log(taskUpdate)

//     // dispatch(EditAppointmentByIdActionAsync(appointmentDetail.id, updatedAppointment, workId)).then((res) => {
//     //     setLoading(false)
//     //     if (res) {
//     //         onClose()
//     //     }
//     // }).catch((err) => {
//     //     console.log(err)
//     //     setLoading(false)
//     // });
//   };

//   return (
//     <Modal
//       title="Cập nhật công việc"
//       open={visible}
//       onCancel={onClose}
//       onOk={() => form.submit()}
//       width={600}
//     >
//       <Form form={form} layout="vertical" onFinish={onFinish}>
//         <Form.Item
//           name="title"
//           label="Tiêu đề"
//           rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item
//           name="description"
//           label="Mô tả"
//           rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
//         >
//           <Input.TextArea rows={4} />
//         </Form.Item>
//         <Form.Item
//           name="dateRange"
//           label="Thời gian"
//           rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
//         >
//           <RangePicker
//             showTime
//             format="DD/MM/YYYY, HH:mm"
//             style={{ width: '100%' }}
//           />
//         </Form.Item>
//       </Form>
//     </Modal>
//   )
// }

// export default EditTaskModal



import { DatePicker, Form, Input, Modal, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect } from 'react'
import { useLoading } from '../../Utils/LoadingContext';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import { quillFormats, quillModules } from '../../TextEditorConfig/Config';
import { EditTaskByIdActionAsync } from '../../Redux/ReducerAPI/WorkReducer';
import { useParams } from 'react-router-dom';

const { RangePicker } = DatePicker
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

const EditTaskModal = ({ visible, onClose, task }) => {
  const [form] = Form.useForm();
  const {setLoading} = useLoading()
  const dispatch = useDispatch()
  const {id} = useParams();


  useEffect(() => {
    if (task && visible) {
      form.setFieldsValue({
        title: task.title,
        description: task.description,
        dateRange: [
          dayjs(task.startDate),
          dayjs(task.startDate)
        ],
      });
    }
  }, [task, form, visible]);

  const onFinish = (values) => {
    setLoading(true)
    const [startDate, endDate] = values.dateRange;
    const taskUpdate = {
      ...values,
      startDate: startDate.format('YYYY-MM-DDTHH:mm:ss[Z]'),
      endDate: endDate.format('YYYY-MM-DDTHH:mm:ss[Z]'),
    };
    delete taskUpdate.dateRange;

    dispatch(EditTaskByIdActionAsync(taskUpdate, task.id, id)).then((res) => {
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
      title={<Title level={3}>Cập nhật công việc</Title>}
      style={{top:20}}
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      width={600}
    >
      <StyledForm form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
        >
          <StyledQuill
            modules={quillModules}
            formats={quillFormats}
            placeholder="Nhập mô tả công việc"
            style={{ minHeight: '200px' }}
          />
        </Form.Item>
        <Form.Item
          name="dateRange"
          label="Thời gian"
          rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
        >
          <RangePicker
            showTime
            format="DD/MM/YYYY, HH:mm"
            style={{ width: '100%' }}
          />
        </Form.Item>
      </StyledForm>
    </StyledModal>
  )
}

export default EditTaskModal
