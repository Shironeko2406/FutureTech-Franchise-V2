import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { Card, Typography, Breadcrumb, Tabs, Button } from 'antd';
import { BookOutlined, CheckCircleOutlined, CheckOutlined, DownloadOutlined, HomeOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import DOMPurify from "dompurify";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoading } from '../../../Utils/LoadingContext';
import { MarkChapterMaterialByIdActionAsync } from '../../../Redux/ReducerAPI/UserReducer';
import { getDataJSONStorage } from '../../../Utils/UtilsFunction';
import { USER_LOGIN } from '../../../Utils/Interceptors';

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
  const {className, number, materialNumber, courseId} = useParams()
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const videoRef = useRef(null);
  const miniPlayerRef = useRef(null);
  const { setLoading } = useLoading();
  const dispatch = useDispatch()
  const navigate = useNavigate();
  
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

  const handleMarkAsCompleted = async (id) => {
    setLoading(true)
    const dataSend = {
      userId: getDataJSONStorage(USER_LOGIN).id,
      chapterMaterialId: id
    }
    await dispatch(MarkChapterMaterialByIdActionAsync(dataSend, courseId))
    setLoading(false)
  }

  const findAdjacentMaterial = (direction) => {
    if (!materialClass || !materialClass.chapters || materialClass.chapters.length === 0) {
      return null;
    }

    const currentChapter = materialClass.chapters.find(
      (chapter) => chapter.number === parseInt(number, 10)
    );

    if (!currentChapter || !currentChapter.chapterMaterials || currentChapter.chapterMaterials.length === 0) {
      return null;
    }

    const currentMaterialIndex = currentChapter.chapterMaterials.findIndex(
      (material) => material.number === parseInt(materialNumber, 10)
    );

    if (direction === 'next') {
      if (currentMaterialIndex < currentChapter.chapterMaterials.length - 1) {
        return {
          chapter: currentChapter,
          material: currentChapter.chapterMaterials[currentMaterialIndex + 1],
        };
      } else {
        const nextChapterIndex = materialClass.chapters.findIndex(
          (chapter) => chapter.number === parseInt(number, 10)
        ) + 1;
        if (nextChapterIndex < materialClass.chapters.length) {
          const nextChapter = materialClass.chapters[nextChapterIndex];
          return {
            chapter: nextChapter,
            material: nextChapter.chapterMaterials[0],
          };
        }
      }
    } else if (direction === 'previous') {
      if (currentMaterialIndex > 0) {
        return {
          chapter: currentChapter,
          material: currentChapter.chapterMaterials[currentMaterialIndex - 1],
        };
      } else {
        const previousChapterIndex = materialClass.chapters.findIndex(
          (chapter) => chapter.number === parseInt(number, 10)
        ) - 1;
        if (previousChapterIndex >= 0) {
          const previousChapter = materialClass.chapters[previousChapterIndex];
          return {
            chapter: previousChapter,
            material: previousChapter.chapterMaterials[previousChapter.chapterMaterials.length - 1],
          };
        }
      }
    }
    return null;
  };

  const handleNavigation = (direction) => {
    const adjacentMaterial = findAdjacentMaterial(direction);
    if (adjacentMaterial) {
      navigate(`/student/${className}/course/${courseId}/chapter/${adjacentMaterial.chapter.number}/material/${adjacentMaterial.material.number}/${adjacentMaterial.material.urlVideo ? 'video' : 'reading'}`);
      console.log(adjacentMaterial)
    }
  };

  const tabItems = [
    {
      key: 'description',
      label: 'Mô tả',
      children: (
        <div className="min-height-200 p-3">
          <HTMLContent dangerouslySetInnerHTML={sanitizeHTML(chapterMaterial.description)}/>
          
          <div className="mt-4">
            {chapterMaterial.userChapterMaterials ? (
              <div className="text-success">
                <CheckCircleOutlined className="mr-2" />
                Bạn đã xem bài học này
              </div>
            ) : (
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleMarkAsCompleted(chapterMaterial.id)}
              >
                Đánh dấu đã học
              </Button>
            )}
          </div>

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
            <Button icon={<LeftOutlined />} onClick={() => handleNavigation('previous')} disabled={!findAdjacentMaterial('previous')}>Quay lại</Button>
            <Button type="primary" icon={<RightOutlined />} onClick={() => handleNavigation('next')} disabled={!findAdjacentMaterial('next')}>Xem tiếp</Button>
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

