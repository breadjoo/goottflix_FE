import React, { useEffect, useState } from 'react';
import axios from "axios";
import {useNavigate,useLocation} from "react-router-dom";
import ReactPlayer from 'react-player';

function WatchMovie() {
    const location = useLocation();
    const movie = location.state?.movie;
    const [subscribe, setSubscribe] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';


    useEffect(() => {
        const fetch = async () => {
            try {
                const getSubscribe = await axios.get(`${API_URL}/api/userSubscribe`, {
                    withCredentials: true  // 쿠키 포함
                });
                setSubscribe(getSubscribe.data === true);
            } catch (err) {
                alert("데이터를 가져오는 중 오류가 발생했습니다: " + err.message);
            }
        }

        void fetch();
    },[]);

    const revert = () => {
        alert("구독된 회원만 사용 가능합니다");
        window.location.href="/";
    }

    //movie의 id를 가져와서 데이터베이스의 영화url을 가져온 후 플레이어로 재생

    return (
            subscribe ? (
                <div>
                    <ReactPlayer
                        url="https://www.youtube.com/watch?v=O-59BpsY5oc&t=4306s"   //가져온 영화url을 넣을 부분
                        width='600px'
                        height='400px'
                        controls
                    />
                </div>
            ) : (
                revert()
            )
    );
}

export default WatchMovie;
