// import {
//   Button,
//   Drawer,
//   Card,
//   Form,
//   Input,
//   Typography,
//   Upload,
//   message,
// } from "antd";
// import { CloseOutlined } from "@ant-design/icons";
// import React, { useState } from "react";
// import { imageDB } from "../../Firebasse/Config";
// import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
// import { useParams } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { CreateChapterActionAsync } from "../../Redux/ReducerAPI/CourseReducer";

// const CreateChapterModal = ({ isDrawerVisible, closeDrawer }) => {
//   const [form] = Form.useForm();
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const [fileLists, setFileLists] = useState({});

//   const handleUpload = (
//     file,
//     onSuccess,
//     onError,
//     fieldIndex,
//     subFieldIndex
//   ) => {
//     const storageRef = ref(imageDB, `images/${file.name}`); // Create reference to Firebase Storage
//     const uploadTask = uploadBytesResumable(storageRef, file);

//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {},
//       (error) => {
//         // If there's an error during upload
//         message.error("Upload failed!");
//         console.error(error);
//         onError(error); // Notify Ant Design Upload component of the error
//       },
//       async () => {
//         // If upload is successful
//         try {
//           const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//           message.success("Upload successful!");
//           onSuccess(null, file); // Notify Ant Design Upload component that upload was successful

//           // Cập nhật URL ảnh vào form (chỉ cập nhật URL thay vì cả file object)
//           const chapterMaterials =
//             form.getFieldValue(["chapters", fieldIndex, "chapterMaterials"]) ||
//             [];
//           chapterMaterials[subFieldIndex] = {
//             ...chapterMaterials[subFieldIndex],
//             url: downloadURL, // Cập nhật chính xác URL từ Firebase Storage
//           };

//           form.setFieldsValue({
//             chapters: [
//               ...form.getFieldValue("chapters").slice(0, fieldIndex),
//               {
//                 ...form.getFieldValue("chapters")[fieldIndex],
//                 chapterMaterials,
//               },
//               ...form.getFieldValue("chapters").slice(fieldIndex + 1),
//             ],
//           });
//         } catch (err) {
//           message.error("Failed to retrieve image URL.");
//           console.error(err);
//           onError(err); // Notify Ant Design Upload component of the error
//         }
//       }
//     );
//   };

//   const handleRemoveImg = (fieldIndex, subFieldIndex) => {
//     // Lấy giá trị hiện tại của chapterMaterials
//     const chapterMaterials =
//       form.getFieldValue(["chapters", fieldIndex, "chapterMaterials"]) || [];

//     // Cập nhật chapterMaterials bằng cách xóa URL của tài liệu
//     chapterMaterials[subFieldIndex] = {
//       ...chapterMaterials[subFieldIndex],
//       url: null, // Hoặc có thể xóa toàn bộ object nếu không cần giữ lại thông tin
//     };

//     // Cập nhật lại giá trị trong form
//     form.setFieldsValue({
//       chapters: [
//         ...form.getFieldValue("chapters").slice(0, fieldIndex),
//         {
//           ...form.getFieldValue("chapters")[fieldIndex],
//           chapterMaterials,
//         },
//         ...form.getFieldValue("chapters").slice(fieldIndex + 1),
//       ],
//     });

//     // Nếu cần, bạn có thể thêm logic để thông báo rằng ảnh đã bị xóa
//     message.success("Image removed successfully!");
//   };

//   const handleFileListChange = (fieldIndex, subFieldIndex, { fileList }) => {
//     setFileLists((prevFileLists) => ({
//       ...prevFileLists,
//       [`${fieldIndex}-${subFieldIndex}`]: fileList,
//     }));
//   };

//   const onSubmit = (value) => {
//     dispatch(CreateChapterActionAsync(value.chapters, id))
//       .then((response) => {
//         if (response) {
//           closeDrawer();
//           form.resetFields();
//           setFileLists({});
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   return (
//     <Drawer
//       title="Tạo chapter"
//       width={720}
//       onClose={closeDrawer}
//       open={isDrawerVisible}
//       styles={{ body: { paddingBottom: 80 } }}
//       footer={
//         <div style={{ textAlign: "right" }}>
//           <Button onClick={closeDrawer} className="me-2">
//             Hủy
//           </Button>
//           <Button onClick={() => form.submit()} type="primary">
//             Submit
//           </Button>
//         </div>
//       }
//     >
//       <Form
//         form={form}
//         onFinish={onSubmit}
//         name="dynamic_form_complex"
//         style={{ maxWidth: 600 }}
//         autoComplete="off"
//         initialValues={{
//           chapters: [{}],
//         }}
//       >
//         <Form.List name="chapters">
//           {(fields, { add, remove }) => (
//             <div
//               style={{ display: "flex", flexDirection: "column", rowGap: 16 }}
//             >
//               {fields.map((field) => (
//                 <Card
//                   size="small"
//                   title={`Chapter ${field.name + 1}`}
//                   key={field.key}
//                   extra={
//                     <CloseOutlined
//                       onClick={() => {
//                         remove(field.name);
//                       }}
//                     />
//                   }
//                 >
//                   <Form.Item label="Số chương" name={[field.name, "number"]}>
//                     <Input type="number" />
//                   </Form.Item>

//                   <Form.Item label="Chủ đề" name={[field.name, "topic"]}>
//                     <Input />
//                   </Form.Item>

//                   <Form.Item label="Mô tả" name={[field.name, "description"]}>
//                     <Input.TextArea />
//                   </Form.Item>

//                   {/* Nested Form.List for chapter materials */}
//                   <Form.Item label="Tài liệu chương">
//                     <Form.List name={[field.name, "chapterMaterials"]}>
//                       {(subFields, subOpt) => (
//                         <div
//                           style={{
//                             display: "flex",
//                             flexDirection: "column",
//                             rowGap: 16,
//                           }}
//                         >
//                           {subFields.map((subField, index) => (
//                             <Card
//                               key={subField.key}
//                               size="small"
//                               title={`Material ${subField.name + 1}`}
//                               extra={
//                                 <CloseOutlined
//                                   onClick={() => {
//                                     console.log(fileLists);
//                                     subOpt.remove(subField.name);
//                                     form.setFieldsValue({
//                                       chapters: form
//                                         .getFieldValue("chapters")
//                                         .map((chapter, idx) =>
//                                           idx === field.name
//                                             ? {
//                                                 ...chapter,
//                                                 chapterMaterials:
//                                                   chapter.chapterMaterials.map(
//                                                     (material, i) => ({
//                                                       ...material,
//                                                       number: i + 1,
//                                                     })
//                                                   ),
//                                               }
//                                             : chapter
//                                         ),
//                                     });
//                                   }}
//                                 />
//                               }
//                             >
//                               {/* Number input */}
//                               <Form.Item
//                                 label="Số tài liệu"
//                                 name={[subField.name, "number"]}
//                                 initialValue={index + 1}
//                               >
//                                 <Input
//                                   type="number"
//                                   placeholder="Số tài liệu"
//                                   disabled
//                                 />
//                               </Form.Item>

//                               {/* Description input */}
//                               <Form.Item
//                                 label="Mô tả"
//                                 name={[subField.name, "description"]}
//                               >
//                                 <Input placeholder="Mô tả tài liệu" />
//                               </Form.Item>

//                               {/* Upload component */}
//                               <Form.Item
//                                 label="Tải lên tệp"
//                                 name={[subField.name, "url"]}
//                               >
//                                 <Upload
//                                   fileList={
//                                     fileLists[
//                                       `${field.name}-${subField.name}`
//                                     ] || []
//                                   }
//                                   listType="picture"
//                                   maxCount={1}
//                                   onRemove={(info) =>
//                                     handleRemoveImg(field.name, subField.name)
//                                   }
//                                   customRequest={({
//                                     file,
//                                     onSuccess,
//                                     onError,
//                                   }) =>
//                                     handleUpload(
//                                       file,
//                                       onSuccess,
//                                       onError,
//                                       field.name,
//                                       subField.name
//                                     )
//                                   }
//                                   onChange={(info) =>
//                                     handleFileListChange(
//                                       field.name,
//                                       subField.name,
//                                       info
//                                     )
//                                   }
//                                 >
//                                   <Button>Chọn Tệp</Button>
//                                 </Upload>
//                               </Form.Item>
//                             </Card>
//                           ))}
//                           <Button
//                             type="dashed"
//                             onClick={() => subOpt.add()}
//                             block
//                           >
//                             + Thêm Tài liệu
//                           </Button>
//                         </div>
//                       )}
//                     </Form.List>
//                   </Form.Item>
//                 </Card>
//               ))}

//               <Button type="dashed" onClick={() => add()} block>
//                 + Thêm Chương
//               </Button>
//             </div>
//           )}
//         </Form.List>

//         <Form.Item noStyle shouldUpdate>
//           {() => (
//             <Typography>
//               <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
//             </Typography>
//           )}
//         </Form.Item>
//       </Form>
//     </Drawer>
//   );
// };

// export default CreateChapterModal;

import { Button, Drawer, Form, InputNumber, Input } from "antd";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CreateChapterActionAsync } from "../../Redux/ReducerAPI/ChapterReducer";
import { useLoading } from "../../Utils/LoadingContext";

const CreateChapterModal = ({ isDrawerVisible, closeDrawer }) => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const dispatch = useDispatch();
  const {setLoading} = useLoading()

  const onSubmit = (value) => {
    const chapterData = {...value, courseId: id}
    setLoading(true)
    dispatch(CreateChapterActionAsync(chapterData))
      .then((response) => {
        setLoading(false)
        if (response) {
          closeDrawer();
          form.resetFields();
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false)
      });
  };

  return (
    <Drawer
      title="Tạo chương"
      width={550}
      onClose={closeDrawer}
      open={isDrawerVisible}
      footer={
        <div style={{ textAlign: "right" }}>
          <Button onClick={closeDrawer} className="me-2" danger>
            Hủy
          </Button>
          <Button onClick={() => form.submit()} type="primary">
            Tạo
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" onFinish={onSubmit} requiredMark={false}>
        <Form.Item
          label="Số chương"
          name="number"
          rules={[{ required: true, message: "Vui lòng nhập số chapter!" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
        
        <Form.Item
          label="Chủ đề"
          name="topic"
          rules={[{ required: true, message: "Vui lòng nhập chủ đề!" }]}
        >
          <Input placeholder="Nhập chủ đề của chapter" />
        </Form.Item>
        
        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả chapter!" }]}
        >
          <Input.TextArea rows={4} placeholder="Nhập mô tả của chapter" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default CreateChapterModal;
