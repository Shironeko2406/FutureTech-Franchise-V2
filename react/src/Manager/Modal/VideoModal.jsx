import React, { useEffect, useRef } from 'react';
import { Modal } from 'antd';
import ReactPlayer from 'react-player';

const VideoModal = ({ isVisible, onClose, videoUrl }) => {
  const playerRef = useRef(null);

  useEffect(() => {
    if (!isVisible && playerRef.current) {
      // Gọi phương thức dừng phát video khi modal đóng
      playerRef.current.seekTo(0); // Quay lại đầu video
    }
  }, [isVisible]);

  return (
    <Modal
      title="Video Player"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose={true} // Xóa nội dung khi modal đóng
    >
      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        controls
        width="100%"
        height="400px"
        playing={isVisible} // Phát/dừng tự động theo `isVisible`
      />
    </Modal>
  );
};

export default VideoModal;