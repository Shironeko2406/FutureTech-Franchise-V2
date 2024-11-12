import React, { useState } from "react";
import { Button, Modal, Form, Input, Switch, Space, Upload, message } from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { CreateQuestionChapterByIdActionAsync } from "../../Redux/ReducerAPI/ChapterReducer";
import { useLoading } from "../../Utils/LoadingContext";
import { imageDB } from "../../Firebasse/Config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import styled from "styled-components";

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

const StyledSwitch = styled(Switch)`
  &.ant-switch-checked {
    background-color: #52c41a;
  }

  &:not(.ant-switch-checked) {
    background-color: #ff4d4f;
  }
`;

const CreateQuestionModal = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const location = useLocation();
  const { setLoading } = useLoading();
  const queryParams = new URLSearchParams(location.search);
  const chapterId = queryParams.get("chapterId");
  const [imageUrl, setImageUrl] = useState("");

  const handleUpload = ({ file, onSuccess, onError }) => {
    const storageRef = ref(imageDB, `images/${file.name}`);
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
          form.setFieldsValue({ imageURL: downloadURL });
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
    const formData = {
      ...values,
      imageURL: imageUrl,
    };
    setLoading(true);
    dispatch(CreateQuestionChapterByIdActionAsync(chapterId, formData))
      .then((res) => {
        setLoading(false);
        if (res) {
          onClose();
          form.resetFields();
          setImageUrl("");
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    console.log(formData)
  };

  return (
    <StyledModal
      title="Tạo câu hỏi"
      width={700}
      style={{ top: 20 }}
      onCancel={onClose}
      open={visible}
      footer={
        <div style={{ textAlign: "right" }}>
          <Button onClick={onClose} className="me-2" danger>
            Hủy
          </Button>
          <Button onClick={() => form.submit()} type="primary">
            Tạo
          </Button>
        </div>
      }
    >
      <StyledForm form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
        <Form.Item
          name="description"
          label="Mô tả câu hỏi"
          rules={[{ required: true, message: "Vui lòng nhập mô tả câu hỏi" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="imageURL"
          label="Hình ảnh"
          valuePropName="file"
          getValueFromEvent={(e) => e && e.file.originFileObj}
        >
          <Upload
            customRequest={handleUpload}
            listType="picture"
            maxCount={1}
            onRemove={() => {
              setImageUrl("");
              form.setFieldsValue({ imageURL: "" });
            }}
          >
            {!imageUrl && (
              <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
            )}
          </Upload>
        </Form.Item>

        <Form.List
          name="questionOptions"
          rules={[
            {
              validator: async (_, options) => {
                if (!options || options.length < 2) {
                  return Promise.reject(
                    new Error("Ít nhất 2 lựa chọn là bắt buộc")
                  );
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => {
                const { key, name, ...restField } = field;
                return (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "description"]}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mô tả lựa chọn",
                        },
                      ]}
                    >
                      <Input placeholder="Mô tả lựa chọn" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "status"]}
                      valuePropName="checked"
                      initialValue={false}
                    >
                      <StyledSwitch
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                      />
                    </Form.Item>
                    {fields.length > 1 && (
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    )}
                  </Space>
                );
              })}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm lựa chọn
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
      </StyledForm>
    </StyledModal>
  );
};

export default CreateQuestionModal;
