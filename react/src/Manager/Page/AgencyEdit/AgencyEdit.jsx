import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';
import { Card, Typography, Form, Input, Select, Button, message, Row, Col } from 'antd';
import { GetAgencyDetailByIdActionAsync, UpdateAgencyByIdActionAsync } from '../../../Redux/ReducerAPI/AgencyReducer';
import { GetCityDataActionAsync } from '../../../Redux/ReducerAPI/CityReducer';
import styled from 'styled-components';
import { useLoading } from '../../../Utils/LoadingContext';

const { Title } = Typography;
const { Option } = Select;

const StyledForm = styled(Form)`
  .ant-input,
  .ant-input-number,
  .ant-picker,
  .ant-select-selector {
    border-radius: 6px;
  }

  .ant-form-item-label > label {
    font-weight: 600;
  }

  .ant-btn-primary {
    border-radius: 6px;
    height: 40px;
  }

  .ant-select-selector {
    padding: 8px;
    font-size: 14px;
  }
`;

const AgencyEdit = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { agencyDetail } = useSelector((state) => state.AgencyReducer);
  const { cityData } = useSelector((state) => state.CityReducer);
  const { setLoading } = useLoading(); 
  const [form] = Form.useForm();
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    dispatch(GetAgencyDetailByIdActionAsync(id));
    dispatch(GetCityDataActionAsync());
  }, [id, dispatch]);

  useEffect(() => {
    if (agencyDetail && cityData) {
      const selectedCity = cityData.find((city) => city.Name === agencyDetail.city);
      const selectedDistrict = selectedCity?.Districts.find(
        (district) => district.Name === agencyDetail.district
      );
      const selectedWard = selectedDistrict?.Wards.find(
        (ward) => ward.Name === agencyDetail.ward
      );
  
      form.setFieldsValue({
        name: agencyDetail.name,
        address: agencyDetail.address,
        city: selectedCity?.Id, // Set city ID
        district: selectedDistrict?.Id, // Set district ID
        ward: selectedWard?.Id, // Set ward ID
        phoneNumber: agencyDetail.phoneNumber,
        email: agencyDetail.email,
      });
  
      if (selectedCity) {
        setDistricts(selectedCity.Districts);
        if (selectedDistrict) {
          setWards(selectedDistrict.Wards);
        }
      }
    }
  }, [agencyDetail, cityData, form]);
  

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

  const handleSubmit = async (values) => {
    setLoading(true)
    const cityName = cityData.find((city) => city.Id === values.city)?.Name;
    const districtName = districts.find((district) => district.Id === values.district)?.Name;
    const wardName = wards.find((ward) => ward.Id === values.ward)?.Name;
  
    const submittedData = {
      ...values,
      city: cityName,
      district: districtName,
      ward: wardName,
    };
    await dispatch(UpdateAgencyByIdActionAsync(submittedData, id));
    setLoading(false);
  };

  return (
    <Card>
      <Title level={4}>
        <EditOutlined /> Chỉnh sửa chi nhánh
      </Title>
      <StyledForm
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="name"
              label="Tên chi nhánh"
              rules={[{ required: true, message: 'Vui lòng nhập tên chi nhánh' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="phoneNumber"
              label="Số điện thoại"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại' },
                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' }
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
        >
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="city"
              label="Thành phố"
              rules={[{ required: true, message: 'Vui lòng chọn thành phố' }]}
            >
              <Select onChange={handleCityChange}>
                {cityData.map((city) => (
                  <Option key={city.Id} value={city.Id}>
                    {city.Name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="district"
              label="Quận/Huyện"
              rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]}
            >
              <Select onChange={handleDistrictChange}>
                {districts.map((district) => (
                  <Option key={district.Id} value={district.Id}>
                    {district.Name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="ward"
          label="Phường/Xã"
          rules={[{ required: true, message: 'Vui lòng chọn phường/xã' }]}
        >
          <Select>
            {wards.map((ward) => (
              <Option key={ward.Id} value={ward.Id}>
                {ward.Name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Cập nhật
          </Button>
        </Form.Item>
      </StyledForm>

    </Card>
  );
};

export default AgencyEdit;

