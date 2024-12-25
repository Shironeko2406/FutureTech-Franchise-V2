import { createSlice } from "@reduxjs/toolkit";
import { httpClient, USER_LOGIN } from "../../Utils/Interceptors";
import { message } from "antd";
import { GetAssignmentDetailByIdActionAsync, GetAssignmentsByClassIdActionAsync } from "./AssignmentReducer";
import { getDataJSONStorage, setDataJSONStorage } from "../../Utils/UtilsFunction";
import { setUserLogin } from "./AuthenticationReducer";

const initialState = {
  userData: [],
  userProfile: {},
  schedules: [],
  classOfUserLogin: [],
  userManager: [],
  taskUser: [],
  totalPagesCount: 0,
  accounts: [],
  totalItemsCount: 0,
  materialClass: [
    {
      "id": "e9178839-95bb-4cb0-419e-08dd235fe6af",
      "number": 1,
      "topic": "Chương 1: Hiểu các khái niệm về cơ sở dữ liệu và phần mềm quản lý cơ sở dữ liệu.",
      "description": "Giới thiệu các khái niệm cơ bản về cơ sở dữ liệu và phần mềm quản lý cơ sở dữ liệu (DBMS).",
      "courseId": "40484454-317a-4259-0137-08dd235fe6a6",
      "chapterMaterials": [
        {
          "id": "8cfeb4ab-12c0-46c5-c9f8-08dd235fe6b1",
          "number": 1,
          "title": "Chương 1. Các thế giới của Hệ thống Cơ sở Dữ liệu",
          "urlFile": "https://vardhaman.org/wp-content/uploads/2021/03/CP.pdf",
          "urlVideo": "https://youtu.be/iu-LBY7NXD4?si=66IpaQ2yBIRrGF1F",
          "description": "Chương 1. Các thế giới của Hệ thống Cơ sở Dữ liệu",
          "chapterId": "e9178839-95bb-4cb0-419e-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "7556a089-ff08-407b-c9f9-08dd235fe6b1",
          "number": 2,
          "title": "1.3 Tổng quan về Nghiên cứu Hệ thống Cơ sở Dữ liệu",
          "urlFile": "https://www.cimat.mx/ciencia_para_jovenes/bachillerato/libros/%5BKernighan-Ritchie%5DThe_C_Programming_Language.pdf",
          "urlVideo": "https://firebasestorage.googleapis.com/v0/b/imageupdatedb.appspot.com/o/video-test2.mp4?alt=media&token=a6b2597c-1136-4472-82ba-bf217383f266",
          "description": "1.3 Tổng quan về Nghiên cứu Hệ thống Cơ sở Dữ liệu",
          "chapterId": "e9178839-95bb-4cb0-419e-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "e79f763a-3786-48f9-a421-08dd2422407b",
          "number": 3,
          "title": "Thêm chương",
          "urlFile": "https://firebasestorage.googleapis.com/v0/b/imageupdatedb.appspot.com/o/pdfs%2FReport.pdf?alt=media&token=ae275209-a050-4566-b882-bbe46b287d5b",
          "urlVideo": "https://firebasestorage.googleapis.com/v0/b/imageupdatedb.appspot.com/o/videos%2Fvideo-test.mp4?alt=media&token=83c7d8c2-0b85-4b3d-b2ff-16860668b77d",
          "description": "ok",
          "chapterId": "e9178839-95bb-4cb0-419e-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "219cd6d5-977d-4dd0-a422-08dd2422407b",
          "number": 4,
          "title": "Thêm chương 4",
          "urlFile": "https://firebasestorage.googleapis.com/v0/b/imageupdatedb.appspot.com/o/pdfs%2FReport.pdf?alt=media&token=d66d7754-2fa5-44de-b229-15de5e170b4c",
          "urlVideo": null,
          "description": "ok",
          "chapterId": "e9178839-95bb-4cb0-419e-08dd235fe6af",
          "userChapterMaterials": null
        }
      ]
    },
    {
      "id": "35b20d96-104f-4d1c-419f-08dd235fe6af",
      "number": 2,
      "topic": "Chương 2: Hiểu mô hình quan hệ của dữ liệu và ngôn ngữ truy vấn đại số.",
      "description": "Trình bày về mô hình quan hệ của dữ liệu và cách sử dụng ngôn ngữ truy vấn đại số (Algebraic Query Language).",
      "courseId": "40484454-317a-4259-0137-08dd235fe6a6",
      "chapterMaterials": [
        {
          "id": "9cb71f52-ee5d-4ab4-c9fa-08dd235fe6b1",
          "number": 1,
          "title": "Chương 2. Mô hình Quan hệ của Dữ liệu",
          "urlFile": "",
          "urlVideo": "",
          "description": "Chương 1. Các thế giới của Hệ thống Cơ sở Dữ liệu",
          "chapterId": "35b20d96-104f-4d1c-419f-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "cb7aab80-d67d-42ca-c9fb-08dd235fe6b1",
          "number": 2,
          "title": "2.2 Các khái niệm cơ bản về Mô hình Quan hệ",
          "urlFile": "",
          "urlVideo": "",
          "description": "1.3 Tổng quan về Nghiên cứu Hệ thống Cơ sở Dữ liệu",
          "chapterId": "35b20d96-104f-4d1c-419f-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "7f86f760-1ec6-4b5e-c9fc-08dd235fe6b1",
          "number": 3,
          "title": "2.4 Ngôn ngữ Truy vấn Đại số",
          "urlFile": "",
          "urlVideo": "",
          "description": "Học cách sử dụng ngôn ngữ truy vấn đại số để thao tác với dữ liệu trong cơ sở dữ liệu quan hệ, bao gồm các phép toán như chọn, chiếu, và kết hợp.",
          "chapterId": "35b20d96-104f-4d1c-419f-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "12b2ae47-d5a9-4e73-c9fd-08dd235fe6b1",
          "number": 4,
          "title": "2.4 Ngôn ngữ Truy vấn Đại số (tiếp theo)",
          "urlFile": "",
          "urlVideo": "",
          "description": "Tiếp tục nghiên cứu về đại số quan hệ, bao gồm các phép toán phức tạp hơn như hợp, giao, và hiệu.",
          "chapterId": "35b20d96-104f-4d1c-419f-08dd235fe6af",
          "userChapterMaterials": null
        }
      ]
    },
    {
      "id": "12cf112c-693f-4aef-41a0-08dd235fe6af",
      "number": 3,
      "topic": "Chương 3: Hiểu về chuẩn hóa dữ liệu và áp dụng các kỹ thuật chuẩn hóa trong thiết kế cơ sở dữ liệu.",
      "description": "Tìm hiểu các nguyên lý chuẩn hóa dữ liệu và cách áp dụng chuẩn hóa trong thiết kế cơ sở dữ liệu.",
      "courseId": "40484454-317a-4259-0137-08dd235fe6a6",
      "chapterMaterials": [
        {
          "id": "fe16758a-d5d6-403b-c9fe-08dd235fe6b1",
          "number": 1,
          "title": "Chương 3. Lý thuyết thiết kế cho Cơ sở Dữ liệu Quan hệ",
          "urlFile": "",
          "urlVideo": "",
          "description": "Tìm hiểu về các nguyên lý thiết kế cơ sở dữ liệu quan hệ, bao gồm phân tích và chuẩn hóa dữ liệu, thiết kế sơ đồ cơ sở dữ liệu.",
          "chapterId": "12cf112c-693f-4aef-41a0-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "a12c28cc-b3e7-4f79-c9ff-08dd235fe6b1",
          "number": 2,
          "title": "3.2 Các quy tắc về Phụ thuộc Chức năng",
          "urlFile": "",
          "urlVideo": "",
          "description": "Khám phá các loại phụ thuộc chức năng và cách chúng ảnh hưởng đến thiết kế cơ sở dữ liệu, bao gồm các quy tắc như phụ thuộc đầy đủ, một phần, và chuyển tiếp.",
          "chapterId": "12cf112c-693f-4aef-41a0-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "e42b654f-b4c0-4107-ca00-08dd235fe6b1",
          "number": 3,
          "title": "3.3 Thiết kế Sơ đồ Cơ sở Dữ liệu Quan hệ",
          "urlFile": "",
          "urlVideo": "",
          "description": "Học cách thiết kế sơ đồ cơ sở dữ liệu quan hệ, bao gồm việc xác định các thực thể, mối quan hệ và các thuộc tính cần thiết.",
          "chapterId": "12cf112c-693f-4aef-41a0-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "d1d190c6-43fd-4373-ca01-08dd235fe6b1",
          "number": 4,
          "title": "3.3 Thiết kế Sơ đồ Cơ sở Dữ liệu Quan hệ (tiếp theo)",
          "urlFile": "",
          "urlVideo": "",
          "description": "Tiếp tục nghiên cứu về thiết kế sơ đồ cơ sở dữ liệu, tập trung vào cách tối ưu hóa và chuẩn hóa cơ sở dữ liệu.",
          "chapterId": "12cf112c-693f-4aef-41a0-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "465eea10-3f01-4617-ca02-08dd235fe6b1",
          "number": 5,
          "title": "3.5 Các dạng chuẩn (1NF, 2NF)",
          "urlFile": "",
          "urlVideo": "",
          "description": "Giới thiệu về các dạng chuẩn cơ sở dữ liệu (1NF, 2NF), mục đích của việc chuẩn hóa và cách áp dụng chúng trong thiết kế cơ sở dữ liệu.",
          "chapterId": "12cf112c-693f-4aef-41a0-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "35c8d247-d2ba-4af7-ca03-08dd235fe6b1",
          "number": 6,
          "title": "3.5 Các dạng chuẩn (tiếp theo 3NF, BCNF)",
          "urlFile": "",
          "urlVideo": "",
          "description": "Tiếp tục nghiên cứu về các dạng chuẩn cao hơn như 3NF và BCNF, và cách chúng giúp loại bỏ sự dư thừa trong cơ sở dữ liệu.",
          "chapterId": "12cf112c-693f-4aef-41a0-08dd235fe6af",
          "userChapterMaterials": null
        }
      ]
    },
    {
      "id": "651805f3-b4e0-4d82-41a1-08dd235fe6af",
      "number": 4,
      "topic": "Chương 4:  Có khả năng mô hình hóa yêu cầu dữ liệu của ứng dụng sử dụng sơ đồ ER và thiết kế cơ sở dữ liệu từ mô hình khái niệm.",
      "description": "Hướng dẫn cách mô hình hóa dữ liệu ứng dụng và thiết kế cơ sở dữ liệu dựa trên sơ đồ ER (Entity-Relationship Diagram).",
      "courseId": "40484454-317a-4259-0137-08dd235fe6a6",
      "chapterMaterials": [
        {
          "id": "39cb7da3-80bf-4ef0-ca04-08dd235fe6b1",
          "number": 1,
          "title": "Chương 4. Các Mô hình Cơ sở Dữ liệu Cấp Cao",
          "urlFile": "",
          "urlVideo": "",
          "description": "Khám phá các mô hình cơ sở dữ liệu cấp cao như mô hình thực thể - mối quan hệ (E/R), mô hình mạng và mô hình đối tượng.",
          "chapterId": "651805f3-b4e0-4d82-41a1-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "f72b92fd-4d97-4744-ca05-08dd235fe6b1",
          "number": 2,
          "title": "4.2 Nguyên tắc Thiết kế, 4.3 Ràng buộc trong Mô hình E/R",
          "urlFile": "",
          "urlVideo": "",
          "description": "Nghiên cứu các nguyên tắc thiết kế cơ sở dữ liệu trong mô hình E/R, bao gồm các khái niệm về thực thể, thuộc tính và mối quan hệ.",
          "chapterId": "651805f3-b4e0-4d82-41a1-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "cce6a849-a3e4-4725-ca06-08dd235fe6b1",
          "number": 3,
          "title": "4.4 Các Tập Thực thể Yếu, 4.5 Từ Biểu đồ E/R đến Mô hình Quan hệ",
          "urlFile": "",
          "urlVideo": "",
          "description": "Tìm hiểu về các tập thực thể yếu và cách chuyển đổi biểu đồ E/R thành mô hình quan hệ.",
          "chapterId": "651805f3-b4e0-4d82-41a1-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "dc24402d-6dd0-43ee-ca07-08dd235fe6b1",
          "number": 4,
          "title": "4.6 Chuyển đổi Cấu trúc Lớp con thành Các Mối quan hệ",
          "urlFile": "",
          "urlVideo": "",
          "description": "Học cách chuyển đổi các cấu trúc lớp con trong mô hình E/R thành các mối quan hệ trong cơ sở dữ liệu quan hệ.",
          "chapterId": "651805f3-b4e0-4d82-41a1-08dd235fe6af",
          "userChapterMaterials": null
        }
      ]
    },
    {
      "id": "7b1124e1-00cb-4d15-41a2-08dd235fe6af",
      "number": 5,
      "topic": "Chương 5: Thành thạo ngôn ngữ truy vấn cấu trúc, bao gồm DDL và DML.",
      "description": "Nắm vững cách sử dụng ngôn ngữ truy vấn SQL bao gồm Data Definition Language (DDL) và Data Manipulation Language (DML).",
      "courseId": "40484454-317a-4259-0137-08dd235fe6a6",
      "chapterMaterials": [
        {
          "id": "ce1b4903-9f27-4874-ca08-08dd235fe6b1",
          "number": 1,
          "title": "Chương 5. Ngôn ngữ Cơ sở Dữ liệu SQL",
          "urlFile": "",
          "urlVideo": "",
          "description": "Tìm hiểu về SQL, ngôn ngữ truy vấn cơ sở dữ liệu phổ biến nhất, bao gồm các lệnh DDL và DML cơ bản.",
          "chapterId": "7b1124e1-00cb-4d15-41a2-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "1d92f00e-565c-4b3c-ca09-08dd235fe6b1",
          "number": 2,
          "title": "DDL (tiếp theo)",
          "urlFile": "",
          "urlVideo": "",
          "description": "Tiếp tục nghiên cứu về DDL (Data Definition Language) trong SQL, bao gồm cách tạo và quản lý bảng, ràng buộc và chỉ mục.",
          "chapterId": "7b1124e1-00cb-4d15-41a2-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "3880a604-06b2-45d7-ca0a-08dd235fe6b1",
          "number": 3,
          "title": "5.2 Thực thi các ràng buộc trên thuộc tính với MS SQL Server",
          "urlFile": "",
          "urlVideo": "",
          "description": "Học cách thực thi các ràng buộc trong SQL, ví dụ như ràng buộc khóa chính, khóa ngoại và các ràng buộc kiểm tra với SQL Server.",
          "chapterId": "7b1124e1-00cb-4d15-41a2-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "b7229ec9-65b2-4096-ca0b-08dd235fe6b1",
          "number": 4,
          "title": "DDL (tiếp theo)",
          "urlFile": "",
          "urlVideo": "",
          "description": "Tiếp tục nghiên cứu và thực hành các lệnh DDL để tạo và quản lý cấu trúc cơ sở dữ liệu.",
          "chapterId": "7b1124e1-00cb-4d15-41a2-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "bd9895dd-83a6-4b5d-ca0c-08dd235fe6b1",
          "number": 5,
          "title": "5.3 DML Giới thiệu và Các Truy vấn SQL cơ bản",
          "urlFile": "",
          "urlVideo": "",
          "description": "Tìm hiểu về DML (Data Manipulation Language), các truy vấn SQL cơ bản như SELECT, INSERT, UPDATE và DELETE.",
          "chapterId": "7b1124e1-00cb-4d15-41a2-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "69757acd-4ccf-4b93-ca0d-08dd235fe6b1",
          "number": 6,
          "title": "DML (tiếp theo)",
          "urlFile": "",
          "urlVideo": "",
          "description": "Tiếp tục nghiên cứu và thực hành các câu lệnh DML phức tạp hơn để thao tác với dữ liệu trong cơ sở dữ liệu.",
          "chapterId": "7b1124e1-00cb-4d15-41a2-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "af66e7aa-960c-4d0e-ca0e-08dd235fe6b1",
          "number": 7,
          "title": "5.4 Truy vấn trên nhiều mối quan hệ",
          "urlFile": "",
          "urlVideo": "",
          "description": "Tìm hiểu cách sử dụng SQL để truy vấn dữ liệu từ nhiều bảng cùng lúc, thông qua các phép JOIN và UNION.",
          "chapterId": "7b1124e1-00cb-4d15-41a2-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "0efe337a-4bfb-435f-ca0f-08dd235fe6b1",
          "number": 8,
          "title": "5.4 Truy vấn trên nhiều mối quan hệ (tiếp theo)",
          "urlFile": "",
          "urlVideo": "",
          "description": "Tiếp tục thực hành các truy vấn phức tạp hơn với nhiều bảng dữ liệu, bao gồm các phép toán kết hợp dữ liệu.",
          "chapterId": "7b1124e1-00cb-4d15-41a2-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "6c57b435-4ed4-45dd-ca10-08dd235fe6b1",
          "number": 9,
          "title": "5.5 Truy vấn Lồng trong SQL",
          "urlFile": "",
          "urlVideo": "",
          "description": "Học cách sử dụng truy vấn lồng (subqueries) trong SQL để xử lý các yêu cầu phức tạp.",
          "chapterId": "7b1124e1-00cb-4d15-41a2-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "08a7a979-d60c-4e00-ca11-08dd235fe6b1",
          "number": 10,
          "title": "5.5 Truy vấn Lồng trong SQL (tiếp theo)",
          "urlFile": "",
          "urlVideo": "",
          "description": "Tiếp tục thực hành các truy vấn lồng, bao gồm các ví dụ thực tế và bài tập.",
          "chapterId": "7b1124e1-00cb-4d15-41a2-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "0f31eeea-b315-460b-ca12-08dd235fe6b1",
          "number": 11,
          "title": "5.6 Truy vấn Tổng hợp trong SQL",
          "urlFile": "",
          "urlVideo": "",
          "description": "Tìm hiểu về các truy vấn tổng hợp trong SQL, sử dụng các hàm như COUNT, AVG, SUM, MIN và MAX để xử lý dữ liệu.",
          "chapterId": "7b1124e1-00cb-4d15-41a2-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "c5eb9f7a-dc74-4d05-ca13-08dd235fe6b1",
          "number": 12,
          "title": "5.6 Truy vấn Tổng hợp trong SQL (tiếp theo)",
          "urlFile": "",
          "urlVideo": "",
          "description": "Thực hành các câu lệnh truy vấn tổng hợp phức tạp hơn trong SQL.",
          "chapterId": "7b1124e1-00cb-4d15-41a2-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "3a764e8b-59cc-496e-ca14-08dd235fe6b1",
          "number": 13,
          "title": "5.7 Chỉnh sửa Cơ sở Dữ liệu (INSERT, UPDATE)",
          "urlFile": "",
          "urlVideo": "",
          "description": "Học cách sử dụng các lệnh SQL để thêm, sửa và xóa dữ liệu trong cơ sở dữ liệu.",
          "chapterId": "7b1124e1-00cb-4d15-41a2-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "79360f6c-8c50-4ec8-ca15-08dd235fe6b1",
          "number": 14,
          "title": "5.7 Chỉnh sửa Cơ sở Dữ liệu (tiếp theo DELETE)",
          "urlFile": "",
          "urlVideo": "",
          "description": "Tiếp tục thực hành các câu lệnh xóa dữ liệu và quản lý các thay đổi trong cơ sở dữ liệu.",
          "chapterId": "7b1124e1-00cb-4d15-41a2-08dd235fe6af",
          "userChapterMaterials": null
        }
      ]
    },
    {
      "id": "6e265809-9bdb-451c-41a3-08dd235fe6af",
      "number": 6,
      "topic": "Chương 6: Hiểu các khái niệm PL/SQL và thao tác với View, Cursors, Stored Procedures, Functions, Database Triggers.",
      "description": "Hiểu các khái niệm trong PL/SQL và sử dụng các tính năng như View, Cursors, Stored Procedures, Functions, và Triggers.",
      "courseId": "40484454-317a-4259-0137-08dd235fe6a6",
      "chapterMaterials": [
        {
          "id": "4cacb98f-f196-4ebe-ca16-08dd235fe6b1",
          "number": 1,
          "title": "Chương 6. Ràng buộc và Lập trình T-SQL",
          "urlFile": "",
          "urlVideo": "",
          "description": "Tìm hiểu về SQL, ngôn ngữ truy vấn cơ sở dữ liệu phổ biến nhất, bao gồm các lệnh DDL và DML cơ bản.",
          "chapterId": "6e265809-9bdb-451c-41a3-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "1e1efd66-404c-4ff0-ca17-08dd235fe6b1",
          "number": 2,
          "title": "6.2 Ràng buộc với trigger",
          "urlFile": "",
          "urlVideo": "",
          "description": "Tiếp tục nghiên cứu về DDL (Data Definition Language) trong SQL, bao gồm cách tạo và quản lý bảng, ràng buộc và chỉ mục.",
          "chapterId": "6e265809-9bdb-451c-41a3-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "2315cfce-ffce-46a9-ca18-08dd235fe6b1",
          "number": 3,
          "title": "6.3 View, Function",
          "urlFile": "",
          "urlVideo": "",
          "description": "Học cách thực thi các ràng buộc trong SQL, ví dụ như ràng buộc khóa chính, khóa ngoại và các ràng buộc kiểm tra với SQL Server.",
          "chapterId": "6e265809-9bdb-451c-41a3-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "e1f4c0d9-2dec-4ad6-ca19-08dd235fe6b1",
          "number": 4,
          "title": "6.3 View, Function (tiếp theo)",
          "urlFile": "",
          "urlVideo": "",
          "description": "Tiếp tục nghiên cứu và thực hành các lệnh DDL để tạo và quản lý cấu trúc cơ sở dữ liệu.",
          "chapterId": "6e265809-9bdb-451c-41a3-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "f656299e-20b4-481e-ca1a-08dd235fe6b1",
          "number": 5,
          "title": "6.4 Con trỏ (Cursors)",
          "urlFile": "",
          "urlVideo": "",
          "description": "Tìm hiểu về DML (Data Manipulation Language), các truy vấn SQL cơ bản như SELECT, INSERT, UPDATE và DELETE.",
          "chapterId": "6e265809-9bdb-451c-41a3-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "05355c70-bf32-416a-ca1b-08dd235fe6b1",
          "number": 6,
          "title": "6.5 Thực thi thủ tục lưu trữ với MS SQL Server",
          "urlFile": "",
          "urlVideo": "",
          "description": "Tiếp tục nghiên cứu và thực hành các câu lệnh DML phức tạp hơn để thao tác với dữ liệu trong cơ sở dữ liệu.",
          "chapterId": "6e265809-9bdb-451c-41a3-08dd235fe6af",
          "userChapterMaterials": null
        }
      ]
    },
    {
      "id": "337a9ab3-b70d-4355-41a4-08dd235fe6af",
      "number": 7,
      "topic": "Chương 7: Áp dụng chỉ mục trong thiết kế cơ sở dữ liệu và tối ưu hóa truy vấn.",
      "description": "Áp dụng các kỹ thuật chỉ mục trong thiết kế cơ sở dữ liệu để tối ưu hóa hiệu suất truy vấn.",
      "courseId": "40484454-317a-4259-0137-08dd235fe6a6",
      "chapterMaterials": [
        {
          "id": "7342ad23-c2c3-4b4a-ca1c-08dd235fe6b1",
          "number": 1,
          "title": "Chương 7. Các vấn đề thực tiễn trong ứng dụng Cơ sở Dữ liệu",
          "urlFile": "",
          "urlVideo": "",
          "description": "Nghiên cứu các vấn đề thực tế trong việc triển khai và tối ưu hóa cơ sở dữ liệu trong các ứng dụng thực tế.",
          "chapterId": "337a9ab3-b70d-4355-41a4-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "35b456c5-650b-477a-ca1d-08dd235fe6b1",
          "number": 2,
          "title": "7.2 Giao dịch, Xem và Tối ưu hóa Truy vấn",
          "urlFile": "",
          "urlVideo": "",
          "description": "Tìm hiểu về giao dịch trong cơ sở dữ liệu, bao gồm cách quản lý tính toàn vẹn và hiệu suất giao dịch, cùng với tối ưu hóa các truy vấn cơ sở dữ liệu.",
          "chapterId": "337a9ab3-b70d-4355-41a4-08dd235fe6af",
          "userChapterMaterials": null
        },
        {
          "id": "4856373b-a6bb-4e02-ca1e-08dd235fe6b1",
          "number": 3,
          "title": "7.2 Giao dịch, Xem và Tối ưu hóa Truy vấn (tiếp theo)",
          "urlFile": "",
          "urlVideo": "",
          "description": "Tiếp tục nghiên cứu về đại số quan hệ, bao gồm các phép toán phức tạp hơn như hợp, giao, và hiệu.",
          "chapterId": "337a9ab3-b70d-4355-41a4-08dd235fe6af",
          "userChapterMaterials": null
        }
      ]
    }
  ], 
};

const UserReducer = createSlice({
  name: "UserReducer",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setSchedules: (state, action) => {
      state.schedules = action.payload;
    },
    setCLassOfUserLogin: (state, action) => {
      state.classOfUserLogin = action.payload;
    },
    setUserManager: (state, action) => {
      state.userManager = action.payload;
    },
    setTaskUser: (state, action) => {
      state.taskUser = action.payload.items;
      state.totalPagesCount = action.payload.totalPagesCount;
    },
    setAccounts: (state, action) => {
      state.accounts = action.payload.items;
      state.totalItemsCount = action.payload.totalItemsCount;
    },
    setMaterialClass: (state, action) => {
      state.materialClass = action.payload.chapters;
    },
  },
});

export const {
  setUserData,
  setUserProfile,
  setSchedules,
  setCLassOfUserLogin, setAccounts,
  setUserManager,
  setTaskUser,
  setMaterialClass
} = UserReducer.actions;

export default UserReducer.reducer;
//------------API-CALL-------
export const CreateUserActionAsync = (user) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/agency-manager/api/v1/users`, user);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else {
        message.error(`${res.message}`);
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };
};

export const CreateUserUploadFileActionAsync = (file) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(
        `/agency-manager/api/v1/users/files`,
        file
      );
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else {
        message.error(`${res.message}`);
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };
};

export const ChangePasswordActionAsync = (passwordData) => {
  return async (dispatch) => {
    try {
      // Gọi API đổi mật khẩu
      console.log(passwordData);
      const res = await httpClient.post(
        `/api/v1/users/change-password`,
        passwordData
      );

      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

export const GetUserLoginActionAsync = () => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/users/mine`);
      if (res.isSuccess && res.data) {
        dispatch(setUserProfile(res.data));
      } else {
        message.error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const GetCheckStatusAgencyLoginActionAsync = () => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/users/mine`);
      if (res.isSuccess && res.data) {
        const agencyLogin = getDataJSONStorage(USER_LOGIN);
        console.log("đang check")
        if (agencyLogin?.status && res.data.status !== agencyLogin.status) { // kiểm tra status re.data.status trả về có giống statusAgencyLogin hay ko
          const updatedAgencyLogin = { ...agencyLogin, status: res.data.status };
          setDataJSONStorage(USER_LOGIN, updatedAgencyLogin);

          dispatch(setUserLogin(updatedAgencyLogin));
        }
        //
      } else {
        message.error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const GetClassSchedulesByLoginActionAsync = (startDate, endDate) => {
  return async (dispatch) => {
    try {
      console.log(
        "GetClassSchedulesByLoginActionAsync, startDate: ",
        startDate
      );
      console.log("GetClassSchedulesByLoginActionAsync, endDate: ", endDate);
      const response = await httpClient.get(
        `/api/v1/users/mine/class-schedules`,
        {
          params: {
            startTime: startDate,
            endTime: endDate,
          },
        }
      );
      if (response.isSuccess) {
        dispatch(setSchedules(response.data));
        console.log(
          "GetClassSchedulesByLoginActionAsync, response: ",
          response.data
        );
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(error);
      message.error("Không thể lấy lịch học, vui lòng thử lại sau.");
    }
  };
};

export const GetClassOfUserLoginActionAsync = () => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/users/mine/classes`);
      if (res.isSuccess && res.data) {
        dispatch(setCLassOfUserLogin(res.data));
      } else {
        message.error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const GetManagerUserAddAppointmentActionAsync = (filter) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/manager/api/v1/users`,{
        params: {
          StartTime: filter.startTimeFilter,
          EndTime: filter.endTimeFilter,
        },
      });
      const filteredUsers = res.data.filter((user) =>
        ["Manager", "SystemInstructor", "SystemTechnician", "AgencyManager", "SystemConsultant"].includes(user.role)
      );
      dispatch(setUserManager(filteredUsers));
    } catch (error) {
      console.error(error);
    }
  };
};

export const GetTaskUserByLoginActionAsync = (search, level, status, submit, pageIndex, pageSize) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/users/mine/works`, {
        params: { Search: search, Level: level, Status: status, Submit: submit, PageIndex: pageIndex, PageSize: pageSize }
      });
      console.log("GetTaskUserByLoginActionAsync, response: ", res.data);
      dispatch(setTaskUser(res.data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const StudentSubmitAssignmentActionAsync = (data) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(
        `/api/v1/users/mine/assignments`,
        null, { params: { assignmentId: data.assignmentId, fileSubmitUrl: data.fileUrl, fileSubmitName: data.fileName } });
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(GetAssignmentDetailByIdActionAsync(data.assignmentId))
        return true;
      } else {
        message.error(`${res.message}`);
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };
}

export const InstructorGradeForAssignmentActionAsync = (usersScores, classId) => {
  return async (dispatch) => {
    try {
      // Create an array of POST request promises for each score
      const promises = usersScores.map((dataScore) =>
        httpClient.post(`/instructor/api/v1/scores`, dataScore)
      );

      // Wait for all requests to complete using Promise.all
      const responses = await Promise.all(promises);

      // Check if all responses are successful
      const allSuccessful = responses.every(res => res.isSuccess && res.data);

      if (allSuccessful) {
        message.success('Chấm điểm thành công!');
        await dispatch(GetAssignmentsByClassIdActionAsync(classId)); // Dispatch the action after successful submission
        return true;
      } else {
        message.error('There was an issue with one or more submissions');
        return false;
      }
    } catch (error) {
      console.error(error);
      message.error('An error occurred while submitting scores');
      return false;
    }
  };
};


export const GetAccountsActionAsync = (search, isActive, role, pageIndex, pageSize) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/agency-manager/api/v1/users`, {
        params: {
          Search: search,
          IsActive: isActive,
          Role: role,
          PageIndex: pageIndex,
          PageSize: pageSize,
        },
      });
      if (res.isSuccess && res.data) {
        dispatch(setAccounts(res.data));
      } else {
        message.error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Không thể lấy danh sách tài khoản, vui lòng thử lại sau.");
    }
  };
};

export const GetAdminAccountsActionAsync = (search, isActive, agencyId, role, pageIndex, pageSize) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/admin/api/v1/users`, {
        params: {
          Search: search,
          IsActive: isActive,
          AgencyId: agencyId,
          Role: role,
          PageIndex: pageIndex,
          PageSize: pageSize,
        },
      });
      if (res.isSuccess && res.data) {
        dispatch(setAccounts(res.data));
      } else {
        message.error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Không thể lấy danh sách tài khoản, vui lòng thử lại sau.");
    }
  };
};

export const CreateAccountByAgencyManagerActionAsync = (accountData) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/agency-manager/api/v1/users`, accountData);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

export const ToggleAccountStatusByAgencyManagerActionAsync = (id) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/agency-manager/api/v1/users/${id}/status`);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

export const ToggleAccountStatusByAdminActionAsync = (id) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/admin/api/v1/users/${id}/status`);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

export const UpdateUserByAdminActionAsync = (id, userData) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/admin/api/v1/users?id=${id}`, userData);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

export const CreateAccountByAdminActionAsync = (accountData) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/admin/api/v1/users`, accountData);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

export const UpdateUserByAgencyManagerActionAsync = (id, userData) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/agency-manager/api/v1/users?id=${id}`, userData);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

export const UpdateUserAccountByLoginActionAsync = (dataUpdate) => {
  return async (dispatch) => {
    try {
      const currentUser = getDataJSONStorage(USER_LOGIN)
      const res = await httpClient.put(`/api/v1/users`, dataUpdate);
      if (res.isSuccess && res.data) {
        const updatedUser = { ...currentUser, ...dataUpdate };
        await Promise.all([
          dispatch(GetUserLoginActionAsync()),
          dispatch(setUserLogin(updatedUser))
        ]);
        setDataJSONStorage(USER_LOGIN, updatedUser)
        message.success(`${res.message}`);      
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

export const GetClassMaterialOfUserLoginActionAsync = (courseId) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/users/mine/courses/${courseId}`);
      if (res.isSuccess && res.data) {
        dispatch(setMaterialClass(res.data));
      } else {
        message.error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  };
};
