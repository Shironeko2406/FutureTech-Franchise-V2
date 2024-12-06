import React, { useState, useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select, Upload, Spin, message, Card, Divider } from "antd";
import { UploadOutlined, UserOutlined, HomeOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { imageDB } from "../../Firebasse/Config";
import axios from "axios";

const { Option } = Select;
const { TextArea } = Input;

const CreateAccountModal = ({ visible, onClose, onSubmit, agencyId, isAgencyManagement }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addressData, setAddressData] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    useEffect(() => {
        const fetchAddressData = async () => {
            try {
                const response = await axios.get(
                    "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
                );
                setAddressData(response.data);
            } catch (error) {
                console.error("Error fetching address data:", error);
                message.error("Không thể tải dữ liệu địa chỉ. Vui lòng thử lại sau.");
            }
        };

        fetchAddressData();
    }, []);

    const handleProvinceChange = (value) => {
        const selectedProvince = addressData.find((province) => province.Id === value);
        if (selectedProvince) {
            setDistricts(selectedProvince.Districts);
            form.setFieldsValue({ district: undefined, ward: undefined });
        } else {
            setDistricts([]);
        }
        setWards([]);
    };

    const handleDistrictChange = (value) => {
        const selectedProvince = addressData.find(
            (province) => province.Id === form.getFieldValue("province")
        );
        const selectedDistrict = selectedProvince?.Districts.find(
            (district) => district.Id === value
        );
        if (selectedDistrict) {
            setWards(selectedDistrict.Wards);
            form.setFieldsValue({ ward: undefined });
        } else {
            setWards([]);
        }
    };

    const handleCreateAccount = async (values) => {
        setLoading(true);
        const provinceName = addressData.find((p) => p.Id === values.province)?.Name;
        const districtName = districts.find((d) => d.Id === values.district)?.Name;
        const wardName = wards.find((w) => w.Id === values.ward)?.Name;

        const accountData = {
            ...values,
            urlImage: fileList[0]?.url || "",
            address: `${values.streetAddress}, ${wardName}, ${districtName}, ${provinceName}`,
            agencyId: isAgencyManagement ? agencyId : undefined
        };
        try {
            const success = await onSubmit(accountData);
            if (success) {
                form.resetFields();
                setFileList([]);
                onClose();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (file) => {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
            message.error("Chỉ được tải lên file ảnh!");
            return Upload.LIST_IGNORE;
        }

        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("Ảnh phải nhỏ hơn 2MB!");
            return Upload.LIST_IGNORE;
        }

        setLoading(true);
        try {
            const storageRef = ref(imageDB, `images/${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setFileList([{ uid: file.uid, name: file.name, status: 'done', url: url }]);
            message.success("Tải ảnh lên thành công!");
        } catch (error) {
            message.error("Có lỗi xảy ra khi tải ảnh lên!");
        } finally {
            setLoading(false);
        }
        return false;
    };

    const handleRemove = () => {
        setFileList([]);
    };

    const roleOptions = isAgencyManagement
        ? [
            { value: "Student", label: "Học sinh" },
            { value: "Instructor", label: "Giảng viên chi nhánh" },
            { value: "AgencyStaff", label: "Nhân viên chi nhánh" },
            { value: "AgencyManager", label: "Quản lý chi nhánh" }
        ]
        : [
            { value: "SystemInstructor", label: "Giảng viên trung tâm" },
            { value: "SystemConsultant", label: "Tư vấn viên" },
            { value: "SystemTechician", label: "Kỹ thuật viên" },
            { value: "Manager", label: "Quản lý hệ thống" },
            { value: "Administrator", label: "Quản trị viên" }
        ];

    return (
        <Modal
            title="Tạo tài khoản"
            open={visible}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={loading}
            width={800}
            className="instructorManagement"
        >
            <Spin spinning={loading}>
                <Form form={form} layout="vertical" onFinish={handleCreateAccount}>
                    <Card title="Thông tin cá nhân" className="mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item name="fullName" label="Tên đầy đủ" rules={[{ required: true, message: "Vui lòng nhập tên đầy đủ!" }]}>
                                <Input prefix={<UserOutlined />} placeholder="Nhập tên đầy đủ" />
                            </Form.Item>
                            <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ!" }]}>
                                <Input prefix={<MailOutlined />} placeholder="Nhập email" />
                            </Form.Item>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item name="phoneNumber" label="Số điện thoại" rules={[{ required: true, pattern: /^[0-9]{10}$/, message: "Vui lòng nhập số điện thoại hợp lệ!" }]}>
                                <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại 10 số" />
                            </Form.Item>
                            <Form.Item
                                name="dateOfBirth"
                                label="Ngày sinh"
                                rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    placeholder="Chọn ngày sinh"
                                    disabledDate={(current) => current && current > new Date()}
                                />
                            </Form.Item>
                        </div>
                        <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}>
                            <Select placeholder="Chọn giới tính">
                                <Option value="Male">Nam</Option>
                                <Option value="Female">Nữ</Option>
                                <Option value="Other">Khác</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="role" label="Vai trò" rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}>
                            <Select placeholder="Chọn vai trò">
                                {roleOptions.map((role) => (
                                    <Option key={role.value} value={role.value}>
                                        {role.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Card>

                    <Divider />

                    <Card title="Địa chỉ người dùng" className="mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Form.Item name="province" label="Tỉnh/Thành phố" rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố!" }]}>
                                <Select placeholder="Chọn tỉnh/thành phố" onChange={handleProvinceChange}>
                                    {addressData.map((province) => (
                                        <Option key={province.Id} value={province.Id}>
                                            {province.Name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item name="district" label="Quận/Huyện" rules={[{ required: true, message: "Vui lòng chọn quận/huyện!" }]}>
                                <Select placeholder="Chọn quận/huyện" onChange={handleDistrictChange}>
                                    {districts.map((district) => (
                                        <Option key={district.Id} value={district.Id}>
                                            {district.Name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item name="ward" label="Phường/Xã" rules={[{ required: true, message: "Vui lòng chọn phường/xã!" }]}>
                                <Select placeholder="Chọn phường/xã">
                                    {wards.map((ward) => (
                                        <Option key={ward.Id} value={ward.Id}>
                                            {ward.Name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                        <Form.Item name="streetAddress" label="Địa chỉ cụ thể" rules={[{ required: true, message: "Vui lòng nhập địa chỉ cụ thể!" }]}>
                            <TextArea prefix={<HomeOutlined />} placeholder="Nhập số nhà, tên đường" />
                        </Form.Item>
                    </Card>

                    <Divider />

                    <Card title="Ảnh đại diện" className="mb-4">
                        <Form.Item
                            name="avatar"
                            // rules={[{ required: true, message: "Vui lòng tải lên ảnh đại diện!" }]}
                            valuePropName="fileList"
                            getValueFromEvent={(e) => {
                                if (Array.isArray(e)) {
                                    return e;
                                }
                                return e && e.fileList;
                            }}
                        >
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                beforeUpload={handleUpload}
                                onRemove={handleRemove}
                                accept="image/*"
                            >
                                {fileList.length >= 1 ? null : (
                                    <div>
                                        <UploadOutlined />
                                        <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                                    </div>
                                )}
                            </Upload>
                        </Form.Item>
                    </Card>
                </Form>
            </Spin>
        </Modal>
    );
};

export default CreateAccountModal;