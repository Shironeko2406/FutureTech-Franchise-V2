import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { Card, Typography, Breadcrumb, Tabs, Button } from 'antd';
import { DownloadOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import DOMPurify from "dompurify";
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const { Title, Paragraph } = Typography;

const chapterMaterial = {
  id: "f3911b9a-9acd-49a3-0989-08dd266d344b",
  number: 1,
  title: "Chương 4. Các Mô hình Cơ sở Dữ liệu Cấp Cao",
  urlFile: "https://vardhaman.org/wp-content/uploads/2021/03/CP.pdf",
  urlVideo:
    "https://firebasestorage.googleapis.com/v0/b/futuretech-b367a.appspot.com/o/videos%2Fvideotest-4.mp4_fffb1af8-22cc-4b90-9ab9-85cabceae918_duration%3D5%3A55?alt=media&token=0bf172e6-42e4-4155-b027-5ff11ec09fc1",
  description:
    "Khám phá các mô hình cơ sở dữ liệu cấp cao như mô hình thực thể - mối quan hệ (E/R), mô hình mạng và mô hình đối tượng.",
  chapterId: "94cb2004-8cb0-471f-59a1-08dd266d3448",
  userChapterMaterials: null,
};

const HTMLContent = styled.div`
  h1, h2, h3, h4, h5, h6 {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
  ul, ol {
    padding-left: 20px;
  }
`;

const VideoPageMaterial = () => {
  const [playing, setPlaying] = useState(false);
  const { materialClass } = useSelector((state) => state.UserReducer)
  const [chapterMaterial, setChapterMaterial] = useState({})
  const {number, materialNumber} = useParams()
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const videoRef = useRef(null);
  const miniPlayerRef = useRef(null);

  useEffect(() => {
    const material =
      materialClass?.chapters
        ?.find((chapter) => chapter.number === parseInt(number, 10))
        ?.chapterMaterials?.find(
          (material) => material.number === parseInt(materialNumber, 10)
        ) || {};
  
    setChapterMaterial(material);
  }, [number, materialNumber, materialClass]);

  useEffect(() => {
    const handleScroll = () => {
      if (videoRef.current) {
        const videoRect = videoRef.current.getBoundingClientRect();
        setShowMiniPlayer(videoRect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sanitizeHTML = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };

  const tabItems = [
    {
      key: 'description',
      label: 'Mô tả',
      children: (
        <div className="min-height-200 p-3">
          <HTMLContent dangerouslySetInnerHTML={sanitizeHTML(chapterMaterial.description)}/>
          {Array(200).fill(null).map((_, index) => (
            <Paragraph key={index}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Paragraph>
          ))}
        </div>
      ),
    },
  ];

  if (chapterMaterial.urlFile) {
    tabItems.push({
      key: 'downloads',
      label: 'Tài liệu',
      children: (
        <div className="min-height-200 p-3">
          <Button 
            type='link'
            className='p-0'
            icon={<DownloadOutlined />} 
            href={chapterMaterial.urlFile}
            target="_blank"
            rel="noopener noreferrer"
          >
            Tải xuống tài liệu
          </Button>
        </div>
      ),
    });
  }

  return (
    <Card>
      {/* Navigation */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <Breadcrumb
            items={[
              { title: 'Foundations of Project Management' },
              { title: 'Module 1' },
              { title: chapterMaterial.title },
            ]}
          />
          <div className="d-flex gap-2">
            <Button icon={<LeftOutlined />}>Previous</Button>
            <Button type="primary" icon={<RightOutlined />}>Next</Button>
          </div>
        </div>
      </div>

      {/* Title and Description */}
      <div className="mb-4">
        <Title level={3}>{chapterMaterial.title}</Title>
      </div>

      {/* Video Player */}
      <div ref={videoRef} className="bg-dark rounded mb-4 overflow-hidden">
        <ReactPlayer
          url={chapterMaterial.urlVideo}
          width="100%"
          height="450px"
          playing={playing}
          controls={true}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultActiveKey="description" items={tabItems} />

      {/* Mini Player */}
      {showMiniPlayer && (
        <div 
          ref={miniPlayerRef}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '300px',
            height: '169px',
            zIndex: 1000,
          }}
        >
          <ReactPlayer
            url={chapterMaterial.urlVideo}
            width="100%"
            height="100%"
            playing={playing}
            controls={true}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
        </div>
      )}
    </Card>
  );
};

export default VideoPageMaterial;

