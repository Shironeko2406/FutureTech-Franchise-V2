import React from 'react';
import { Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';

const CustomEvent = ({ event }) => {
    const navigate = useNavigate();

    const handleClick = (e) => {
        e.stopPropagation();
        navigate(`/agency-manager/classes/${event.classId}`);
    };

    return (
        <Tooltip title={"Nhấn để xem chi tiết lớp học"}>
            <div
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    padding: '4px 8px',
                    gap: '2px',
                    cursor: 'pointer',
                }}
                onClick={handleClick}
            >
                <div style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: 'white',
                    lineHeight: '1.2'
                }}>
                    {event.title}
                </div>
                {/* <div style={{
                    fontSize: '12px',
                    color: 'white',
                }}>
                    Giáo viên: {event.teacherName}
                </div> */}
            </div>
        </Tooltip>
    );
};

export default CustomEvent;

