import { useEffect, useState } from 'react'
import { Typography, Card, Collapse, List, Space, Tag, Button, Breadcrumb, Statistic, Row, Col } from 'antd'
import { FileTextOutlined, VideoCameraOutlined, DownloadOutlined, BookOutlined, HomeOutlined, ClockCircleOutlined, ReadOutlined, PlayCircleOutlined, CheckCircleOutlined} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { decodeVideoDurationFromUrl } from '../../../Utils/VideoDuration'
import { calculateChapterStats } from '../../../Utils/Duration'
import VideoModal from '../../Modal/VideoModal'
import styled from 'styled-components'

const { Title, Text, Paragraph } = Typography
const { Panel } = Collapse

const StyledListItem = styled(List.Item)`
  cursor: pointer;
  padding: 12px !important;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f0f0f0; /* Màu nền khi hover */
  }
`;

export default function MaterialClass() {
  const { className, courseId, number } = useParams()
  const [currentChapter, setCurrentChapter] = useState(null)
  const { materialClass } = useSelector((state) => state.UserReducer)
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([])
  const [chapterStats, setChapterStats] = useState(null)
  const [videoModalState, setVideoModalState] = useState({ isVisible: false, url: '' });

  useEffect(() => {
    function loadChapterStats() {
      if (materialClass?.chapters && number) {
        const chapter = materialClass.chapters.find(
          (c) => c.number === parseInt(number)
        )
        setCurrentChapter(chapter)
  
        if (chapter?.chapterMaterials) {
          calculateChapterStats(chapter.chapterMaterials)
            .then((stats) => {
              setChapterStats(stats)
            })
            .catch((error) => {
              console.error('Error calculating chapter stats:', error)
            })
        }
      }
    }
  
    loadChapterStats()
  }, [materialClass, number])
  

  useEffect(() => {
    if (currentChapter?.chapterMaterials) {
      const materialsWithDuration = currentChapter.chapterMaterials.map((material) => {
        if (material.urlVideo) {
          const videoDuration = decodeVideoDurationFromUrl(material.urlVideo);
          return { ...material, videoDuration };
        }
        return material;
      });
      setMaterials(materialsWithDuration);
    }
  }, [currentChapter]);

  //Đóng mở modal
  const showVideoModal = (videoUrl) => {
    setVideoModalState({ isVisible: true, url: videoUrl });
  };
  //-----------------

  const renderMaterial = (material) => {
    const handleMaterialClick = () => {
      const materialType = material.urlVideo ? 'video' : 'reading';
      navigate(`/student/${className}/course/${courseId}/chapter/${number}/material/${material.number}/${materialType}`);
    };

    return (
      <StyledListItem
        onClick={handleMaterialClick}
        
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: 16,
          width: '100%',
          padding: '16px 0'
        }}>
          <div style={{ 
            width: 40, 
            height: 40, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: material.urlVideo ? '#e6f4ff' : '#f6ffed',
            borderRadius: '50%'
          }}>
            {material.urlVideo ? (
              <VideoCameraOutlined style={{ fontSize: 20, color: '#1890ff' }} />
            ) : (
              <FileTextOutlined style={{ fontSize: 20, color: '#52c41a' }} />
            )}
          </div>
          
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 8 }}>
              <Text strong>{material.title}</Text>
            </div>
            
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Text type="secondary">{material.description}</Text>
              
              <Space wrap>
                {material.urlVideo && (
                  <Tag icon={<ClockCircleOutlined />} color="blue">
                    {material.videoDuration}
                  </Tag>
                )}
                {material.urlFile && (
                  <Tag icon={<ReadOutlined />} color="green">
                    Tài liệu đọc
                  </Tag>
                )}
                {material.userChapterMaterials && (
                  <Tag icon={<CheckCircleOutlined />} color="success">
                    Đã xem
                  </Tag>
                )}
              </Space>
            </Space>
          </div>

          <Space>
            {material.urlFile && (
              <Button 
                type="text"
                icon={<DownloadOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(material.urlFile, '_blank');
                }}
              >
                Xem tài liệu
              </Button>
            )}
            {material.urlVideo && (
              <Button 
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  showVideoModal(material.urlVideo);
                }}
              >
                Xem video
              </Button>
            )}
          </Space>
        </div>
      </StyledListItem>
    );
  };

  return (
    <Card>
      <Breadcrumb
        style={{ marginBottom: 24 }}
        items={[
          { title: <><HomeOutlined /> <span>Trang chủ</span></>, href: "/student" },
          { title: <><BookOutlined /> <span>{materialClass?.name}</span></> },
          { title: `Chương ${currentChapter?.number}` },
        ]}
      />

      <Collapse 
        defaultActiveKey={['1']}
        expandIconPosition="end"
        style={{ marginBottom: 24 }}
      >
        <Panel 
          header={
            <Title level={4} style={{ margin: 0 }}>
              {currentChapter?.topic}
            </Title>
          }
          key="1"
        >
          <Row gutter={24} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Statistic 
                title="Tổng thời lượng"
                value={chapterStats?.formattedDuration}
                prefix={<ClockCircleOutlined />}
                suffix=""
              />
            </Col>
            <Col span={6}>
              <Statistic 
                title="Video bài học"
                value={chapterStats?.videoCount}
                prefix={<VideoCameraOutlined />}
                suffix="video"
              />
            </Col>
            <Col span={6}>
              <Statistic 
                title="Tài liệu đọc"
                value={chapterStats?.fileCount}
                prefix={<ReadOutlined />}
                suffix="file"
              />
            </Col>
            <Col span={6}>
              <Statistic 
                title="Tổng số mục"
                value={materials?.length}
                prefix={<CheckCircleOutlined />}
                suffix="mục"
              />
            </Col>
          </Row>

          <Paragraph>{currentChapter?.description}</Paragraph>
          
          {/* <Button type="link" style={{ paddingLeft: 0 }}>
            Xem mục tiêu học tập
          </Button> */}
        </Panel>
      </Collapse>

      <List
        itemLayout="vertical"
        dataSource={materials}
        renderItem={renderMaterial}
        split={true}
      />

      {/* Modal */}

      <VideoModal
        isVisible={videoModalState.isVisible}
        onClose={() => setVideoModalState({ isVisible: false, url: '' })}
        videoUrl={videoModalState.url}
      />
    </Card>
  )
}