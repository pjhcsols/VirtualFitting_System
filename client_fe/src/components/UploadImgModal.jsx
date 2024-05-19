import React, { useState } from 'react';
import './UploadImgModal.css';

const UploadImgModal = ({ isOpen, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('파일을 선택해주세요.');
      return;
    }
    const userId = localStorage.getItem('user_id');
    console.log(userId);
    if (!userId) {
      alert('localStorage에서 사용자 ID를 찾을 수 없습니다.');
      return;
    }

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://218.233.221.41:8080/User/uploadImage', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('이미지 업로드에 실패했습니다.');
      }

      const imageUrl = await response.text();
      onUpload(userId, imageUrl);
      onClose();
    } catch (error) {
      console.error(error);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="uploadImgModal" style={{ display: isOpen ? 'block' : 'none' }}>
      <div className="uploadImgModal-content">
        <span className="uploadImgModal-close" onClick={onClose}>&times;</span>
        <h2>사진 업로드</h2>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>확인</button>
      </div>
    </div>
  );
};

export default UploadImgModal;
