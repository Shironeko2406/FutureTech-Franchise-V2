import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLoading } from "../../../Utils/LoadingContext";
import { GetVideoActionAsync } from "../../../Redux/ReducerAPI/VideoReducer";
import { Button, message, Space, Table } from "antd";
import { CopyOutlined, UploadOutlined } from "@ant-design/icons";
import VideoModal from "../../Modal/VideoModal";
import CreateVideoModal from "../../Modal/CreateVideoModal";

const VideoSystemInstructor = () => {
  const { videoData } = useSelector((state) => state.VideoReducer);
  const dispatch = useDispatch();
  const { setLoading } = useLoading();
  const [videoModalState, setVideoModalState] = useState({
    isVisible: false,
    url: "",
  });
  const [modalUploadVideo, setModalUploadVideo] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(GetVideoActionAsync()).finally(() => setLoading(false)); //
  }, []);

  //Đóng mở Modal
  const showVideoModal = (videoUrl) => {
    setVideoModalState({ isVisible: true, url: videoUrl });
  };

  const showModalUpload = () => setModalUploadVideo(true);
  const closeModalUpload = () => setModalUploadVideo(false);
  //---------------------

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        message.success("Copy thành công");
      },
      (err) => {
        message.error("Copy thất bại");
        console.error("Lỗi!: ", err);
      }
    );
  };

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên Video",
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (name, record) => (
        <Button type="link" onClick={() => showVideoModal(record.url)}>
          {name}
        </Button>
      ),
    },
    {
      title: "Thời lượng",
      key: "duration",
      align: "center",
      render: (_, record) => {
        try {
          const decodedUrl = decodeURIComponent(record.url);
          const match = decodedUrl.match(/duration=([^?&]*)/);
          return match ? match[1] : "Không xác định"; // Trích xuất thời lượng từ URL
        } catch {
          return "Không xác định";
        }
      },
    },
    {
      title: "Định dạng chuẩn",
      key: "format",
      align: "center",
      render: () => "mp4",
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button type="primary" icon={<CopyOutlined />} onClick={() => copyToClipboard(record.url)}></Button>
      ),
    },
  ];

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-3">Quản lý khóa học</h5>
          <Space style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<UploadOutlined />} onClick={showModalUpload}>
              Thêm video
            </Button>
          </Space>

          <Table
            bordered
            columns={columns}
            dataSource={videoData}
            rowKey={(record) => record.id}
          />
        </div>
      </div>

      {/* Modal */}
      <VideoModal
        isVisible={videoModalState.isVisible}
        onClose={() => setVideoModalState({ isVisible: false, url: "" })}
        videoUrl={videoModalState.url}
      />

      <CreateVideoModal
        visible={modalUploadVideo}
        onClose={closeModalUpload}
      />
    </div>
  );
};

export default VideoSystemInstructor;
