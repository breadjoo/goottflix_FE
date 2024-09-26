import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Welcome = () => {
    const [username, setUsername] = useState(null); // 사용자 이름 상태

    // 백엔드에서 사용자 이름 가져오기
    useEffect(() => {
        axios.get('http://localhost:8080/api/user', { withCredentials: true })
            .then(response => {
                setUsername(response.data.username); // 사용자 이름 설정
            })
            .catch(error => {
                console.error('Failed to fetch user info', error);
            });
    }, []);

    return (
        // 사용자 이름이 있을 경우 환영 메시지 출력
        username && (
            <div style={{
                position: 'absolute', // 네비게이션 바 아래에 위치
                top: '70px', // 네비게이션 바 아래쪽에 위치하도록 설정
                right: '20px', // 오른쪽 정렬
                color: '#fff', // 흰색 텍스트
                backgroundColor: '#001f3f', // 네비게이션 바 배경과 동일한 색상
                padding: '10px 15px',
                borderRadius: '5px', // 모서리를 둥글게
                fontWeight: 'bold',
                zIndex: 1, // 다른 요소보다 위에 표시되도록 설정
            }}>
                <span>{username}님 환영합니다!</span>
            </div>
        )
    );
};

export default Welcome;
