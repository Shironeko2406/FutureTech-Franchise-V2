import React, { useState } from "react";
import { Button, Drawer, Form, Input, InputNumber, Upload, Row, Col, Slider, message, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { imageDB } from "../../Firebasse/Config";
import { useDispatch, useSelector } from "react-redux";
import { CreateCourseActionAsync } from "../../Redux/ReducerAPI/CourseReducer";

const CreateCourseModal = ({ isDrawerVisible, closeDrawer, status, pageIndex, pageSize, searchTerm }) => {
  const { courseCategory } = useSelector(
    (state) => state.CourseCategoryReducer
  );
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [fileList, setFileList] = useState([]);

  const onChangePrice = (newValue) => {
    setPrice(newValue);
  };

  const formatter = (value) =>
    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";

  const handleUpload = ({ file, onSuccess, onError }) => {
    const storageRef = ref(imageDB, `images/${file.name}`); // Create reference to Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        // If there's an error during upload
        message.error("Upload failed!");
        console.error(error);
        onError(error); // Notify Ant Design Upload component of the error
      },
      async () => {
        // If upload is successful
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUrl(downloadURL); // Save the image URL
          message.success("Upload successful!");
          onSuccess(null, file); // Notify Ant Design Upload component that upload was successful
        } catch (err) {
          message.error("Failed to retrieve image URL.");
          console.error(err);
          onError(err); // Notify Ant Design Upload component of the error
        }
      }
    );
  };

  const handleChange = ({ fileList }) => {
    setFileList(fileList); // Cập nhật danh sách file khi thay đổi
  };

  const onFinish = (values) => {
    const finalValues = { ...values, price, urlImage: imageUrl };
    console.log("Form Data:", finalValues);
    dispatch(CreateCourseActionAsync(finalValues, status, pageIndex, pageSize, searchTerm))
      .then((response) => {
        if (response) {
          closeDrawer();
          form.resetFields();
          setFileList([]);
          setImageUrl("");
          setPrice(0);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Drawer
      title="Tạo Khóa Học Mới"
      width={720}
      onClose={closeDrawer}
      open={isDrawerVisible}
      styles={{ body: { paddingBottom: 80 } }}
      footer={
        <div style={{ textAlign: "right" }}>
          <Button onClick={closeDrawer} className="me-2">
            Cancel
          </Button>
          <Button onClick={() => form.submit()} type="primary">
            Submit
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Dòng chứa tên khóa học và mã khóa học */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Tên Khóa Học"
              rules={[
                { required: true, message: "Vui lòng nhập tên khóa học!" },
              ]}
            >
              <Input placeholder="Nhập tên khóa học" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="code"
              label="Mã Khóa Học"
              rules={[
                { required: true, message: "Vui lòng nhập mã khóa học!" },
              ]}
            >
              <Input placeholder="Nhập mã khóa học" />
            </Form.Item>
          </Col>
        </Row>

        {/* Dòng chứa số bài học và giá tiền */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="numberOfLession"
              label="Số Bài Học"
              rules={[{ required: true, message: "Vui lòng nhập số bài học!" }]}
            >
              <InputNumber
                min={0}
                placeholder="Nhập số bài học"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="courseCategoryid"
              label="Loại Khóa Học"
              rules={[
                { required: true, message: "Vui lòng chọn loại khóa học!" },
              ]}
            >
              <Select placeholder="Chọn loại khóa học">
                {courseCategory.map((category) => (
                  <Select.Option key={category.id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Upload hình ảnh */}
          <Col span={12}>
            <Form.Item
              name="urlImage"
              label="Hình Ảnh"
              rules={[
                { required: true, message: "Vui lòng tải lên hình ảnh!" },
              ]}
            >
              <Upload
                name="urlImage"
                listType="picture"
                maxCount={1}
                customRequest={handleUpload}
                fileList={fileList}
                onChange={handleChange}
              >
                <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Giá" name="price" initialValue={price}>
              {/* Slider và InputNumber */}
              <Row gutter={8}>
                <Col span={16}>
                  <Slider
                    min={0}
                    max={20000000}
                    step={100000}
                    tooltip={{
                      formatter,
                    }}
                    onChange={onChangePrice}
                    value={typeof price === "number" ? price : 0}
                  />
                </Col>
                <Col span={8}>
                  <InputNumber
                    min={0}
                    max={20000000}
                    step={100000}
                    value={price}
                    onChange={onChangePrice}
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                    }
                    parser={(value) => value.replace(/\./g, "")}
                  />
                </Col>
              </Row>
            </Form.Item>
          </Col>
        </Row>

        {/* Trường mô tả */}
        <Form.Item
          name="description"
          label="Mô Tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <Input.TextArea rows={5} placeholder="Nhập mô tả khóa học" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default CreateCourseModal;
