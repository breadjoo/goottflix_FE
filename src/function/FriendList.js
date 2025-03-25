import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import axios from 'axios';
import { Container, Row, Col, Card, Image, Button } from 'react-bootstrap';

const FriendList = () => {
    const [friends, setFriends] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const navigate = useNavigate(); // navigate 함수 생성

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
        return process.env.PUBLIC_URL + randomImages[randomIndex];
    };

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await axios.get(`${API_URL}/friend/my/list`, {
                    withCredentials: true,
                });
                setFriends(response.data);
            } catch (error) {
                console.error('Failed to fetch friends:', error);
            }
        };

        fetchFriends();
    }, [API_URL]);

    // 친구 프로필 클릭 핸들러
    const handleFriendClick = (friendId) => {
        navigate(`/friendPage/${friendId}`);
    };

    return (
        <Container className="my-5" style={{ maxWidth: '800px' }}>
            <h2 className="text-center mb-4">친구 목록</h2>
            <Row>
                {friends.map((friend) => (
                    <Col key={friend.friendId} md={12} className="mb-3">
                        <Card className="shadow-sm">
                            <Card.Body className="d-flex align-items-center">
                                <Image
                                    src={friend.profileImage ? `${API_URL}${friend.profileImage}` : getRandomImage()}
                                    onError={(e) => { e.target.onerror = null; e.target.src = getRandomImage(); }}
                                    roundedCircle
                                    style={{ width: '60px', height: '60px', objectFit: 'cover', marginBottom: '1px' }}
                                    alt="프로필 이미지"
                                    onClick={() => handleFriendClick(friend.friendId)} // 이미지 클릭 시 이동
                                />
                                <div className="flex-grow-1">
                                    <h5 className="mb-1">{friend.username}</h5>
                                    <div className="text-muted">평가 {friend.watched} · 코멘트 {friend.comment}</div>
                                </div>
                                <Button variant="outline-secondary" size="sm">
                                    팔로잉
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default FriendList;
