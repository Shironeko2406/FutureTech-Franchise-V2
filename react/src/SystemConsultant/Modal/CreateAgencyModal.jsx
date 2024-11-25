import { Form, Modal, Input, Select, Button, Typography, Row, Col } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { useLoading } from "../../Utils/LoadingContext";
import { CreateAgencyActionAsync } from "../../Redux/ReducerAPI/AgencyReducer";

const { Title } = Typography;
const { Option } = Select;

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

const CreateAgencyModal = ({ visible, onClose, consult }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { setLoading } = useLoading();
  const { cityData } = useSelector((state) => state.CityReducer);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    if (visible && consult) {
      form.setFieldsValue({
        name: consult.cusomterName,
        email: consult.email,
        phoneNumber: consult.phoneNumber
      }); 
    }
  }, [consult, form, visible]);

  const handleCityChange = (cityId) => {
    form.setFieldsValue({ district: undefined, ward: undefined });
    setWards([]);
    if (cityId) {
      const selectedCity = cityData.find((city) => city.Id === cityId);
      setDistricts(selectedCity ? selectedCity.Districts : []);
    } else {
      setDistricts([]);
    }
  };

  const handleDistrictChange = (districtId) => {
    form.setFieldsValue({ ward: undefined });
    if (districtId) {
      const cityId = form.getFieldValue("city");
      const selectedCity = cityData.find((city) => city.Id === cityId);
      const selectedDistrict = selectedCity.Districts.find(
        (district) => district.Id === districtId
      );
      setWards(selectedDistrict ? selectedDistrict.Wards : []);
    } else {
      setWards([]);
    }
  };

  const handleSubmit = (values) => {
    setLoading(true)
    const cityName = cityData.find((city) => city.Id === values.city)?.Name;
    const districtName = districts.find(
      (district) => district.Id === values.district
    )?.Name;
    const wardName = wards.find((ward) => ward.Id === values.ward)?.Name;

    const submittedData = {
      ...values,
      city: cityName,
      district: districtName,
      ward: wardName,
    };

    dispatch(CreateAgencyActionAsync(submittedData)).then((res)=>{
      setLoading(false)
      if (res) {
        onClose()
      }
    }).catch((err)=>{
      console.log(err)
      setLoading(false)
    })
  };

  return (
    <StyledModal
      open={visible}
      style={{ top: 20 }}
      title={<Title level={3}>Tạo đối tác</Title>}
      width={700}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Tạo
        </Button>,
      ]}
    >
      <StyledForm form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Tên"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
              <Input placeholder="Nhập tên" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Số điện thoại"
              name="phoneNumber"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Số điện thoại không hợp lệ!",
                },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input placeholder="Nhập địa chỉ" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Thành phố"
              name="city"
              rules={[{ required: true, message: "Vui lòng chọn thành phố!" }]}
            >
              <Select placeholder="Chọn thành phố" onChange={handleCityChange}>
                {cityData &&
                  cityData.map((city) => (
                    <Option key={city.Id} value={city.Id}>
                      {city.Name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Quận"
              name="district"
              rules={[{ required: true, message: "Vui lòng chọn quận!" }]}
            >
              <Select placeholder="Chọn quận" onChange={handleDistrictChange}>
                {districts.map((district) => (
                  <Option key={district.Id} value={district.Id}>
                    {district.Name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Phường"
              name="ward"
              rules={[{ required: true, message: "Vui lòng chọn phường!" }]}
            >
              <Select placeholder="Chọn phường">
                {wards.map((ward) => (
                  <Option key={ward.Id} value={ward.Id}>
                    {ward.Name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </StyledForm>
    </StyledModal>
  );
};

export default CreateAgencyModal;
