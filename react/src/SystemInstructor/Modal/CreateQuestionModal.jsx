import React, { useState } from "react";
import { Button, Modal, Form, Input, Switch, Space } from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { CreateQuestionChapterByIdActionAsync } from "../../Redux/ReducerAPI/ChapterReducer";
import { useLoading } from "../../Utils/LoadingContext";

const CreateQuestionModal = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const location = useLocation();
  const { setLoading } = useLoading();
  const queryParams = new URLSearchParams(location.search);
  const chapterId = queryParams.get("chapterId");

  const onFinish = (values) => {
    setLoading(true);
    dispatch(CreateQuestionChapterByIdActionAsync(chapterId, values))
      .then((res) => {
        setLoading(false);
        if (res) {
          onClose();
          form.resetFields();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Modal
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
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="description"
          label="Mô tả câu hỏi"
          rules={[{ required: true, message: "Vui lòng nhập mô tả câu hỏi" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item name="imageURL" label="URL hình ảnh">
          <Input />
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
                      <Switch
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
      </Form>
    </Modal>
  );
};

export default CreateQuestionModal;
