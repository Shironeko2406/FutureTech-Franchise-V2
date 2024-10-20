// import { Button } from "antd";
// import React, { useEffect, useState } from "react";
// import CreateCourseModal from "../../Modal/CreateCourseModal";
// import { useDispatch } from "react-redux";
// import { GetCourseCategoryActionAsync } from "../../../Redux/ReducerAPI/CourseCategoryReducer";

// const CourseManage = () => {
//   const dispatch = useDispatch();
//   const [isDrawerVisible, setIsDrawerVisible] = useState(false);

//   useEffect(() => {
//     dispatch(GetCourseCategoryActionAsync());
//   }, []);

//   const showDrawer = () => {
//     setIsDrawerVisible(true);
//   };

//   const closeDrawer = () => {
//     setIsDrawerVisible(false);
//   };

//   return (
//     <div>
//       <h2>Course Management</h2>
//       <Button type="primary" onClick={showDrawer}>
//         Thêm Khóa
//       </Button>
//       {/* Hiển thị CreateCourseModal dưới dạng Drawer */}
//       <CreateCourseModal
//         isDrawerVisible={isDrawerVisible}
//         closeDrawer={closeDrawer}
//       />
//     </div>
//   );
// };

// export default CourseManage;

// import { Button, Pagination, Select } from "antd";
// import React, { useEffect, useState } from "react";
// import CreateCourseModal from "../../Modal/CreateCourseModal";
// import { useDispatch, useSelector } from "react-redux";
// import { GetCourseCategoryActionAsync } from "../../../Redux/ReducerAPI/CourseCategoryReducer";
// import { GetCourseActionAsync } from "../../../Redux/ReducerAPI/CourseReducer";

// const items = [
//   {
//     id: "bc1615bc-479b-43b6-162c-08dcf0fb420d",
//     name: "Lập trình C++ nâng cao",
//     description:
//       "Khóa học C++ nâng cao được thiết kế dành cho những lập trình viên đã có kiến thức cơ bản về C++ và mong muốn nâng cao kỹ năng lập trình của mình.",
//     urlImage:
//       "https://firebasestorage.googleapis.com/v0/b/imageupdatedb.appspot.com/o/images%2FC%2B%2B_Advance.png?alt=media&token=87925102-9846-4299-9d5a-ab58d5806f21",
//     numberOfLession: 60,
//     price: 2500000,
//     code: "PRF201",
//     version: 0,
//     status: "Draft",
//     courseCategoryId: "2ebe54b1-41de-42e3-4fd4-08dcf0fae5e4",
//     courseCategoryName: "Lập trình nâng cao",
//   },
// ];

// const CourseManage = () => {
//   const { course, totalPagesCount } = useSelector(
//     (state) => state.CourseReducer
//   );
//   const dispatch = useDispatch();
//   const [status, setStatus] = useState("Draft");
//   const [pageIndex, setPageIndex] = useState(1);
//   const [pageSize] = useState(1);
//   const [isDrawerVisible, setIsDrawerVisible] = useState(false);

//   useEffect(() => {
//     dispatch(GetCourseCategoryActionAsync());
//     dispatch(GetCourseActionAsync(status, pageIndex, pageSize))
//   }, [status, pageIndex]);

//   useEffect(() => {
//     // Reset the page index to 1 whenever the status changes
//     setPageIndex(1);
//   }, [status]);

//   const handleStatusChange = (value) => {
//     setStatus(value);
//   };

//   const handlePageChange = (page) => {
//     setPageIndex(page);
//   };

//   const showDrawer = () => {
//     setIsDrawerVisible(true);
//   };

//   const closeDrawer = () => {
//     setIsDrawerVisible(false);
//   };

//   return (
//     <div>
//       <div className="card">
//         <div className="card-body">
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <h5 className="card-title">Course Management</h5>
//             <Select
//               defaultValue={status}
//               style={{ width: 150 }}
//               onChange={handleStatusChange}
//             >
//               <Select.Option value="Draft">Draft</Select.Option>
//               <Select.Option value="PendingApproval">
//                 PendingApproval
//               </Select.Option>
//               {/* Add more options as needed */}
//             </Select>
//           </div>

//           <div className="table-responsive">
//             <table className="table text-nowrap align-middle mb-0">
//               <thead>
//                 <tr className="border-2 border-bottom border-primary border-0">
//                   <th scope="col" className="ps-0">
//                     No
//                   </th>
//                   <th scope="col">Course Name</th>
//                   <th scope="col" className="text-center">
//                     Code
//                   </th>
//                   <th scope="col" className="text-center">
//                     Number of Lessons
//                   </th>
//                   <th scope="col" className="text-center">
//                     Price
//                   </th>
//                   <th scope="col" className="text-center">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="table-group-divider">
//                 {course && course.length > 0 ? (
//                   course.map((course, index) => (
//                     <tr key={course.id}>
//                       <th scope="row" className="ps-0 fw-medium">
//                         <span className="table-link1 text-truncate d-block">
//                           {index + 1}
//                         </span>
//                       </th>
//                       <td>
//                         <a
//                           href="javascript:void(0)"
//                           className="link-primary text-dark fw-medium d-block"
//                         >
//                           {course.name}
//                         </a>
//                       </td>
//                       <td className="text-center fw-medium">{course.code}</td>
//                       <td className="text-center fw-medium">
//                         {course.numberOfLession}
//                       </td>
//                       <td className="text-center fw-medium">
//                         {course.price.toLocaleString()} VND
//                       </td>
//                       <td className="text-center fw-medium">
//                         <button
//                           className="btn btn-sm btn-success me-2"
//                           onClick={() => handleApproveCourse(course.id)}
//                         >
//                           Approve
//                         </button>
//                         <button className="btn btn-sm btn-danger">
//                           Reject
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8" className="text-center">
//                       No courses available.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="d-flex justify-content-end mt-3">
//             <Pagination
//               current={pageIndex}
//               pageSize={pageSize}
//               total={totalPagesCount * pageSize}
//               onChange={handlePageChange}
//               showSizeChanger={false}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseManage;

// import { Button, Pagination, Select, Table, Input } from "antd";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { GetCourseCategoryActionAsync } from "../../../Redux/ReducerAPI/CourseCategoryReducer";
// import { GetCourseActionAsync } from "../../../Redux/ReducerAPI/CourseReducer";

// const CourseManage = () => {
//   const { course, totalPagesCount } = useSelector((state) => state.CourseReducer);
//   const dispatch = useDispatch();
//   const [status, setStatus] = useState("Draft");
//   const [pageIndex, setPageIndex] = useState(1);
//   const [pageSize, setPageSize] = useState(1); // Default page size is 10
//   const [searchTerm, setSearchTerm] = useState(""); // State for search term

//   useEffect(() => {
//     dispatch(GetCourseCategoryActionAsync());
//     dispatch(GetCourseActionAsync(status, pageIndex, pageSize, searchTerm));
//   }, [status, pageIndex, pageSize, searchTerm]);

//   const handleStatusChange = (value) => {
//     setStatus(value);
//     setPageIndex(1); // Reset page to 1 when status changes
//   };

//   const handlePageChange = (page, pageSize) => {
//     setPageIndex(page);
//     setPageSize(pageSize);
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     setPageIndex(1); // Reset to page 1 when search term changes
//   };

//   const columns = [
//     {
//       title: "No",
//       dataIndex: "no",
//       key: "no",
//       render: (text, record, index) => index + 1 + (pageIndex - 1) * pageSize,
//     },
//     {
//       title: "Course Name",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Code",
//       dataIndex: "code",
//       key: "code",
//       align: "center",
//     },
//     {
//       title: "Number of Lessons",
//       dataIndex: "numberOfLession",
//       key: "numberOfLession",
//       align: "center",
//     },
//     {
//       title: "Price",
//       dataIndex: "price",
//       key: "price",
//       align: "center",
//       render: (price) => `${price.toLocaleString()} VND`,
//     },
//     {
//       title: "Action",
//       key: "action",
//       align: "center",
//       render: (text, record) => (
//         <>
//           <Button type="primary" className="me-2" onClick={() => handleApproveCourse(record.id)}>
//             Approve
//           </Button>
//           <Button type="danger" onClick={() => handleRejectCourse(record.id)}>
//             Reject
//           </Button>
//         </>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <div className="card">
//         <div className="card-body">
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <h5 className="card-title">Course Management</h5>
//             <Select
//               defaultValue={status}
//               style={{ width: 150 }}
//               onChange={handleStatusChange}
//             >
//               <Select.Option value="Draft">Draft</Select.Option>
//               <Select.Option value="PendingApproval">PendingApproval</Select.Option>
//               {/* Add more options as needed */}
//             </Select>
//           </div>

//           <Input.Search
//             placeholder="Search courses"
//             allowClear
//             enterButton
//             onSearch={handleSearch}
//             className="mb-3"
//           />

//           <Table
//             columns={columns}
//             dataSource={course}
//             rowKey={(record) => record.id}
//             pagination={{
//               current: pageIndex,
//               pageSize,
//               total: totalPagesCount * pageSize,
//               onChange: handlePageChange,
//               showSizeChanger: true,
//               pageSizeOptions: ['10', '20', '50'],
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseManage;

import { Button, Select, Table, Input } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetCourseActionAsync } from "../../../Redux/ReducerAPI/CourseReducer";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import CreateCourseModal from "../../Modal/CreateCourseModal";
import { GetCourseCategoryActionAsync } from "../../../Redux/ReducerAPI/CourseCategoryReducer";

const CourseManage = () => {
  const { course, totalPagesCount } = useSelector(
    (state) => state.CourseReducer
  );
  const dispatch = useDispatch();
  const [status, setStatus] = useState("Draft");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(7); // Default page size is 10
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [searchedText, setSearchedText] = useState(""); // Text to search in the column
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  useEffect(() => {
    dispatch(GetCourseActionAsync(searchTerm, status, pageIndex, pageSize));
    dispatch(GetCourseCategoryActionAsync());
  }, [status, pageIndex, pageSize, searchTerm]);

  const handleStatusChange = (value) => {
    setStatus(value);
    setPageIndex(1); // Reset page to 1 when status changes
  };

  const handlePageChange = (page, pageSize) => {
    setPageIndex(page);
    setPageSize(pageSize);
  };

  // Function to handle searching within the column
  const handleColumnSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchTerm(selectedKeys[0]); // Trigger API search with the entered keyword
  };

  // Function to reset the search filter
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchTerm(""); // Reset search term
  };

  const getColumnSearchProps = () => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search Course Name`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleColumnSearch(selectedKeys, confirm)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleColumnSearch(selectedKeys, confirm)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record.name.toString().toLowerCase().includes(value.toLowerCase()),
  });

  const showDrawer = () => {
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      render: (text, record, index) => index + 1 + (pageIndex - 1) * pageSize,
    },
    {
      title: "Course Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps(), // Apply search props to the column
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      align: "center",
    },
    {
      title: "Number of Lessons",
      dataIndex: "numberOfLession",
      key: "numberOfLession",
      align: "center",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (price) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <>
          <Button
            type="primary"
            className="me-2"
            onClick={() => handleApproveCourse(record.id)}
          >
            Approve
          </Button>
          <Button type="danger" onClick={() => handleRejectCourse(record.id)}>
            Reject
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title">Course Management</h5>
            <Select
              defaultValue={status}
              style={{ width: 150 }}
              onChange={handleStatusChange}
            >
              <Select.Option value="Draft">Draft</Select.Option>
              <Select.Option value="PendingApproval">
                PendingApproval
              </Select.Option>
              {/* Add more options as needed */}
            </Select>
          </div>

          <Table
            bordered
            columns={columns}
            dataSource={course}
            rowKey={(record) => record.id}
            pagination={{
              current: pageIndex,
              pageSize,
              total: totalPagesCount * pageSize,
              onChange: handlePageChange,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
            }}
          />
        </div>
      </div>
      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        size="large"
        onClick={showDrawer}
        style={{
          position: "fixed",
          bottom: 50,
          right: 30,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        }}
      />
      <CreateCourseModal
        isDrawerVisible={isDrawerVisible}
        closeDrawer={closeDrawer}
        status={status}
        pageIndex={pageIndex}
        pageSize={pageSize}
        searchTerm={searchTerm}
      />
    </div>
  );
};

export default CourseManage;
