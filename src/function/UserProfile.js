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
    const [error, setError] = useState('');
    const [userRatingCount, setUserRatingCount] = useState([]);
    const [allRatingCount, setAllRatingCount] = useState([]);
    const navigate = useNavigate();

    const formatExpirationDate = (expiration) => {
        if (!expiration) return '구독해주세요';
        const date = new Date(expiration);
        const year = date.getFullYear().toString().slice(2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분까지`;
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:8080/user/profile', {
                    withCredentials: true
                });
                setProfile(response.data.userProfile);

                // 유저 평가 분포와 전체 평가 분포를 각각 추출하여 배열로 변환
                const userRatingCountData = response.data.userRating.map(rating => rating.userRatingCount);
                const allRatingCountData = response.data.userRating.map(rating => rating.allRatingCount);

                setUserRatingCount(userRatingCountData);
                setAllRatingCount(allRatingCountData);
            } catch (err) {
                setError('Failed to load user profile.');
            }
        };

        fetchProfile();
    }, []);

    const handleUpdate = () => {
        navigate('/editProfile');
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
                data: allRatingCount,  // 전체 유저의 평가 분포도
                barPercentage: 0.6,    // 막대 너비 설정
                categoryPercentage: 0.8, // 카테고리 내에서 간격 설정
            },
            {
                label: '내 평가 분포',
                backgroundColor: 'rgba(255, 99, 132, 0.6)', // 더 진한 색상으로 설정
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255, 99, 132, 0.8)',
                hoverBorderColor: 'rgba(255, 99, 132, 1)',
                data: userRatingCount, // 유저의 평가 분포도
                barPercentage: 0.6,    // 막대 너비 설정
                categoryPercentage: 0.8, // 카테고리 내에서 간격 설정
            }
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            x: {
                stacked: false,  // x축에서 막대 겹치지 않게 설정
            },
            y: {
                stacked: false,  // y축에서 막대 겹치지 않게 설정
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
                        src={profile.profileImage ? `http://localhost:8080${profile.profileImage}` : '/defaultProfile.png'}
                        roundedCircle
                        style={{ width: '150px', height: '150px', objectFit: 'cover', marginBottom: '15px' }}
                        alt="프로필 이미지"
                    />
                    <h4>{profile.username}</h4>
                    <p style={{ color: 'gray' }}>{profile.email}</p>
                    <Row className="text-center mt-4">
                        <Col>
                            <div><strong>{profile.friends || 0}</strong></div>
                            <div>친구</div>
                        </Col>
                        <Col>
                            <div><strong>{profile.watched || 0}</strong></div>
                            <div>평가</div>
                        </Col>
                        <Col>
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
            <Card className="mt-4 shadow" style={{ backgroundColor: '#f8f9fa' }}>
                <Card.Body>
                    <h5>취향분석</h5>
                    <Bar data={chartData} options={chartOptions} height={250} />
                </Card.Body>
            </Card>
        </Container>
    );
};

export default UserProfile;
