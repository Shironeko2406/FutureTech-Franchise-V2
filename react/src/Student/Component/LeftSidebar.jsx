import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { GetClassMaterialOfUserLoginActionAsync, GetClassOfUserLoginActionAsync } from "../../Redux/ReducerAPI/UserReducer";
import { useLoading } from "../../Utils/LoadingContext";

const LeftSidebar = ({ onSidebarToggle }) => {
  const dispatch = useDispatch();
  const { classOfUserLogin, materialClass } = useSelector((state) => state.UserReducer);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const {setLoading} = useLoading()
  const { className, courseId } = useParams();
  const location = useLocation();
  const selectedClassId = classOfUserLogin?.find((c) => c.className === className)?.classId;
  const selectedCourseId = classOfUserLogin?.find((c) => c.className === className)?.courseId;
  const isStudentRoute = location.pathname.startsWith('/student');
  const isClassRoute = location.pathname.includes('/student/') && className;

  useEffect(() => {
    dispatch(GetClassOfUserLoginActionAsync())
  }, [])

  useEffect(() => {
    const currentCourseId = courseId || selectedCourseId;
  
    if (currentCourseId) {
      dispatch(GetClassMaterialOfUserLoginActionAsync(currentCourseId))
    }
  }, [courseId, selectedCourseId]);

  const getSidebarItems = () => {
    if (isStudentRoute && !isClassRoute) {
      return [
        { type: "section", label: "Lịch học", icon: "ti ti-dots" },
        { type: 'link', label: 'Lịch học', path: '/student', icon: 'mdi:clock' },
        { type: "section", label: "Khóa học", icon: "ti ti-dots" },
        ...classOfUserLogin?.map((classItem) => ({
          type: "link",
          label: classItem.className,
          path: `/student/${classItem.className}/course/${classItem.courseId}/chapter/1`,
          icon: "mdi:school",
        })),
      ];
    } else if (isClassRoute) {
      return [
        { type: "section", label: className, icon: "ti ti-dots" },
        {
          type: "submenu",
          label: "Tài nguyên lớp học",
          icon: "mdi:book-open-variant",
          subItems: materialClass?.chapters?.map((chapter) => ({
            label: `Chương số ${chapter.number}`,
            path: `/student/${className}/course/${selectedCourseId}/chapter/${chapter.number}`,
          })),
        },
        { type: "link", label: "Bài kiểm tra", path: `/student/${className}/${selectedClassId}/quiz`, icon: "mdi:test-tube" },
        { type: "link", label: "Bài tập nộp", path: `/student/${className}/${selectedClassId}/assignment`, icon: "mdi:clipboard-text" },
      ];
    }
    return [];
  };

  const sidebarItems = getSidebarItems();

  // New useEffect to set initial state of openSubmenus
  useEffect(() => {
    const initialOpenSubmenus = {};
    sidebarItems.forEach((item, index) => {
      if (item.type === "submenu") {
        initialOpenSubmenus[index] = true; // Set to true to open by default
      }
    });
    setOpenSubmenus(initialOpenSubmenus);
  }, [isClassRoute, materialClass]);

  const toggleSubmenu = (index) => {
    setOpenSubmenus((prevOpenSubmenus) => ({
      ...prevOpenSubmenus,
      [index]: !prevOpenSubmenus[index],
    }));
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
            {sidebarItems.map((item, index) =>
              item.type === "section" ? (
                <li key={index} className="nav-small-cap">
                  <i className={`${item.icon} nav-small-cap-icon fs-6`} />
                  <span className="hide-menu">{item.label}</span>
                </li>
              ) : item.type === "submenu" ? (
                <li key={index} className="sidebar-item">
                  <div
                    className="sidebar-link"
                    onClick={() => toggleSubmenu(index)}
                    aria-expanded={openSubmenus[index]}
                  >
                    <span>
                      <iconify-icon icon={item.icon} className="fs-6" />
                    </span>
                    <span className="hide-menu">{item.label}</span>
                  </div>
                  {openSubmenus[index] && (
                    <ul className="submenu">
                      {item.subItems?.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <NavLink className="sidebar-link" to={subItem.path}>
                            {subItem.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
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
              )
            )}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default LeftSidebar;






// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
// import { GetClassMaterialOfUserLoginActionAsync, GetClassOfUserLoginActionAsync } from "../../Redux/ReducerAPI/UserReducer";
// import { useLoading } from "../../Utils/LoadingContext";

// const LeftSidebar = ({ onSidebarToggle }) => {
//   const dispatch = useDispatch();
//   const { classOfUserLogin, materialClass } = useSelector((state) => state.UserReducer);
//   const [openSubmenus, setOpenSubmenus] = useState({});
//   const {setLoading} = useLoading()
//   const { className, courseId } = useParams();
//   const location = useLocation();
//   const selectedClassId = classOfUserLogin?.find((c) => c.className === className)?.classId;
//   const selectedCourseId = classOfUserLogin?.find((c) => c.className === className)?.courseId;
//   const isStudentRoute = location.pathname.startsWith('/student');
//   const isClassRoute = location.pathname.includes('/student/') && className;

//   useEffect(()=>{
//     dispatch(GetClassOfUserLoginActionAsync())
//   },[])

//   useEffect(() => {
//     const currentCourseId = courseId || selectedCourseId;
  
//     if (currentCourseId) {
//       setLoading(true);
//       dispatch(GetClassMaterialOfUserLoginActionAsync(currentCourseId)).finally(() => setLoading(false));
//     }
//   }, [courseId, selectedCourseId]);


//   const getSidebarItems = () => {
//     if (isStudentRoute && !isClassRoute) {
//       return [
//         { type: "section", label: "Lịch học", icon: "ti ti-dots" },
//         { type: 'link', label: 'Lịch học', path: '/student', icon: 'mdi:clock' },
//         { type: "section", label: "Khóa học", icon: "ti ti-dots" },
//         ...classOfUserLogin?.map((classItem) => ({
//           type: "link",
//           label: classItem.className,
//           path: `/student/${classItem.className}/course/${classItem.courseId}/chapter/1`,
//           icon: "mdi:school",
//         })),
//       ];
//     } else if (isClassRoute) {
//       return [
//         { type: "section", label: className, icon: "ti ti-dots" },
//         {
//           type: "submenu",
//           label: "Tài nguyên lớp học",
//           icon: "mdi:book-open-variant",
//           subItems: materialClass?.chapters?.map((chapter) => ({
//             label: `Chương số ${chapter.number}`,
//             path: `/student/${className}/course/${selectedCourseId}/chapter/${chapter.number}`,
//           })),
//         },
//         { type: "link", label: "Bài kiểm tra", path: `/student/${className}/${selectedClassId}/quiz`, icon: "mdi:test-tube" },
//         { type: "link", label: "Bài tập nộp", path: `/student/${className}/${selectedClassId}/assignment`, icon: "mdi:clipboard-text" },
//       ];
//     }
//     return [];
//   };

//   const sidebarItems = getSidebarItems();

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
//                     <span>
//                       <iconify-icon icon={item.icon} className="fs-6" />
//                     </span>
//                     <span className="hide-menu">{item.label}</span>
//                   </div>
//                   {openSubmenus[index] && (
//                     <ul className="submenu">
//                       {item.subItems.map((subItem, subIndex) => (
//                         <li key={subIndex}>
//                           <NavLink className="sidebar-link" to={subItem.path}>
//                             {subItem.label}
//                           </NavLink>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
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
