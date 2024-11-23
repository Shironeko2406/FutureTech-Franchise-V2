export const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }], // Tiêu đề
      ['bold', 'italic', 'underline', 'strike'], // Định dạng chữ
      [{ list: 'ordered' }, { list: 'bullet' }], // Danh sách
      ['link', 'image'], // Chèn link, ảnh
      [{ align: [] }], // Căn chỉnh
      ['clean'], // Xóa định dạng
    ],
  };
  
  export const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'link',
    'image',
    'align',
  ];
  