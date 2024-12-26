// import { useEffect, useState } from 'react'
// import { Typography, Layout, Card, Space, Tag, Button, Breadcrumb, Divider } from 'antd'
// import { FileTextOutlined, VideoCameraOutlined, DownloadOutlined, BookOutlined, HomeOutlined, ClockCircleOutlined } from '@ant-design/icons'
// import { useParams } from 'react-router-dom'
// import { useSelector } from 'react-redux'
// import { getVideoDuration } from '../../../Utils/VideoDuration'


// const { Title, Text, Paragraph } = Typography
// const { Content } = Layout

// export default function MaterialClass() {
//   const { number } = useParams()
//   const [currentChapter, setCurrentChapter] = useState(null)
//   const { materialClass } = useSelector((state) => state.UserReducer)
//   const [materials, setMaterials] = useState([])

//   useEffect(() => {
//     if (materialClass?.chapters && number) {
//       const chapter = materialClass.chapters.find(
//         (c) => c.number === parseInt(number)
//       )
//       setCurrentChapter(chapter)
//     }
//   }, [materialClass, number])

//   useEffect(() => {
//     const loadDurations = async () => {
//       if (currentChapter?.chapterMaterials) {
//         const materialsWithDuration = await Promise.all(
//           currentChapter.chapterMaterials.map(async (material) => {
//             if (material.urlVideo) {
//               const duration = await getVideoDuration(material.urlVideo)
//               return { ...material, videoDuration: duration }
//             }
//             return material
//           })
//         )
//         setMaterials(materialsWithDuration)
//       }
//     }
//     loadDurations()
//   }, [currentChapter])

//   if (!currentChapter) {
//     return (
//       <div style={{ 
//         minHeight: '100vh', 
//         display: 'flex', 
//         justifyContent: 'center', 
//         alignItems: 'center' 
//       }}>
//         <div className="ant-spin ant-spin-lg ant-spin-spinning">
//           <span className="ant-spin-dot">
//             <i className="ant-spin-dot-item"></i>
//             <i className="ant-spin-dot-item"></i>
//             <i className="ant-spin-dot-item"></i>
//             <i className="ant-spin-dot-item"></i>
//           </span>
//         </div>
//       </div>
//     )
//   }

//   const renderMaterial = (material) => (
//     <Card 
//       className="material-card"
//       style={{ 
//         marginBottom: 16,
//         transition: 'all 0.3s ease',
//       }}
//       hoverable
//     >
//       <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
//         <div style={{ 
//           padding: 16,
//           borderRadius: '50%',
//           backgroundColor: material.urlVideo ? '#e6f4ff' : '#f6ffed',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           flexShrink: 0
//         }}>
//           {material.urlVideo ? (
//             <VideoCameraOutlined style={{ fontSize: 24, color: '#1890ff' }} />
//           ) : (
//             <FileTextOutlined style={{ fontSize: 24, color: '#52c41a' }} />
//           )}
//         </div>
        
//         <div style={{ flex: 1 }}>
//           <Space direction="vertical" size="small" style={{ width: '100%' }}>
//             <div>
//               <Tag color={material.urlVideo ? "blue" : "success"}>
//                 Bài {material.number}
//               </Tag>
//               <Text strong style={{ fontSize: 16, marginLeft: 8 }}>
//                 {material.title}
//               </Text>
//             </div>
            
//             <Paragraph type="secondary" style={{ margin: '8px 0' }}>
//               {material.description}
//             </Paragraph>

//             <Space wrap>
//               {material.urlFile && (
//                 <Button 
//                   type="primary"
//                   icon={<DownloadOutlined />}
//                   href={material.urlFile}
//                   target="_blank"
//                   size="large"
//                 >
//                   Tài liệu PDF
//                 </Button>
//               )}
//               {material.urlVideo && (
//                 <Space>
//                   <Button 
//                     type="default"
//                     icon={<VideoCameraOutlined />}
//                     href={material.urlVideo}
//                     target="_blank"
//                     size="large"
//                   >
//                     Xem video
//                   </Button>
//                   <Tag icon={<ClockCircleOutlined />} color="default">
//                     {material.videoDuration || '--:--'}
//                   </Tag>
//                 </Space>
//               )}
//             </Space>
//           </Space>
//         </div>
//       </div>
//     </Card>
//   )

//   return (
//     <Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
//       <Content style={{ padding: 24 }}>
//         <Card 
//           style={{ 
//             maxWidth: 1200, 
//             margin: '0 auto',
//             boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
//           }}
//         >
//           <Breadcrumb style={{ marginBottom: 16 }}>
//             <Breadcrumb.Item href="/">
//               <HomeOutlined />
//               <span style={{ marginLeft: 8 }}>Trang chủ</span>
//             </Breadcrumb.Item>
//             <Breadcrumb.Item href={`/courses/${materialClass?.code}`}>
//               <BookOutlined />
//               <span style={{ marginLeft: 8 }}>{materialClass?.name}</span>
//             </Breadcrumb.Item>
//             <Breadcrumb.Item>
//               Chương {currentChapter.number}
//             </Breadcrumb.Item>
//           </Breadcrumb>

//           <div style={{ marginBottom: 24 }}>
//             <Title level={2} style={{ marginBottom: 8 }}>
//               <Space>
//                 <Tag color="blue" style={{ fontSize: 16 }}>
//                   Chương {currentChapter.number}
//                 </Tag>
//                 {currentChapter.topic}
//               </Space>
//             </Title>
//             <Paragraph type="secondary" style={{ fontSize: 16 }}>
//               {currentChapter.description}
//             </Paragraph>
//           </div>

//           <Divider />

//           <div style={{ 
//             maxHeight: 'calc(100vh - 300px)', 
//             overflowY: 'auto',
//             padding: '0 4px'
//           }}>
//             {materials.map((material) => (
//               <div key={material.id}>
//                 {renderMaterial(material)}
//               </div>
//             ))}
//           </div>
//         </Card>
//       </Content>
//     </Layout>
//   )
// }




import { useEffect, useState } from 'react'
import { Typography, Card, Collapse, List, Space, Tag, Button, Breadcrumb, Statistic, Row, Col } from 'antd'
import { 
  FileTextOutlined, 
  VideoCameraOutlined, 
  DownloadOutlined, 
  BookOutlined, 
  HomeOutlined, 
  ClockCircleOutlined,
  ReadOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getVideoDuration } from '../../../Utils/VideoDuration'
import { calculateChapterStats } from '../../../Utils/Duration'
import { useLoading } from '../../../Utils/LoadingContext'


const { Title, Text, Paragraph } = Typography
const { Panel } = Collapse

export default function MaterialClass() {
  const { number } = useParams()
  const [currentChapter, setCurrentChapter] = useState(null)
  const { materialClass } = useSelector((state) => state.UserReducer)
  const [materials, setMaterials] = useState([])
  const [chapterStats, setChapterStats] = useState(null)
  const {setLoading} = useLoading()
  
  useEffect(() => {
    async function loadChapterStats() {
      if (materialClass?.chapters && number) {
        const chapter = materialClass.chapters.find(
          (c) => c.number === parseInt(number)
        )
        setCurrentChapter(chapter)
        
        if (chapter?.chapterMaterials) {
          setLoading(true)
          try {
            const stats = await calculateChapterStats(chapter.chapterMaterials)
            setChapterStats(stats)
          } catch (error) {
            console.error('Error calculating chapter stats:', error)
          } finally {
            setLoading(false)
          }
        }
      }
    }

    loadChapterStats()
  }, [materialClass, number])


  useEffect(() => {
    const loadDurations = async () => {
      if (currentChapter?.chapterMaterials) {
        const materialsWithDuration = await Promise.all(
          currentChapter.chapterMaterials.map(async (material) => {
            if (material.urlVideo) {
              const duration = await getVideoDuration(material.urlVideo)
              console.log(duration)
              return { ...material, videoDuration: duration }
            }
            return material
          })
        )
        setMaterials(materialsWithDuration)
      }
    }
    loadDurations()
  }, [currentChapter])
  

  const renderMaterial = (material) => (
    <List.Item>
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
            </Space>
          </Space>
        </div>

        <Space>
          {material.urlFile && (
            <Button 
              type="text"
              icon={<DownloadOutlined />}
              href={material.urlFile}
              target="_blank"
            >
              Tài liệu
            </Button>
          )}
          {material.urlVideo && (
            <Button 
              type="primary"
              icon={<PlayCircleOutlined />}
              href={material.urlVideo}
              target="_blank"
            >
              Xem video
            </Button>
          )}
        </Space>
      </div>
    </List.Item>
  )

  return (
    <Card>
      <Breadcrumb style={{ marginBottom: 24 }}>
        <Breadcrumb.Item href="/student">
          <HomeOutlined />
          <span style={{ marginLeft: 8 }}>Trang chủ</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <BookOutlined />
          <span style={{ marginLeft: 8 }}>{materialClass?.name}</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          Chương {currentChapter?.number}
        </Breadcrumb.Item>
      </Breadcrumb>

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
          
          <Button type="link" style={{ paddingLeft: 0 }}>
            Xem mục tiêu học tập
          </Button>
        </Panel>
      </Collapse>

      <List
        itemLayout="vertical"
        dataSource={materials}
        renderItem={renderMaterial}
        split={true}
      />
    </Card>
  )
}