export const translateRoleToVietnamese = (role) => {
  const roleMap = {
    Administrator: "Quản trị viên",
    Manager: "Quản lý hệ thống",
    AgencyManager: "Quản lý chi nhánh",
    Student: "Sinh viên",
    Instructor: "Giảng viên",
    SystemInstructor: "Giảng viên hệ thống",
    SystemConsultant: "Tư vấn viên hệ thống",
    SystemTechnician: "Kĩ thuật viên hệ thống",
    AgencyStaff: "Nhân viên chi nhánh",
  };

  return roleMap[role] || "Không xác định"; //
};
