import React, { useState, useEffect } from 'react';
import '../css/ImageSlider.css'; // CSS 파일을 추가

const images = [
    '/images/에일리언.jpg',
    '/images/비틀쥬스.jpg',
    '/images/인사이드아웃2.jpg',
    '/images/반지의제왕.jpg',
];

const ImageSlider = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // 5초마다 이미지 변경

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 interval 제거
    }, []);

    return (
        <div
            className="image-slider"
            style={{
                backgroundImage: `url(${images[currentImageIndex]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '70vh', // 높이를 화면의 50%로 설정 (반으로 줄임)
                position: 'relative', // 텍스트를 배경 위에 오버레이
            }}
        >
            <div className="overlay"></div>
            <div className="slider-content">
                <h1>당신에게 최고의 영화는 무엇인가요?</h1>
                <p>구트구트 플릭쯔 ~.</p>
                <button className="cta-button">button입니다!</button>
            </div>
        </div>
    );
};


export default ImageSlider;
