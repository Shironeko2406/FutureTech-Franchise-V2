import React from "react";
import { ConfigProvider, List, Tag, Tooltip } from "antd";
import {
  CheckCircleOutlined,
  CommentOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const themeConfig = {
  components: {
    List: {
      avatarMarginRight: 8, 
      descriptionFontSize: 16,
    },
  },
};

const ViewTests = () => {
  const { quizOfClassStudent } = useSelector((state) => state.ClassReducer);

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">Bài kiểm tra</h4>

        <ConfigProvider theme={themeConfig}>
          <List
            itemLayout="horizontal"
            dataSource={quizOfClassStudent}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Tag color="red" icon={<ExclamationCircleOutlined />} />
                  }
                  title={
                    <NavLink style={{ fontSize: "18px" }} to={`/student/quiz/${item.id}`} >{item.title}</NavLink>
                  }
                  description={
                    <>
                      <Tag color="green" icon={<CheckCircleOutlined />}>
                        Attempted
                      </Tag>
                      <span> {moment(item.startTime).format("D MMMM YYYY")}</span>
                      <br />
                      <Tooltip title="Feedback available">
                        <CommentOutlined style={{ marginRight: 8 }} />
                        Feedback available
                      </Tooltip>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default ViewTests;
