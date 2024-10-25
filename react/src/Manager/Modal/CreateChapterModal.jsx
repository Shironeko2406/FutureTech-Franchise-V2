import {
  Button,
  Drawer,
  Card,
  Form,
  Input,
  Typography,
  Upload,
  message,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { imageDB } from "../../Firebasse/Config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CreateChapterActionAsync } from "../../Redux/ReducerAPI/CourseReducer";


const chapter = [
  {
    id: "8fef0d34-8b03-42ad-88d1-08dcf446e080",
    number: 1,
    topic: "Cú pháp C++",
    description: "Làm quen cú pháp C++",
    courseId: "1b182028-e25d-43b0-ba63-08dcf207c014",
    chapterMaterials: [
      {
        id: "ac240d5d-97c0-4f65-84a5-08dcf446e082",
        url: "https://firebasestorage.googleapis.com/v0/b/imageupdatedb.appspot.com/o/images%2FJava-Beginer.png?alt=media&token=b733bcb9-456f-42cf-bf7e-6ac88d72054a",
        description: "des 1",
        chapterId: "8fef0d34-8b03-42ad-88d1-08dcf446e080",
      },
      {
        id: "ef2c6d11-3f71-4359-84a6-08dcf446e082",
        url: "https://firebasestorage.googleapis.com/v0/b/imageupdatedb.appspot.com/o/images%2FJava-Beginer.png?alt=media&token=b733bcb9-456f-42cf-bf7e-6ac88d72054a",
        description: "des 2",
        chapterId: "8fef0d34-8b03-42ad-88d1-08dcf446e080",
      },
    ],
  },
  {
    id: "8bfd73c5-2165-453a-88d2-08dcf446e080",
    number: 2,
    topic: "Vòng lặp loop C++",
    description: "Vòng for, if elf",
    courseId: "1b182028-e25d-43b0-ba63-08dcf207c014",
    chapterMaterials: [
      {
        id: "5c1b90a4-2733-4f44-84a7-08dcf446e082",
        url: "https://firebasestorage.googleapis.com/v0/b/imageupdatedb.appspot.com/o/images%2FJava-Beginer.png?alt=media&token=b733bcb9-456f-42cf-bf7e-6ac88d72054a",
        description: "des 1",
        chapterId: "8bfd73c5-2165-453a-88d2-08dcf446e080",
      },
      {
        id: "70e50459-ec5b-4da1-84a8-08dcf446e082",
        url: "https://firebasestorage.googleapis.com/v0/b/imageupdatedb.appspot.com/o/images%2FJava-Beginer.png?alt=media&token=b733bcb9-456f-42cf-bf7e-6ac88d72054a",
        description: "des 2",
        chapterId: "8bfd73c5-2165-453a-88d2-08dcf446e080",
      },
    ],
  },
];

const CreateChapterModal = ({ isDrawerVisible, closeDrawer }) => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [fileLists, setFileLists] = useState({});

  const handleUpload = (
    file,
    onSuccess,
    onError,
    fieldIndex,
    subFieldIndex
  ) => {
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
          message.success("Upload successful!");
          onSuccess(null, file); // Notify Ant Design Upload component that upload was successful

          // Cập nhật URL ảnh vào form (chỉ cập nhật URL thay vì cả file object)
          const chapterMaterials =
            form.getFieldValue(["chapters", fieldIndex, "chapterMaterials"]) ||
            [];
          chapterMaterials[subFieldIndex] = {
            ...chapterMaterials[subFieldIndex],
            url: downloadURL, // Cập nhật chính xác URL từ Firebase Storage
          };

          form.setFieldsValue({
            chapters: [
              ...form.getFieldValue("chapters").slice(0, fieldIndex),
              {
                ...form.getFieldValue("chapters")[fieldIndex],
                chapterMaterials,
              },
              ...form.getFieldValue("chapters").slice(fieldIndex + 1),
            ],
          });
        } catch (err) {
          message.error("Failed to retrieve image URL.");
          console.error(err);
          onError(err); // Notify Ant Design Upload component of the error
        }
      }
    );
  };

  const handleRemoveImg = (fieldIndex, subFieldIndex) => {
    // Lấy giá trị hiện tại của chapterMaterials
    const chapterMaterials =
      form.getFieldValue(["chapters", fieldIndex, "chapterMaterials"]) || [];

    // Cập nhật chapterMaterials bằng cách xóa URL của tài liệu
    chapterMaterials[subFieldIndex] = {
      ...chapterMaterials[subFieldIndex],
      url: null, // Hoặc có thể xóa toàn bộ object nếu không cần giữ lại thông tin
    };

    // Cập nhật lại giá trị trong form
    form.setFieldsValue({
      chapters: [
        ...form.getFieldValue("chapters").slice(0, fieldIndex),
        {
          ...form.getFieldValue("chapters")[fieldIndex],
          chapterMaterials,
        },
        ...form.getFieldValue("chapters").slice(fieldIndex + 1),
      ],
    });

    message.success("Image removed successfully!");
  };

  const handleFileListChange = (fieldIndex, subFieldIndex, { fileList }) => {
    setFileLists((prevFileLists) => ({
      ...prevFileLists,
      [`${fieldIndex}-${subFieldIndex}`]: fileList,
    }));
  };

  const onSubmit = (value) => {
    // dispatch(CreateChapterActionAsync(value.chapters, id))
    //   .then((response) => {
    //     if (response) {
    //       closeDrawer();
    //       form.resetFields();
    //       setFileLists({});
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    console.log(value.chapter)
  };

  return (
    <Drawer
      title="Tạo chapter"
      width={720}
      onClose={closeDrawer}
      open={isDrawerVisible}
      styles={{ body: { paddingBottom: 80 } }}
      footer={
        <div style={{ textAlign: "right" }}>
          <Button onClick={closeDrawer} className="me-2">
            Hủy
          </Button>
          <Button onClick={() => form.submit()} type="primary">
            Submit
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        onFinish={onSubmit}
        name="dynamic_form_complex"
        style={{ maxWidth: 600 }}
        autoComplete="off"
        initialValues={{
          chapters: chapter,
        }}
      >
        <Form.List name="chapters">
          {(fields, { add, remove }) => (
            <div
              style={{ display: "flex", flexDirection: "column", rowGap: 16 }}
            >
              {fields.map((field) => (
                <Card
                  size="small"
                  title={`Chapter ${field.name + 1}`}
                  key={field.key}
                  extra={
                    <CloseOutlined
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  }
                >
                  <Form.Item label="Số chương" name={[field.name, "number"]}>
                    <Input type="number" />
                  </Form.Item>

                  <Form.Item label="Chủ đề" name={[field.name, "topic"]}>
                    <Input />
                  </Form.Item>

                  <Form.Item label="Mô tả" name={[field.name, "description"]}>
                    <Input.TextArea />
                  </Form.Item>

                  {/* Nested Form.List for chapter materials */}
                  <Form.Item label="Tài liệu chương">
                    <Form.List name={[field.name, "chapterMaterials"]}>
                      {(subFields, subOpt) => (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            rowGap: 16,
                          }}
                        >
                          {subFields.map((subField, index) => (
                            <Card
                              key={subField.key}
                              size="small"
                              title={`Material ${subField.name + 1}`}
                              extra={
                                <CloseOutlined
                                  onClick={() => {
                                    console.log(fileLists);
                                    subOpt.remove(subField.name);
                                    form.setFieldsValue({
                                      chapters: form
                                        .getFieldValue("chapters")
                                        .map((chapter, idx) =>
                                          idx === field.name
                                            ? {
                                                ...chapter,
                                                chapterMaterials:
                                                  chapter.chapterMaterials.map(
                                                    (material, i) => ({
                                                      ...material,
                                                      number: i + 1,
                                                    })
                                                  ),
                                              }
                                            : chapter
                                        ),
                                    });
                                  }}
                                />
                              }
                            >
                              {/* Number input */}
                              <Form.Item
                                label="Số tài liệu"
                                name={[subField.name, "number"]}
                                initialValue={index + 1}
                              >
                                <Input
                                  type="number"
                                  placeholder="Số tài liệu"
                                  disabled
                                />
                              </Form.Item>

                              {/* Description input */}
                              <Form.Item
                                label="Mô tả"
                                name={[subField.name, "description"]}
                              >
                                <Input placeholder="Mô tả tài liệu" />
                              </Form.Item>

                              {/* Upload component */}
                              <Form.Item
                                label="Tải lên tệp"
                                name={[subField.name, "url"]}
                              >
                                <Upload
                                  fileList={
                                    fileLists[
                                      `${field.name}-${subField.name}`
                                    ] || []
                                  }
                                  listType="picture"
                                  maxCount={1}
                                  onRemove={(info) =>
                                    handleRemoveImg(field.name, subField.name)
                                  }
                                  customRequest={({
                                    file,
                                    onSuccess,
                                    onError,
                                  }) =>
                                    handleUpload(
                                      file,
                                      onSuccess,
                                      onError,
                                      field.name,
                                      subField.name
                                    )
                                  }
                                  onChange={(info) =>
                                    handleFileListChange(
                                      field.name,
                                      subField.name,
                                      info
                                    )
                                  }
                                >
                                  <Button>Chọn Tệp</Button>
                                </Upload>
                              </Form.Item>
                            </Card>
                          ))}
                          <Button
                            type="dashed"
                            onClick={() => subOpt.add()}
                            block
                          >
                            + Thêm Tài liệu
                          </Button>
                        </div>
                      )}
                    </Form.List>
                  </Form.Item>
                </Card>
              ))}

              <Button type="dashed" onClick={() => add()} block>
                + Thêm Chương
              </Button>
            </div>
          )}
        </Form.List>

        <Form.Item noStyle shouldUpdate>
          {() => (
            <Typography>
              <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
            </Typography>
          )}
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default CreateChapterModal;







// import { Button, Drawer, Card, Form, Input, Space, Typography, Upload, message } from "antd";
// import { CloseOutlined } from "@ant-design/icons";
// import React, { useState } from "react";
// import { imageDB } from "../../Firebasse/Config";
// import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

// const CreateChapterModal = ({ isDrawerVisible, closeDrawer }) => {
//   const [form] = Form.useForm();
//   const [fileLists, setFileLists] = useState({});

//   const handleUpload = (file, onSuccess, onError, fieldIndex, subFieldIndex) => {
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
//           const chapterMaterials = form.getFieldValue(["chapters", fieldIndex, "chapterMaterials"]) || [];
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

//   const handleFileListChange = (fieldIndex, subFieldIndex, { fileList }) => {
//     setFileLists((prevFileLists) => ({
//       ...prevFileLists,
//       [`${fieldIndex}-${subFieldIndex}`]: fileList,
//     }));
//   };

//   const onSubmit = (value) => {
//     console.log("Form values: ", value);

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
//             <div style={{ display: "flex", flexDirection: "column", rowGap: 16 }}>
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
//                         <div style={{ display: "flex", flexDirection: "column", rowGap: 16 }}>
//                           {subFields.map((subField, index) => (
//                             <Space key={subField.key} style={{ display: "flex", alignItems: "center" }}>
//                               <Form.Item noStyle name={[subField.name, "number"]} initialValue={index + 1}>
//                                 <Input placeholder="Số tài liệu" type="number" style={{ width: 120 }} value={index + 1}/>
//                               </Form.Item>
//                               <Form.Item noStyle name={[subField.name, "description"]}>
//                                 <Input placeholder="Mô tả" style={{ flex: 1 }} />
//                               </Form.Item>
//                               <Form.Item noStyle name={[subField.name, "url"]}>
//                                 <Upload
//                                   fileList={fileLists[`${field.name}-${subField.name}`] || []}
//                                   listType="picture"
//                                   maxCount={1}
//                                   customRequest={({ file, onSuccess, onError }) =>
//                                     handleUpload(file, onSuccess, onError, field.name, subField.name)
//                                   }
//                                   onChange={(info) => handleFileListChange(field.name, subField.name, info)}
//                                 >
//                                   <Button>Chọn Tệp</Button>
//                                 </Upload>
//                               </Form.Item>
//                               <CloseOutlined
//                                 onClick={() => {
//                                     subOpt.remove(subField.name);
//                                     form.setFieldsValue({
//                                       chapters: form.getFieldValue("chapters").map((chapter, idx) =>
//                                         idx === field.name
//                                           ? {
//                                               ...chapter,
//                                               chapterMaterials: chapter.chapterMaterials.map((material, i) => ({
//                                                 ...material,
//                                                 number: i + 1,
//                                               })),
//                                             }
//                                           : chapter
//                                       ),
//                                     });
//                                   }}
//                               />
//                             </Space>
//                           ))}
//                           <Button type="dashed" onClick={() => subOpt.add()} block>
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
