import React, { useState, useEffect } from "react";
import { Button, Form, Input, InputNumber, Upload, Row, Col, Slider, message, Select, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { imageDB } from "../../Firebasse/Config";
import { useDispatch, useSelector } from "react-redux";
import { useLoading } from "../../Utils/LoadingContext";
import { UpdateCourseByIdActionAsync } from "../../Redux/ReducerAPI/CourseReducer";

const EditCourseModal = ({ visible, onClose, selectedCourse, status, pageIndex, pageSize, searchTerm }) => {
  const { courseCategory } = useSelector((state) => state.CourseCategoryReducer);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [fileList, setFileList] = useState([]);
  const { setLoading } = useLoading();

  useEffect(() => {
    if (selectedCourse) {
      form.setFieldsValue({
        name: selectedCourse.name,
        code: selectedCourse.code,
        numberOfLession: selectedCourse.numberOfLession,
        courseCategoryid: selectedCourse.courseCategoryId,
        description: selectedCourse.description,
      });
      setPrice(selectedCourse.price);
      setImageUrl(selectedCourse.urlImage);
      setFileList(
        selectedCourse.urlImage
          ? [
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                url: selectedCourse.urlImage,
              },
            ]
          : []
      );
    }
  }, [selectedCourse, form]);

  const onChangePrice = (newValue) => {
    setPrice(newValue);
  };

  const formatter = (value) =>
    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";

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
          setFileList([
            {
              uid: file.uid,
              name: file.name,
              status: 'done',
              url: downloadURL,
            },
          ]);
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
    const finalValues = { ...values, price, urlImage: imageUrl};
    setLoading(true);
    dispatch(UpdateCourseByIdActionAsync(finalValues,selectedCourse.id, status, pageIndex, pageSize, searchTerm))
      .then((response) => {
        setLoading(false);
        if (response) {
          onClose();
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <Modal
      title="Sửa khóa học"
      width={700}
      onCancel={onClose}
      open={visible}
      style={{ top: 20 }}
      footer={
        <div style={{ textAlign: "right" }}>
          <Button onClick={onClose} className="me-2" danger>
            Hủy
          </Button>
          <Button onClick={() => form.submit()} type="primary">
            Cập nhật
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Tên Khóa Học"
              rules={[{ required: true, message: "Vui lòng nhập tên khóa học!" }]}
            >
              <Input placeholder="Nhập tên khóa học" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="code"
              label="Mã Khóa Học"
              rules={[{ required: true, message: "Vui lòng nhập mã khóa học!" }]}
            >
              <Input placeholder="Nhập mã khóa học" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="numberOfLession"
              label="Số Bài Học"
              rules={[{ required: true, message: "Vui lòng nhập số bài học!" }]}
            >
              <InputNumber min={0} placeholder="Nhập số bài học" style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="courseCategoryid"
              label="Loại Khóa Học"
              rules={[{ required: true, message: "Vui lòng chọn loại khóa học!" }]}
            >
              <Select placeholder="Chọn loại khóa học">
                {courseCategory.map((category) => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="urlImage"
              label="Hình Ảnh"
              // rules={[{ required: true, message: "Vui lòng tải lên hình ảnh!" }]}
              valuePropName="file"
              getValueFromEvent={(e) => e && e.fileList}
            >
              <Upload
                listType="picture-card"
                maxCount={1}
                customRequest={handleUpload}
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                onRemove={() => {
                  setImageUrl("");
                  setFileList([]);
                  form.setFieldsValue({ urlImage: "" });
                }}
              >
                {fileList.length >= 1 ? null : (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Tải lên</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Giá" name="price" initialValue={price}>
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
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    parser={(value) => value.replace(/\./g, "")}
                  />
                </Col>
              </Row>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="Mô Tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <Input.TextArea rows={5} placeholder="Nhập mô tả khóa học" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCourseModal;

