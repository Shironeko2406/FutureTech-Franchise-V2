import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Collapse, List, Space, Tag, Button } from 'antd';
import { FileTextOutlined, VideoCameraOutlined, DownloadOutlined } from '@ant-design/icons';
import { GetClassMaterialOfUserLoginActionAsync } from '../../../Redux/ReducerAPI/UserReducer';
import { useParams } from 'react-router-dom';
import { useLoading } from "../../../Utils/LoadingContext";

const { Title, Text } = Typography;

const MaterialClass = () => {
  const { materialClass } = useSelector((state) => state.UserReducer);
  const dispatch = useDispatch()
  const {courseId} = useParams()
  const {setLoading} = useLoading()

  useEffect(()=>{
    setLoading(true)
    dispatch(GetClassMaterialOfUserLoginActionAsync(courseId)).finally(() => setLoading(false))
  },[courseId])

  const renderChapterMaterials = (materials) => (
    <List
      itemLayout="horizontal"
      dataSource={materials}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={item.urlVideo ? <VideoCameraOutlined /> : <FileTextOutlined />}
            title={<Text strong>{item.title}</Text>}
            description={
              <Space direction="vertical">
                <Text type="secondary">{item.description}</Text>
                <Space>
                  {item.urlFile && (
                    <Button icon={<DownloadOutlined />} size="small" href={item.urlFile} target="_blank">
                      Download
                    </Button>
                  )}
                  {item.urlVideo && (
                    <Button icon={<VideoCameraOutlined />} size="small" href={item.urlVideo} target="_blank">
                      Xem bài giảng
                    </Button>
                  )}
                </Space>
              </Space>
            }
          />
        </List.Item>
      )}
    />
  );

  const items = materialClass.map((chapter, index) => ({
    key: index,
    label: (
      <Space>
        <Tag color="blue">Chủ đề {chapter.number}</Tag>
        <Text strong>{chapter.topic}</Text>
      </Space>
    ),
    children: (
      <>
        <Text type="secondary">{chapter.description}</Text>
        {renderChapterMaterials(chapter.chapterMaterials)}
      </>
    ),
  }));

  return (
    <div className="card">
      <div className="card-body">
        <Title level={3} className="card-title mb-4">
          <FileTextOutlined className="mr-2" /> Tài nguyên học tập
        </Title>
        <Collapse defaultActiveKey={['0']} items={items} />
      </div>
    </div>
  );
};

export default MaterialClass;

