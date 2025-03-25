import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';
import { FaCog } from 'react-icons/fa'; // Settings icon
import { Bar } from 'react-chartjs-2'; // Bar chart
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [userRank, setUserRank] = useState(null);
    const [error, setError] = useState('');
    const [userRatingCount, setUserRatingCount] = useState([]);
    const [allRatingCount, setAllRatingCount] = useState([]);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    // 랜덤 이미지 배열
    const randomImages = [
        '/images/아바타1.JPG',
        '/images/아바타2.JPG',
        '/images/아바타3.JPG',
        '/images/아바타4.JPG',
        '/images/아바타5.JPG',
        '/images/아바타6.JPG',
        '/images/아바타7.JPG',
        '/images/아바타8.JPG',
        '/images/아바타9.JPG',
        '/images/아바타10.JPG'
    ];

    // 랜덤 이미지 선택 함수
    const getRandomImage = () => {
        const randomIndex = Math.floor(Math.random() * randomImages.length);
        return process.env.PUBLIC_URL + randomImages[randomIndex]; // 절대 경로
    };

    const formatExpirationDate = (expiration) => {
        if (!expiration) return '구독해주세요';
        const date = new Date(expiration);
        const year = date.getFullYear().toString().slice(2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}년 ${month}월 ${day}일만료`;
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/profile`, {
                    withCredentials: true
                });
                setProfile(response.data.userProfile);
                setUserRank(response.data.userRank);

                const userRatingCountData = response.data.userRating.map(rating => rating.userRatingCount);
                const allRatingCountData = response.data.userRating.map(rating => rating.allRatingCount);

                setUserRatingCount(userRatingCountData);
                setAllRatingCount(allRatingCountData);
            } catch (err) {
                setError('Failed to load user profile.');
            }
        };

        fetchProfile();
    }, [API_URL]);

    const handleUpdate = () => {
        navigate('/editProfile');
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    const chartData = {
        labels: ['0점', '1점', '2점', '3점', '4점', '5점'],
        datasets: [
            {
                label: '전체 평가 분포',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(54, 162, 235, 0.4)',
                hoverBorderColor: 'rgba(54, 162, 235, 1)',
                data: allRatingCount,
                barPercentage: 0.6,
                categoryPercentage: 0.8,
            },
            {
                label: '내 평가 분포',
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255, 99, 132, 0.8)',
                hoverBorderColor: 'rgba(255, 99, 132, 1)',
                data: userRatingCount,
                barPercentage: 0.6,
                categoryPercentage: 0.8,
            }
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            x: {
                stacked: false,
            },
            y: {
                stacked: false,
                beginAtZero: true,
            },
        },
    };

    if (error) {
        return <div className="text-danger">{error}</div>;
    }

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="my-5" style={{ maxWidth: '800px' }}>
            <Card className="shadow" style={{ backgroundColor: '#f8f9fa' }}>
                <Card.Body className="text-center">
                    <div className="d-flex justify-content-end">
                        <FaCog style={{ fontSize: '24px', cursor: 'pointer' }} onClick={handleUpdate} />
                    </div>
                    <Image
                        src={profile.profileImage ? `${API_URL}${profile.profileImage}` : getRandomImage()}
                        onError={(e) => { e.target.onerror = null; e.target.src = getRandomImage(); }}
                        roundedCircle
                        style={{ width: '150px', height: '150px', objectFit: 'cover', marginBottom: '15px' }}
                        alt="프로필 이미지"
                    />
                    <h4>{profile.username}</h4>
                    <p style={{ color: 'gray' }}>{profile.email}</p>
                    <Row className="text-center mt-4">
                        <Col onClick={() => handleNavigate('/myFriendList')} style={{ cursor: 'pointer' }}>
                            <div><strong>{profile.friends || 0}</strong></div>
                            <div>친구</div>
                        </Col>
                        <Col onClick={() => handleNavigate('/movieList')} style={{ cursor: 'pointer' }}>
                            <div><strong>{profile.watched || 0}</strong></div>
                            <div>평가</div>
                        </Col>
                        <Col onClick={() => handleNavigate('/myCommentList')} style={{ cursor: 'pointer' }}>
                            <div><strong>{profile.comment || 0}</strong></div>
                            <div>코멘트</div>
                        </Col>
                    </Row>
                    <Row className="text-center mt-4">
                        <Col>
                            <div><strong>마지막 로그인</strong></div>
                            <div><strong>{profile.lastLogin || ''}</strong></div>
                        </Col>
                        <Col>
                            <div><strong>{profile.loginId || ''}</strong></div>
                        </Col>
                        <Col>
                            <div><strong>{profile.subscribe || 0}</strong></div>
                            <div>{formatExpirationDate(profile.expiration) || ''}</div>
                        </Col>
                    </Row>

                </Card.Body>
            </Card>

            {/* 통계 섹션 */}
            <Card className="mt-4 shadow-sm" style={{ backgroundColor: '#fff' }}>
                <Card.Body>
                    <h5 className="mb-4" style={{ fontWeight: 'bold', color: '#003857' }}>취향분석</h5>
                    <div className="mb-4 px-3 py-3 rounded" style={{ backgroundColor: '#f0f4f8', borderLeft: '4px solid #003857' }}>
                        <p className="mb-2" style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>
                            {profile.username}님은 goottflix 서비스 내 평가 순위 {userRank?.reviewRank}위로 <br/>
                            <span className="text-primary"> 한국에서 영화를 즐기는 상위 {userRank?.reviewPercent}% 유저</span>입니다!
                        </p>
                        <p className="mb-2" style={{fontSize: '1.1rem', fontWeight: 'bold', color: '#333'}}>
                            {profile.username}님은 <span
                            className="font-weight-bold text-bg-danger">{profile.likedGenre}</span> 장르의 영화를 즐겨 보시는군요!
                        </p>
                    </div>
                    <Bar
                        data={chartData}
                        options={chartOptions}
                        height={250}
                        className="p-3 border rounded"
                        style={{ backgroundColor: '#f9fbfc' }}
                    />
                </Card.Body>
            </Card>

        </Container>
    );
};

export default UserProfile;
