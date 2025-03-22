import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import '../css/ImageSlider.css';
import axios from 'axios';

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
    return (
        <div className="image-slider-wrapper">
            <Swiper
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                autoplay={{ delay: 5000 }}
                effect="fade"
                pagination={{ clickable: true }}
                navigation={true}
                loop={true}
            >
                {images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                        <div
                            className="image-slide"
                            style={{
                                backgroundImage: `url(${img})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                height: '70vh'
                            }}
                        >
                            <div className="overlay"></div>
                            <div className="slider-content">
                                <h1>당신에게 최고의 영화는 무엇인가요?</h1>
                                <p>심심한데 뭐 볼만한거 없을까?</p>
                                <button className="cta-button" onClick={onClickPay}>구독하기!</button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ImageSlider;
