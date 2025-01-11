// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { NavLink, useLocation, useParams } from "react-router-dom";
// import { GetClassMaterialOfUserLoginActionAsync, GetClassOfUserLoginActionAsync } from "../../Redux/ReducerAPI/UserReducer";
// import { formatDate } from "../../Utils/Validator/FormatDate";
// import { Alert, Modal, Typography } from "antd";
// import { ClockCircleOutlined, FileTextOutlined, InfoCircleOutlined, PhoneOutlined, WalletOutlined } from "@ant-design/icons";
// import { StudentRequestRefundActionAsync } from "../../Redux/ReducerAPI/RegisterCourseReducer";

// const { Title, Paragraph, Text } = Typography;

// const LeftSidebar = ({ onSidebarToggle }) => {
//   const dispatch = useDispatch();
//   const { classOfUserLogin, materialClass } = useSelector((state) => state.UserReducer);
//   const [openSubmenus, setOpenSubmenus] = useState({});
//   const { className, courseId, materialNumber, number } = useParams(); //number của chapter
//   const location = useLocation();
//   const selectedClassId = classOfUserLogin?.find((c) => c.className === className)?.classId;
//   const selectedCourseId = classOfUserLogin?.find((c) => c.className === className)?.courseId;
//   const isStudentRoute = location.pathname.startsWith('/student');
//   const isClassRoute = location.pathname.includes('/student/') && className;
//   const isChapterRoute = location.pathname.includes('/student/') && className && materialNumber;
//   const currentClass = classOfUserLogin?.find(c => c.className === className);
//   const currentDate = new Date();
//   const startDate = currentClass ? new Date(currentClass.startDate) : null;
//   const endDate = currentClass ? new Date(currentClass.endDate) : null;
//   const canAccessMaterialClass = startDate && currentDate >= new Date(startDate.getTime() - 5 * 24 * 60 * 60 * 1000);
//   const showRefundRequest = startDate && currentDate < startDate;
//   const daysUntilStart = Math.ceil((startDate - currentDate) / (1000 * 60 * 60 * 24));
//   const refundPercentage = daysUntilStart > 10 ? 100 : daysUntilStart > 5 ? 80 : 50;
//   const estimatedRefund = (materialClass.price * refundPercentage) / 100;

//   useEffect(() => {
//     dispatch(GetClassOfUserLoginActionAsync())
//   }, [])

//   useEffect(() => {
//     const currentCourseId = courseId || selectedCourseId;

//     if (currentCourseId && canAccessMaterialClass) {
//       dispatch(GetClassMaterialOfUserLoginActionAsync(currentCourseId))
//     }
//   }, [courseId, selectedCourseId]);

//   const handleRefundRequest = () => {
//     Modal.confirm({
//       title: 'Xác nhận yêu cầu hoàn tiền',
//       width: 800,
//       style: { top: 20 },
//       icon: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
//       content: (
//         <div className="mt-3">
//           <Alert
//             message="Bạn có chắc chắn muốn gửi yêu cầu hoàn tiền cho khóa học này không?"
//             type="warning"
//             showIcon
//             style={{ marginBottom: 20 }}
//           />
  
//           <div className="border p-3 bg-light rounded">
//             <Title level={5} className="d-flex align-items-center mb-3">
//               <InfoCircleOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
//               Quy trình hoàn tiền:
//             </Title>
  
//             <div className="d-flex flex-column gap-3">
//               <div className="d-flex align-items-start gap-3">
//                 <ClockCircleOutlined className="text-primary mt-1 fs-4" />
//                 <div className="flex-grow-1">
//                   <Text strong>Thời gian xử lý:</Text>
//                   <Paragraph className="mb-0">Yêu cầu hoàn tiền sẽ được xử lý sau 24h làm việc</Paragraph>
//                 </div>
//               </div>
  
//               <div className="d-flex align-items-start gap-3">
//                 <PhoneOutlined className="text-primary mt-1 fs-4" />
//                 <div className="flex-grow-1">
//                   <Text strong>Xác nhận qua điện thoại:</Text>
//                   <Paragraph className="mb-0">Sẽ có nhân viên gọi điện xác nhận bên người dùng</Paragraph>
//                 </div>
//               </div>
  
//               <div className="d-flex align-items-start gap-3">
//                 <FileTextOutlined className="text-primary mt-1 fs-4" />
//                 <div className="flex-grow-1">
//                   <Text strong>Yêu cầu thông tin:</Text>
//                   <Paragraph className="mb-0">Người yêu cầu cần cung cấp rõ lý do muốn hoàn tiền để nhân viên ghi nhận vào hệ thống</Paragraph>
//                 </div>
//               </div>
  
//               <div className="d-flex align-items-start gap-3">
//                 <WalletOutlined className="text-primary mt-1 fs-4" />
//                 <div className="flex-grow-1">
//                   <Text strong>Hoàn tiền:</Text>
//                   <Paragraph className="mb-0">
//                     Sau khi hoàn tiền thành công, số tiền sẽ được gửi trả về người dùng, hãy kiểm tra email
//                   </Paragraph>
//                 </div>
//               </div>
//             </div>
//           </div>
  
//           <div className="mt-4">
//           <Title level={5}>Điều khoản hoàn tiền:</Title>
//           <ul>
//             <li>
//               <Text>Hơn 10 ngày trước khi khóa học bắt đầu: <Text strong>Hoàn 100% học phí</Text></Text>
//             </li>
//             <li>
//               <Text>Từ 6-10 ngày trước khi khóa học bắt đầu: <Text strong>Hoàn 80% học phí</Text></Text>
//             </li>
//             <li>
//               <Text>Từ 1-5 ngày trước khi khóa học bắt đầu: <Text strong>Hoàn 50% học phí</Text></Text>
//             </li>
//           </ul>
//           <Paragraph type="secondary">
//             Lưu ý: Thời gian được tính từ ngày yêu cầu hoàn tiền đến ngày bắt đầu khóa học.
//           </Paragraph>
//           <Paragraph>
//             <Text strong>Số tiền hoàn trả ước tính: {estimatedRefund.toLocaleString()} VND</Text> ({refundPercentage}% của học phí)
//           </Paragraph>
//         </div>

//         <Alert
//           message="Vui lòng xem xét kỹ các điều khoản trước khi xác nhận yêu cầu hoàn tiền."
//           type="info"
//           showIcon
//           style={{ marginTop: 20 }}
//         />
//         </div>
//       ),
//       onOk() {
//         dispatch(StudentRequestRefundActionAsync(selectedCourseId))
//       },
//     });
//   };
  
//   const getSidebarItems = () => {
//     let routeType = '';

//     if (isStudentRoute && !isClassRoute) {
//       routeType = 'STUDENT_ROUTE';
//     } else if (isClassRoute && !isChapterRoute) {
//       routeType = 'CLASS_ROUTE';
//     } else if (isChapterRoute) {
//       routeType = 'CHAPTER_ROUTE';
//     }

//     switch (routeType) {
//       case 'STUDENT_ROUTE':
//         return [
//           { type: "section", label: "Lịch học", icon: "ti ti-dots" },
//           { type: 'link', label: 'Lịch học', path: '/student', icon: 'mdi:clock' },
//           { type: "section", label: "Lớp học", icon: "ti ti-dots" },
//           ...(classOfUserLogin?.map((classItem) => ({
//             type: "link",
//             label: classItem.className,
//             path: classItem.canAccessMaterial
//               ? `/student/${classItem.className}/course/${classItem.courseId}/chapter/1`
//               : `/student/${classItem.className}/course/${classItem.courseId}/not-start`,
//             icon: "mdi:school",
//           })) || []),
//           { type: "section", label: "Khóa học", icon: "ti ti-dots" },
//           { type: 'link', label: 'Khóa học liên quan', path: '/student/relate-course', icon: 'mdi:clock' },

//         ];

//       case 'CLASS_ROUTE':
//         const classInfoLabel = `${className} (${formatDate(startDate)} - ${formatDate(endDate)})`;
//         return [
//           { type: "section", label: classInfoLabel, icon: "ti ti-dots" },
//           {
//             type: "submenu",
//             label: "Tài nguyên lớp học",
//             icon: "mdi:book-open-variant",
//             subItems: canAccessMaterialClass
//               ? materialClass?.chapters?.map((chapter) => ({
//                   label: `${chapter.topic}`,
//                   path: `/student/${className}/course/${selectedCourseId}/chapter/${chapter.number}`,
//                 })) || []
//               : [
//                   {
//                     label: "Chưa đến ngày truy cập",
//                     path: `/student/${className}/course/${selectedCourseId}/not-start`,
//                   },
//                 ],
//           },
//           { type: "link", label: "Bài kiểm tra", path: `/student/${className}/${selectedClassId}/quiz`, icon: "mdi:test-tube" },
//           { type: "link", label: "Bài tập nộp", path: `/student/${className}/${selectedClassId}/assignment`, icon: "mdi:clipboard-text" },
//           { type: "link", label: "Điểm số", path: `/student/${className}/${selectedClassId}/course/${selectedCourseId}/score`, icon: "mdi:clipboard-text" },
//           { type: "link", label: "Tình trạng điểm danh", path: `/student/${className}/${selectedClassId}/attendance`, icon: "mdi:clipboard-text" },
//           ...(showRefundRequest ? [{
//             type: "custom",
//             label: "Yêu cầu hoàn tiền",
//             icon: "mdi:cash-refund",
//             onClick: handleRefundRequest 
//           }] : [])
//         ];

//       case 'CHAPTER_ROUTE':
//         return [
//           { type: "section", label: className, icon: "ti ti-dots" },
//           ...(materialClass?.chapters?.map((chapter) => ({
//             type: "submenu",
//             label: chapter.topic,
//             icon: "mdi:book-open-variant",
//             subItems: chapter.chapterMaterials?.map((material) => ({
//               label: material.title,
//               path: material.urlVideo
//                 ? `/student/${className}/course/${selectedCourseId}/chapter/${chapter.number}/material/${material.number}/video`
//                 : `/student/${className}/course/${selectedCourseId}/chapter/${chapter.number}/material/${material.number}/reading`,
//             })) || [],
//           })) || []),
//         ];

//       default:
//         return [];
//     }
//   };

//   const sidebarItems = getSidebarItems();

//   // New useEffect to set initial state of openSubmenus
//   useEffect(() => {
//     const initialOpenSubmenus = {};

//     if (isChapterRoute) {
//       const currentChapterNumber = parseInt(number, 10);

//       materialClass?.chapters?.forEach((chapter) => {
//         if (chapter.number === currentChapterNumber) {
//           initialOpenSubmenus[chapter.number] = true; // Mở submenu của chapter hiện tại
//         } else {
//           initialOpenSubmenus[chapter.number] = false; // Đóng các submenu khác
//         }
//       });

//     } else if (isClassRoute && !isChapterRoute) {
//       sidebarItems.forEach((item, index) => {
//         if (item.type === "submenu") {
//           initialOpenSubmenus[index] = true; // Mở tất cả submenu
//         }
//       });
//     }

//     setOpenSubmenus(initialOpenSubmenus);
//   }, [materialClass, number, materialNumber]);


//   const toggleSubmenu = (index) => {
//     setOpenSubmenus((prevOpenSubmenus) => ({
//       ...prevOpenSubmenus,
//       [index]: !prevOpenSubmenus[index],
//     }));
//   };

//   return (
//     <aside className="left-sidebar">
//       <div>
//         <div className="brand-logo d-flex align-items-center justify-content-between">
//           <NavLink to="/student" className="text-nowrap logo-img">
//             <img src="/assets/images/logos/FutureTechLogo.png" alt="logo" />
//           </NavLink>
//           <div
//             className="close-btn d-xl-none d-block sidebartoggler cursor-pointer"
//             id="sidebarCollapse"
//             onClick={onSidebarToggle}
//           >
//             <i className="ti ti-x fs-8" />
//           </div>
//         </div>
//         <nav className="sidebar-nav scroll-sidebar" data-simplebar>
//           <ul id="sidebarnav">
//             {sidebarItems.map((item, index) =>
//               item.type === "section" ? (
//                 <li key={index} className="nav-small-cap">
//                   <i className={`${item.icon} nav-small-cap-icon fs-6`} />
//                   <span className="hide-menu">{item.label}</span>
//                 </li>
//               ) : item.type === "submenu" ? (
//                 <li key={index} className="sidebar-item">
//                   <div
//                     className="sidebar-link"
//                     onClick={() => toggleSubmenu(index)}
//                     aria-expanded={openSubmenus[index]}
//                   >
//                     {!isChapterRoute && (
//                       <span>
//                         <iconify-icon icon={item.icon} className="fs-6" />
//                       </span>
//                     )}
//                     <span
//                       className="hide-menu"
//                       style={{
//                         whiteSpace: "normal",
//                         wordWrap: "break-word",
//                         lineHeight: "1.4",
//                         fontSize: isChapterRoute ? '14px' : ''
//                       }}
//                     >
//                       {item.label}
//                     </span>
//                   </div>
//                   {openSubmenus[index] && (
//                     <ul className="submenu" >
//                       {item.subItems?.map((subItem, subIndex) => (
//                         <li key={subIndex}>
//                           <NavLink
//                             className="sidebar-link fs-2"
//                             to={subItem.path}
//                             style={{
//                               whiteSpace: "normal",
//                               wordWrap: "break-word",
//                               padding: "8px 15px",
//                               lineHeight: "1.4",
//                             }}
//                           >
//                             {subItem.label}
//                           </NavLink>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </li>
//               ) : item.type === "custom" ? (
//                 <li key={index} className="sidebar-item">
//                   <div
//                     className="sidebar-link"
//                     onClick={item.onClick}
//                     style={{ cursor: 'pointer' }}
//                   >
//                     <span>
//                       <iconify-icon icon={item.icon} className="fs-6" />
//                     </span>
//                     <span className="hide-menu">{item.label}</span>
//                   </div>
//                 </li>
//               ) : (
//                 <li key={index} className="sidebar-item">
//                   <NavLink
//                     className="sidebar-link"
//                     to={item.path}
//                     aria-expanded="false"
//                   >
//                     <span>
//                       <iconify-icon icon={item.icon} className="fs-6" />
//                     </span>
//                     <span className="hide-menu">{item.label}</span>
//                   </NavLink>
//                 </li>
//               )
//             )}
//           </ul>
//         </nav>
//       </div>
//     </aside>
//   );
// };

// export default LeftSidebar;










import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { GetClassMaterialOfUserLoginActionAsync, GetClassOfUserLoginActionAsync } from "../../Redux/ReducerAPI/UserReducer";
import { formatDate } from "../../Utils/Validator/FormatDate";
import { Alert, Modal, Typography, Spin } from "antd";
import { ClockCircleOutlined, FileTextOutlined, InfoCircleOutlined, PhoneOutlined, WalletOutlined } from "@ant-design/icons";
import { StudentRequestRefundActionAsync } from "../../Redux/ReducerAPI/RegisterCourseReducer";

const { Title, Paragraph, Text } = Typography;

export default function LeftSidebar({ onSidebarToggle }) {
  const dispatch = useDispatch();
  const { classOfUserLogin, materialClass } = useSelector((state) => state.UserReducer);
  const [openSubmenus, setOpenSubmenus] = useState({});
  
  // Add loading states
  const [classesLoading, setClassesLoading] = useState(false);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [chapterLoading, setChapterLoading] = useState(false);

  const { className, courseId, materialNumber, number } = useParams();
  const location = useLocation();
  const selectedClassId = classOfUserLogin?.find((c) => c.className === className)?.classId;
  const selectedCourseId = classOfUserLogin?.find((c) => c.className === className)?.courseId;
  const isStudentRoute = location.pathname.startsWith('/student');
  const isClassRoute = location.pathname.includes('/student/') && className;
  const isChapterRoute = location.pathname.includes('/student/') && className && materialNumber;
  const currentClass = classOfUserLogin?.find(c => c.className === className);
  const currentDate = new Date();
  const startDate = currentClass ? new Date(currentClass.startDate) : null;
  const endDate = currentClass ? new Date(currentClass.endDate) : null;

  // Check conditions
  const canAccessMaterialClass = startDate && currentDate >= new Date(startDate.getTime() - 5 * 24 * 60 * 60 * 1000);
  const showRefundRequest = startDate && currentDate < startDate;
  const showScoreOfCourse = endDate && currentDate > endDate;
  const daysUntilStart = Math.ceil((startDate - currentDate) / (1000 * 60 * 60 * 24));
  const refundPercentage = daysUntilStart > 10 ? 100 : daysUntilStart > 5 ? 80 : 50;
  const estimatedRefund = (materialClass?.price * refundPercentage) / 100;

  // Modified useEffect with loading state
  useEffect(() => {
    const fetchClasses = async () => {
      setClassesLoading(true);
      try {
        await dispatch(GetClassOfUserLoginActionAsync());
      } finally {
        setClassesLoading(false);
      }
    };
    fetchClasses();
  }, []);

  // Modified useEffect with loading state
  useEffect(() => {
    const fetchMaterials = async () => {
      const currentCourseId = courseId || selectedCourseId;
      if (currentCourseId) {
        setChapterLoading(true)
        setMaterialsLoading(true);
        try {
          await dispatch(GetClassMaterialOfUserLoginActionAsync(currentCourseId));
        } finally {
          setMaterialsLoading(false);
          setChapterLoading(false)
        }
      }
    };
    fetchMaterials();
  }, [courseId, selectedCourseId]);

  const handleRefundRequest = () => {
    Modal.confirm({
      title: 'Xác nhận yêu cầu hoàn tiền',
      width: 800,
      style: { top: 20 },
      icon: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
      content: (
        <div className="mt-3">
          <Alert
            message="Bạn có chắc chắn muốn gửi yêu cầu hoàn tiền cho khóa học này không?"
            type="warning"
            showIcon
            style={{ marginBottom: 20 }}
          />
  
          <div className="border p-3 bg-light rounded">
            <Title level={5} className="d-flex align-items-center mb-3">
              <InfoCircleOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
              Quy trình hoàn tiền:
            </Title>
  
            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-start gap-3">
                <ClockCircleOutlined className="text-primary mt-1 fs-4" />
                <div className="flex-grow-1">
                  <Text strong>Thời gian xử lý:</Text>
                  <Paragraph className="mb-0">Yêu cầu hoàn tiền sẽ được xử lý sau 24h làm việc</Paragraph>
                </div>
              </div>
  
              <div className="d-flex align-items-start gap-3">
                <PhoneOutlined className="text-primary mt-1 fs-4" />
                <div className="flex-grow-1">
                  <Text strong>Xác nhận qua điện thoại:</Text>
                  <Paragraph className="mb-0">Sẽ có nhân viên gọi điện xác nhận bên người dùng</Paragraph>
                </div>
              </div>
  
              <div className="d-flex align-items-start gap-3">
                <FileTextOutlined className="text-primary mt-1 fs-4" />
                <div className="flex-grow-1">
                  <Text strong>Yêu cầu thông tin:</Text>
                  <Paragraph className="mb-0">Người yêu cầu cần cung cấp rõ lý do muốn hoàn tiền để nhân viên ghi nhận vào hệ thống</Paragraph>
                </div>
              </div>
  
              <div className="d-flex align-items-start gap-3">
                <WalletOutlined className="text-primary mt-1 fs-4" />
                <div className="flex-grow-1">
                  <Text strong>Hoàn tiền:</Text>
                  <Paragraph className="mb-0">
                    Sau khi hoàn tiền thành công, số tiền sẽ được gửi trả về người dùng, hãy kiểm tra email
                  </Paragraph>
                </div>
              </div>
            </div>
          </div>
  
          <div className="mt-4">
            <Title level={5}>Điều khoản hoàn tiền:</Title>
            <ul>
              <li>
                <Text>Hơn 10 ngày trước khi khóa học bắt đầu: <Text strong>Hoàn 100% học phí</Text></Text>
              </li>
              <li>
                <Text>Từ 6-10 ngày trước khi khóa học bắt đầu: <Text strong>Hoàn 80% học phí</Text></Text>
              </li>
              <li>
                <Text>Từ 1-5 ngày trước khi khóa học bắt đầu: <Text strong>Hoàn 50% học phí</Text></Text>
              </li>
            </ul>
            <Paragraph type="secondary">
              Lưu ý: Thời gian được tính từ ngày yêu cầu hoàn tiền đến ngày bắt đầu khóa học.
            </Paragraph>
            <Paragraph>
              <Text strong>Số tiền hoàn trả ước tính: {estimatedRefund.toLocaleString()} VND</Text> ({refundPercentage}% của học phí)
            </Paragraph>
          </div>

          <Alert
            message="Vui lòng xem xét kỹ các điều khoản trước khi xác nhận yêu cầu hoàn tiền."
            type="info"
            showIcon
            style={{ marginTop: 20 }}
          />
        </div>
      ),
      onOk() {
        dispatch(StudentRequestRefundActionAsync(selectedCourseId));
      },
    });
  };

  const getSidebarItems = () => {
    let routeType = '';

    if (isStudentRoute && !isClassRoute) {
      routeType = 'STUDENT_ROUTE';
    } else if (isClassRoute && !isChapterRoute) {
      routeType = 'CLASS_ROUTE';
    } else if (isChapterRoute) {
      routeType = 'CHAPTER_ROUTE';
    }

    switch (routeType) {
      case 'STUDENT_ROUTE':
        return [
          { type: "section", label: "Lịch học", icon: "ti ti-dots" },
          { type: 'link', label: 'Lịch học', path: '/student', icon: 'mdi:clock' },
          { type: "section", label: "Lớp học", icon: "ti ti-dots" },
          ...(classesLoading ? [
            { type: "loading", label: "Đang tải lớp học..." }
          ] : classOfUserLogin?.map((classItem) => ({
            type: "link",
            label: classItem.className,
            path: classItem.canAccessMaterial
              ? `/student/${classItem.className}/course/${classItem.courseId}/chapter/1`
              : `/student/${classItem.className}/course/${classItem.courseId}/not-start`,
            icon: "mdi:school",
          })) || []),
          { type: "section", label: "Khóa học", icon: "ti ti-dots" },
          { type: 'link', label: 'Khóa học liên quan', path: '/student/relate-course', icon: 'mdi:clock' },
        ];

      case 'CLASS_ROUTE':
        const classInfoLabel = `${className} (${formatDate(startDate)} - ${formatDate(endDate)})`;
        return [
          { type: "section", label: classInfoLabel, icon: "ti ti-dots" },
          {
            type: "submenu",
            label: "Tài nguyên lớp học",
            icon: "mdi:book-open-variant",
            subItems: materialsLoading ? [
              { label: "Đang tải tài liệu...", path: "#" }
            ] : canAccessMaterialClass
              ? materialClass?.chapters?.map((chapter) => ({
                  label: `${chapter.topic}`,
                  path: `/student/${className}/course/${selectedCourseId}/chapter/${chapter.number}`,
                })) || []
              : [
                  {
                    label: "Chưa đến ngày truy cập",
                    path: `/student/${className}/course/${selectedCourseId}/not-start`,
                  },
                ],
          },
          { type: "link", label: "Bài kiểm tra", path: `/student/${className}/${selectedClassId}/quiz`, icon: "mdi:test-tube" },
          { type: "link", label: "Bài tập nộp", path: `/student/${className}/${selectedClassId}/assignment`, icon: "mdi:clipboard-text" },
          ...(showScoreOfCourse
            ? [
                { type: "link", label: "Điểm số", path: `/student/${className}/${selectedClassId}/course/${selectedCourseId}/score`, icon: "mdi:clipboard-text" },
              ]
            : []),
          { type: "link", label: "Tình trạng điểm danh", path: `/student/${className}/${selectedClassId}/attendance`, icon: "mdi:clipboard-text" },
          ...(showRefundRequest ? [{
            type: "custom",
            label: "Yêu cầu hoàn tiền",
            icon: "mdi:cash-refund",
            onClick: handleRefundRequest 
          }] : [])
        ];

      case 'CHAPTER_ROUTE':
        return [
          { type: "section", label: className, icon: "ti ti-dots" },
          ...(chapterLoading ? [
            { type: "loading", label: "Đang tải chương..." }
          ] : materialClass?.chapters?.map((chapter) => ({
            type: "submenu",
            label: chapter.topic,
            icon: "mdi:book-open-variant",
            subItems: chapter.chapterMaterials?.map((material) => ({
              label: material.title,
              path: material.urlVideo
                ? `/student/${className}/course/${selectedCourseId}/chapter/${chapter.number}/material/${material.number}/video`
                : `/student/${className}/course/${selectedCourseId}/chapter/${chapter.number}/material/${material.number}/reading`,
            })) || [],
          })) || []),
        ];

      default:
        return [];
    }
  };

  const sidebarItems = getSidebarItems();

  useEffect(() => {
    const initialOpenSubmenus = {};

    if (isChapterRoute) {
      const currentChapterNumber = parseInt(number, 10);

      materialClass?.chapters?.forEach((chapter) => {
        if (chapter.number === currentChapterNumber) {
          initialOpenSubmenus[chapter.number] = true;
        } else {
          initialOpenSubmenus[chapter.number] = false;
        }
      });

    } else if (isClassRoute && !isChapterRoute) {
      sidebarItems.forEach((item, index) => {
        if (item.type === "submenu") {
          initialOpenSubmenus[index] = true;
        }
      });
    }

    setOpenSubmenus(initialOpenSubmenus);
  }, [materialClass, number, materialNumber]);

  const toggleSubmenu = (index) => {
    setOpenSubmenus((prevOpenSubmenus) => ({
      ...prevOpenSubmenus,
      [index]: !prevOpenSubmenus[index],
    }));
  };

  const renderSidebarItem = (item, index) => {
    if (item.type === "loading") {
      return (
        <li key={index} className="sidebar-item">
          <div className="sidebar-link">
            <Spin size="small" />
            <span className="hide-menu ml-2">{item.label}</span>
          </div>
        </li>
      );
    }

    if (item.type === "section") {
      return (
        <li key={index} className="nav-small-cap">
          <i className={`${item.icon} nav-small-cap-icon fs-6`} />
          <span className="hide-menu">{item.label}</span>
        </li>
      );
    }

    if (item.type === "submenu") {
      return (
        <li key={index} className="sidebar-item">
          <div
            className="sidebar-link"
            onClick={() => toggleSubmenu(index)}
            aria-expanded={openSubmenus[index]}
          >
            {!isChapterRoute && (
              <span>
                <iconify-icon icon={item.icon} className="fs-6" />
              </span>
            )}
            <span
              className="hide-menu"
              style={{
                whiteSpace: "normal",
                wordWrap: "break-word",
                lineHeight: "1.4",
                fontSize: isChapterRoute ? '14px' : ''
              }}
            >
              {item.label}
            </span>
          </div>
          {openSubmenus[index] && (
            <ul className="submenu">
              {item.subItems?.map((subItem, subIndex) => (
                <li key={subIndex}>
                  <NavLink
                    className="sidebar-link fs-2"
                    to={subItem.path}
                    style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      padding: "8px 15px",
                      lineHeight: "1.4",
                    }}
                  >
                    {subItem.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    }

    if (item.type === "custom") {
      return (
        <li key={index} className="sidebar-item">
          <div
            className="sidebar-link"
            onClick={item.onClick}
            style={{ cursor: 'pointer' }}
          >
            <span>
              <iconify-icon icon={item.icon} className="fs-6" />
            </span>
            <span className="hide-menu">{item.label}</span>
          </div>
        </li>
      );
    }

    return (
      <li key={index} className="sidebar-item">
        <NavLink
          className="sidebar-link"
          to={item.path}
          aria-expanded="false"
        >
          <span>
            <iconify-icon icon={item.icon} className="fs-6" />
          </span>
          <span className="hide-menu">{item.label}</span>
        </NavLink>
      </li>
    );
  };

  return (
    <aside className="left-sidebar">
      <div>
        <div className="brand-logo d-flex align-items-center justify-content-between">
          <NavLink to="/student" className="text-nowrap logo-img">
            <img src="/assets/images/logos/FutureTechLogo.png" alt="logo" />
          </NavLink>
          <div
            className="close-btn d-xl-none d-block sidebartoggler cursor-pointer"
            id="sidebarCollapse"
            onClick={onSidebarToggle}
          >
            <i className="ti ti-x fs-8" />
          </div>
        </div>
        <nav className="sidebar-nav scroll-sidebar" data-simplebar>
          <ul id="sidebarnav">
            {sidebarItems.map((item, index) => renderSidebarItem(item, index))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

