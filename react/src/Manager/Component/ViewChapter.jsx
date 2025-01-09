import { Button } from "antd";
import React, { useState } from "react";
import { Table } from "antd";
import {  useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import VideoModal from "../Modal/VideoModal";

const ViewChapter = () => {
  const { chapters } = useSelector((state) => state.CourseReducer);
  const navigate = useNavigate()
  const { id } = useParams();
  const [videoModalState, setVideoModalState] = useState({ isVisible: false, url: '' });

  const showVideoModal = (videoUrl) => {
    setVideoModalState({ isVisible: true, url: videoUrl });
  };

  const renderUrlContent = (url, isVideo = false) => {
    if (!url) {
      return (
        <div
          style={{
            display: "inline-block",
            padding: "4px 12px",
            borderRadius: "6px",
            backgroundColor: "rgba(200, 200, 200, 0.5)",
            border: "1px solid rgba(180, 180, 180, 0.3)",
          }}
        />
      );
    }

    if (isVideo) {
      return (
        <Button type="link" onClick={() => showVideoModal(url)}>
          Xem video
        </Button>
      );
    }

    return (
      <Link to={url} target="_blank" rel="noopener noreferrer">
        Xem tài liệu
      </Link>
    );
  };


  const columns = [
    {
      title: "Buổi học",
      dataIndex: "number",
      key: "number",
      width: "10%",
      align: "center",
    },
    {
      title: "Chủ đề",
      dataIndex: "topic",
      key: "topic",
      width: "20%",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: "60%",
    },
    {
      title: "Xem câu hỏi",
      key: "viewQuestions",
      width: "10%",
      align: "center",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => navigate(`/system-instructor/course-detail/${id}/questions?chapterId=${record.id}`)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  const expandColumns = [
    {
      title: "No",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tài liệu",
      dataIndex: "urlFile",
      key: "urlFile",
      align: "center",
      render: (urlFile) => renderUrlContent(urlFile),
    },
    {
      title: "Video",
      dataIndex: "urlVideo",
      key: "urlVideo",
      align: "center",
      render: (urlVideo) => renderUrlContent(urlVideo, true),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
  ];

  // Render nội dung mở rộng (expandedRowRender)
  const expandedRowRender = (record) => (
    <Table
      bordered
      columns={expandColumns}
      dataSource={record.chapterMaterials}
      pagination={false}
      rowKey="id"
      title={() => <h5>Tài nguyên</h5>} // Tiêu đề cho bảng mở rộng
    />
  );

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title">Chi tiết các buổi học</h5>
        </div>
        {/* Bảng hiển thị chapter */}
        <Table
          bordered
          columns={columns}
          expandable={{
            expandedRowRender,
            rowExpandable: (record) => record.chapterMaterials.length > 0, // Chỉ mở rộng nếu có materials
          }}
          dataSource={chapters}
          rowKey="id"
          scroll={{ x: 768 }}
        />
      </div>

      <VideoModal
        isVisible={videoModalState.isVisible}
        onClose={() => setVideoModalState({ isVisible: false, url: '' })}
        videoUrl={videoModalState.url}
      />
    </div>
  );
};

export default ViewChapter;
