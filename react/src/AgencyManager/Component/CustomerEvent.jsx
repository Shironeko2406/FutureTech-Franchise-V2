import React from 'react';
import { Tooltip } from 'antd';

const CustomEvent = ({ event }) => {
    const handleClick = (e) => {
        e.stopPropagation();
        window.open(event.url, '_blank');
    };

    return (
        <Tooltip title={event.url ? "Nhấn để vào lớp học" : "Chưa có link lớp học"}>
            <div
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    padding: '4px 8px',
                    gap: '2px',
                    cursor: event.url ? 'pointer' : 'default',
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
            </div>
        </Tooltip>
    );
};

export default CustomEvent;

