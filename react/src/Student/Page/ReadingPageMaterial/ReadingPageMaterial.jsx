import { BookOutlined, CheckCircleOutlined, CheckOutlined, HomeOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Card, Typography } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import DOMPurify from "dompurify";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDataJSONStorage } from "../../../Utils/UtilsFunction";
import { USER_LOGIN } from "../../../Utils/Interceptors";
import { MarkChapterMaterialByIdActionAsync } from "../../../Redux/ReducerAPI/UserReducer";
import { useLoading } from "../../../Utils/LoadingContext";

const { Title } = Typography;

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

const ContentContainer = styled.div`
  max-width: 800px; /* Adjust width as needed */
  margin: 0 auto;
  padding: 0 15px; /* Optional padding for spacing */
`;

const ReadingPageMaterial = () => {
  const { materialClass } = useSelector((state) => state.UserReducer)
  const [chapterMaterial, setChapterMaterial] = useState({})
  const {className, number, materialNumber, courseId} = useParams()
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
            <Button icon={<LeftOutlined />} onClick={() => handleNavigation('previous')} disabled={!findAdjacentMaterial('previous')}>Quay lại</Button>
            <Button type="primary" icon={<RightOutlined />} onClick={() => handleNavigation('next')} disabled={!findAdjacentMaterial('next')}>Xem tiếp</Button>
          </div>
        </div>
      </div>

      {/* Title */}
      <ContentContainer>
        {/* Title */}
        <div className="mb-4 text-center">
          <Title level={3}>{chapterMaterial.title}</Title>
        </div>

        {/* Description */}
        <HTMLContent dangerouslySetInnerHTML={sanitizeHTML(chapterMaterial.description)}/>

        <div className="mt-4 text-center">
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
      </ContentContainer>
    </Card>
  );
};

export default ReadingPageMaterial;
