export const formatCourseData = (data) => {
    const {
      name,
      description,
      urlImage,
      numberOfLession,
      price,
      code,
      status,
      syllabus,
      courseCategory,
      chapters,
      assessments,
      courseMaterials,
    } = data;
  
    // Break down course info into individual lines
    const courseInfo = [
      `Tên khóa học: ${name}`,
      `Mã khóa học: ${code}`,
      `Trạng thái: ${status}`,
      `Số bài học: ${numberOfLession}`,
      `Giá: ${price.toLocaleString()} VND`,
      '',
      'Mô tả:',
      description,
      '',
      'Hình ảnh:',
      urlImage,
      '',
      'Danh mục:',
      `Tên: ${courseCategory.name}`,
      `Mô tả: ${courseCategory.description}`,
      '',
      'Đề cương:',
      `Mô tả: ${syllabus.description}`,
      `Nhiệm vụ: ${syllabus.studentTask}`,
      `Thời gian: ${syllabus.timeAllocation}`,
      `Công cụ: ${syllabus.toolsRequire}`,
      `Điểm đạt: ${syllabus.minAvgMarkToPass}/10`,
    ].join('\n');
  
    // Format chapters with proper line breaks
    const chaptersText = chapters.map(chapter => [
      `Chương ${chapter.number}:`,
      `Chủ đề: ${chapter.topic}`,
      `Mô tả: ${chapter.description}`,
      '',
      'Tài liệu:',
      ...chapter.chapterMaterials.map(material => [
        `  - Tiêu đề: ${material.title}`,
        `    File: ${material.urlFile}`,
        `    Video: ${material.urlVideo}`,
        `    Mô tả: ${material.description}`,
      ].join('\n')),
      ''
    ].join('\n')).join('\n');
  
    // Format assessments with proper line breaks
    const assessmentsText = assessments.map(assessment => [
      `Đánh giá ${assessment.number}:`,
      `Loại: ${assessment.type}`,
      `Nội dung: ${assessment.content}`,
      `Số lượng: ${assessment.quantity}`,
      `Trọng số: ${assessment.weight}%`,
      ''
    ].join('\n')).join('\n');
  
    // Format course materials with proper line breaks
    const materialsText = courseMaterials.map(material => [
      'Tài liệu:',
      `URL: ${material.url}`,
      `Mô tả: ${material.description}`,
      ''
    ].join('\n')).join('\n');
  
    // Combine all sections with clear separation
    return [
      courseInfo,
      '',
      'CHƯƠNG:',
      chaptersText,
      '',
      'ĐÁNH GIÁ:',
      assessmentsText,
      '',
      'TÀI LIỆU KHÓA HỌC:',
      materialsText
    ].join('\n');
  };
  