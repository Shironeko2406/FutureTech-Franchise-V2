import React, { useEffect } from 'react';
import ReactDiffViewer from 'react-diff-viewer';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { GetCourseCurrentVerByIdActionAsync, GetCourseOldVerByIdActionAsync } from '../../../Redux/ReducerAPI/CourseReducer';

const CompareCourseAgencyManager = () => {
  const {id} = useParams()
  const dispatch = useDispatch()
  const { courseNewVer, courseOldVer } = useSelector((state) => state.CourseReducer);

  useEffect(()=>{
    dispatch(GetCourseCurrentVerByIdActionAsync(id))
    dispatch(GetCourseOldVerByIdActionAsync(id))
  },[id])

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Chi tiết thay đổi phiên bản</h5>
          <ReactDiffViewer
            oldValue={courseOldVer}
            newValue={courseNewVer}
            splitView={true} // Hiển thị song song hai phiên bản
            showDiffOnly={true} // Chỉ hiển thị phần khác biệt
            useDarkTheme={true}
            styles={{
              contentText: {
                wordBreak: 'break-word',
                width: '100%',
                maxWidth: '100%'
              }
            }}
          />
      </div>
    </div>
  );
};

export default CompareCourseAgencyManager;
