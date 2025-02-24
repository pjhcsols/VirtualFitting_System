import React from 'react';
import './BlankContent.css';
import Warning from '../assets/img/Warning.png'

const BlankContent = () => {
  return (
    <div className="blank-content">
        <div className='message-container'>
            <img className='warining' src={Warning} alt='warning'/>
            <p className="main-message">아직 제공되지 않는 서비스입니다.</p>
            <p className="sub-message">빠른 시일 내에 개선하도록 하겠습니다.</p>
        </div>
    </div>
  );
};

export default BlankContent;