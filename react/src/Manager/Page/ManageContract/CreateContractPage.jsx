import React, { useState } from "react";
import { Form, Input, Button, message, DatePicker } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const CreateContractPage = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    // Chuyển đổi giá trị revenueSharePercentage sang dạng số (double)
    const formattedValues = {
      ...values,
      revenueSharePercentage: parseFloat(values.revenueSharePercentage),
    };
    console.log("Received values of form: ", values);
    message.success("Hợp đồng đã được lưu thành công!");
  };

  return (
    <div
      className="card"
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        overflow: "hidden",
        padding: "16px",
      }}
    >
      <div className="card-body">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h5 className="card-title mb-3">Tạo hợp đồng</h5>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() =>
              window.location.href = "/path/to/contract-template.docx"
            }
          >
            Tải mẫu hợp đồng
          </Button>
        </div>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="startTime"
            label="Thời gian bắt đầu"
            rules={[
              { required: true, message: "Vui lòng chọn thời gian bắt đầu!" },
            ]}
          >
            <DatePicker showTime />
          </Form.Item>
          <Form.Item
            name="endTime"
            label="Thời gian kết thúc"
            rules={[
              { required: true, message: "Vui lòng chọn thời gian kết thúc!" },
            ]}
          >
            <DatePicker showTime />
          </Form.Item>
          <Form.Item
            name="contractDocumentImageURL"
            label="Tệp tài liệu hợp đồng"
            rules={[
              { required: true, message: "Vui lòng tải lên tệp tài liệu hợp đồng!" },
            ]}
          >
            <Input type="file" accept=".doc,.docx,.pdf" />
          </Form.Item>
            <Form.Item
            name="revenueSharePercentage"
            label="Phần trăm chia sẻ doanh thu"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập phần trăm chia sẻ doanh thu!",
              },
              {
                pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
                message: "Vui lòng nhập số thực hợp lệ (VD: 10.5).",
              },
              {
                validator: (_, value) => {
                  if (!value || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Phần trăm phải nằm trong khoảng 0 đến 100!"));
                },
              },
            ]}
          >
            <Input
              type="text"
              placeholder="Nhập giá trị (VD: 10.5)"
              addonAfter="%"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CreateContractPage;
