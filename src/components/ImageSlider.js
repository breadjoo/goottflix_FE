import React, { useState, useEffect } from 'react';
import '../css/ImageSlider.css';
import axios from "axios"; // CSS 파일을 추가

window.IMP.init("imp77446200");
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const onClickPay = async () => {
    window.IMP.request_pay({
        pg: "kakaopay",
        pay_method: "card",
        amount: "9900",
        name: "구독",
    }, function(response){
        const {status, err_msg} = response;
        if(err_msg){
            alert(err_msg);
        }
        if(status==="paid"){
            alert("구독 결제 완료");
            subscribe_success();
        }

    });
};

const subscribe_success = async () => {
    try{
        await axios.post(`${API_URL}/api/subscribe`,null,{
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true  // 쿠키를 포함하여 요청
        });
    }catch (err){
        alert(err);
    }
}


const images = [
    '/images/기생충.jpg',
    '/images/인사이드아웃.jpg',
    '/images/너의이름은.jpg',
    '/images/위플래시.jpg',
    '/images/에일리언.jpg',
    '/images/인터스텔라.jpg',
    '/images/비틀쥬스.jpg',
    '/images/반지의제왕.jpg',
    '/images/시네마천국.jpg'
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
                <p>심심한데 뭐 볼만한거 없을까?</p>
                {/*<p>마음에 드는 영화, 지금 리뷰하고 평가해보세요!</p>*/}
                <button className="cta-button" onClick={onClickPay}>구독하기!</button>
            </div>
        </div>
    );
};


export default ImageSlider;
