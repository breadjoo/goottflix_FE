import React, { useState, useEffect } from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const FriendProfile = () => {
    const [profile, setProfile] = useState(null);
    const [userRank, setUserRank] = useState(null);
    const [commonMovies, setCommonMovies] = useState([]);
    const [error, setError] = useState('');
    const [userRatingCount, setUserRatingCount] = useState([]);
    const [allRatingCount, setAllRatingCount] = useState([]);
    const navigate = useNavigate();
    const { friend_id } = useParams();
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

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

    const getRandomImage = () => {
        const randomIndex = Math.floor(Math.random() * randomImages.length);
        return process.env.PUBLIC_URL + randomImages[randomIndex];
    };

    useEffect(() => {
        const fetchFriendProfile = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/profile/${friend_id}`, {
                    withCredentials: true
                });
                setProfile(response.data.userProfile);
                setUserRank(response.data.userRank);
                setCommonMovies(response.data.commonMovie); // commonMovie 데이터 추가

                const userRatingCountData = response.data.userRating.map(rating => rating.userRatingCount);
                const allRatingCountData = response.data.userRating.map(rating => rating.allRatingCount);

                setUserRatingCount(userRatingCountData);
                setAllRatingCount(allRatingCountData);
            } catch (err) {
                setError('Failed to load friend profile.');
            }
        };

        fetchFriendProfile();
    }, [API_URL, friend_id]);

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
            x: { stacked: false },
            y: { stacked: false, beginAtZero: true },
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
                    <Image
                        src={profile.profileImage ? `${API_URL}${profile.profileImage}` : getRandomImage()}
                        onError={(e) => { e.target.onerror = null; e.target.src = getRandomImage(); }}
                        roundedCircle
                        style={{ width: '100px', height: '100px', objectFit: 'cover', marginBottom: '1px' }}
                        alt="프로필 이미지"
                    />
                    <h4>{profile.username}</h4>
                    <p style={{ color: 'gray' }}>{profile.email}</p>
                    <Row className="text-center mt-4">
                        <Col onClick={() => handleNavigate(`/friend/list/${friend_id}`)} style={{ cursor: 'pointer' }}>
                            <div><strong>{profile.friends || 0}</strong></div>
                            <div>친구</div>
                        </Col>
                        <Col onClick={() => handleNavigate(`/api/friend/review/${friend_id}`)} style={{ cursor: 'pointer' }}>
                            <div><strong>{profile.watched || 0}</strong></div>
                            <div>평가</div>
                        </Col>
                        <Col onClick={() => handleNavigate(`/api/friend/comment/${friend_id}`)} style={{ cursor: 'pointer' }}>
                            <div><strong>{profile.comment || 0}</strong></div>
                            <div>코멘트</div>
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
                            {profile.username}님은 goottflix 서비스 내 평가 순위 {userRank?.reviewRank}위로 <br />
                            <span className="text-primary"> 상위 {userRank?.reviewPercent}% 유저</span>입니다!
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

            {/* 공통으로 본 영화 섹션 */}
            <Card className="mt-4 shadow-sm" style={{ backgroundColor: '#fff' }}>
                <Card.Body>
                    <h5 className="mb-4" style={{ fontWeight: 'bold', color: '#003857' }}>친구와 나 둘다 재밌게 본 영화</h5>
                    <Row>
                        {commonMovies.map(movie => (
                            <Col key={movie.movieId} xs={6} md={4} lg={3} className="mb-3">
                                <Card className="shadow-sm" style={{ cursor: 'pointer' }}>
                                    <Link to={`/description/`} state={{ movie: { id: movie.id } }}>
                                    <Card.Img
                                        variant="top"
                                        src={movie.posterUrl ? `${API_URL}${movie.posterUrl}` : getRandomImage()}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                        alt={movie.title}
                                    />
                                    </Link>
                                    <Card.Body>
                                        <Card.Title style={{ fontSize: '1rem', fontWeight: 'bold' }}>{movie.title}</Card.Title>
                                        <Card.Text className="text-muted">
                                            <small>내 평점: {movie.myRating} <br />친구 평점: {movie.friendRating}</small>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default FriendProfile;
