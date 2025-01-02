import { BookOutlined, HomeOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Card, Typography } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import DOMPurify from "dompurify";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

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
  const {number, materialNumber} = useParams()

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
            <Button icon={<LeftOutlined />}>Trước</Button>
            <Button type="primary" icon={<RightOutlined />}>
              Tiếp
            </Button>
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
      </ContentContainer>
    </Card>
  );
};

export default ReadingPageMaterial;
