import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { Card, Typography, Breadcrumb, Tabs, Button } from 'antd';
import { BookOutlined, DownloadOutlined, HomeOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import DOMPurify from "dompurify";
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const { Title, Paragraph } = Typography;

const HTMLContent = styled.div`
  h1, h2, h3, h4, h5, h6 {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
  ul, ol {
    padding-left: 20px;
    margin: 1em 0;
    
    li {
      position: relative;
      margin-bottom: 0.5em;
      padding-left: 0.5em;
      line-height: 1.6;
      
      &::before {
        content: "•";
        color: #666;
        font-size: 1.2em;
        position: absolute;
        left: -15px;
        top: -2px;
      }
    }
  }
  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 1em auto;
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
              { title: <><HomeOutlined /> <span>Trang chủ</span></>, href: "/student" },
              { title: <><BookOutlined /> <span>{materialClass?.name}</span></> },
              { title: `Chương ${number}` },
              { title: `Bài ${materialNumber}` },
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

