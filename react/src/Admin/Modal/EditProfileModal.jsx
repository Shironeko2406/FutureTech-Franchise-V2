import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Select, Upload, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { useLoading } from "../../Utils/LoadingContext";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { imageDB } from "../../Firebasse/Config";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 8px;
  }

  .ant-modal-header {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 24px;
  }

  .ant-modal-body {
    padding: 24px;
  }

  .ant-modal-footer {
    border-top: 1px solid #f0f0f0;
    padding: 10px 16px;
  }
`;

const StyledForm = styled(Form)`
  .ant-form-item-label {
    font-weight: 600;
  }
`;

const EditProfileModal = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { setLoading } = useLoading();
  const [imageUrl, setImageUrl] = useState("");
  const [fileList, setFileList] = useState([]);
  const { userProfile } = useSelector((state) => state.UserReducer);


  useEffect(() => {
    if (userProfile && visible) {
      form.setFieldsValue({
        email: userProfile.email,
        phoneNumber: userProfile.phoneNumber,
        fullName: userProfile.fullName,
        description: userProfile.description,
        dateOfBirth: userProfile.dateOfBirth ? dayjs(userProfile.dateOfBirth) : null,
        gender: userProfile.gender,
      });
      setImageUrl(userProfile.urlImage);
      if (userProfile.urlImage) {
        setFileList([
          {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: userProfile.urlImage,
          },
        ]);
      } else {
        setFileList([]);
      }
    }
  }, [userProfile, form, visible]);

  const handleUpload = ({ file, onSuccess, onError }) => {
    const storageRef = ref(imageDB, `profile-images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        message.error("Upload failed!");
        console.error(error);
        onError(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUrl(downloadURL);
          setFileList([
            {
              uid: file.uid,
              name: file.name,
              status: 'done',
              url: downloadURL,
            },
          ]);
          form.setFieldsValue({ urlImage: downloadURL });
          message.success("Upload successful!");
          onSuccess(null, file);
        } catch (err) {
          message.error("Failed to retrieve image URL.");
          console.error(err);
          onError(err);
        }
      }
    );
  };

  const onFinish = (values) => {
    const dataEdit = {
      ...values,
      urlImage: imageUrl,
      dateOfBirth: values.dateOfBirth.format('YYYY-MM-DDTHH:mm:ss[Z]')
    };
    console.log(dataEdit)
    // setLoading(true);
    // dispatch(EditUserProfileActionAsync(userProfile.id, dataEdit))
    //   .then((res) => {
    //     setLoading(false);
    //     if (res) {
    //       onClose();
    //       message.success("Profile updated successfully!");
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     setLoading(false);
    //     message.error("Failed to update profile.");
    //   });
  };

  return (
    <StyledModal
      title="Edit Profile"
      width={700}
      style={{ top: 20 }}
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
    >
      <StyledForm
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please input your email" },
            { type: 'email', message: "Please enter a valid email" }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label="Phone Number"
          rules={[{ required: true, message: "Please input your phone number" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="fullName"
          label="Full Name"
          rules={[{ required: true, message: "Please input your full name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="dateOfBirth"
          label="Date of Birth"
          rules={[{ required: true, message: "Please select your date of birth" }]}
        >
          <DatePicker 
            style={{ width: '100%' }} 
            format="DD/MM/YYYY"
          />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: "Please select your gender" }]}
        >
          <Select>
            <Select.Option value="male">Nam</Select.Option>
            <Select.Option value="female">Nữ</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="urlImage"
          label="Profile Picture"
          valuePropName="file"
          getValueFromEvent={(e) => e && e.fileList}
        >
          <Upload
            customRequest={handleUpload}
            listType="picture-card"
            fileList={fileList}
            onRemove={() => {
              setImageUrl("");
              setFileList([]);
              form.setFieldsValue({ urlImage: "" });
            }}
            onChange={({ fileList }) => setFileList(fileList)}
          >
            {fileList.length >= 1 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </StyledForm>
    </StyledModal>
  );
};

export default EditProfileModal;

