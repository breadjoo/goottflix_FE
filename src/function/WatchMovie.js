import React, { useEffect, useState } from 'react';
import axios from "axios";
import {useNavigate,useLocation} from "react-router-dom";
import ReactPlayer from 'react-player';

function WatchMovie() {
    const location = useLocation();
    const movie = location.state?.movie;

    //movie의 id를 가져와서 데이터베이스의 영화url을 가져온 후 플레이어로 재생

    return (
        <div>
            <ReactPlayer
                url="https://www.youtube.com/watch?v=O-59BpsY5oc&t=4306s"   //가져온 영화url을 넣을 부분
                width='600px'
                height='400px'
                controls
            />
        </div>
    );
}

export default WatchMovie;
