import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Image, Button } from 'react-bootstrap';

const FriendOfFriendList = () => {
    const [friends, setFriends] = useState([]); // 초기값을 빈 배열로 설정
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const navigate = useNavigate();
    const { friendId } = useParams();

    // 랜덤 이미지 배열
    const randomImages = [
        '/images/아바타1.jpg',
        '/images/아바타2.jpg',
        '/images/아바타3.jpg',
        '/images/아바타4.jpg',
        '/images/아바타5.jpg',
        '/images/아바타6.jpg',
        '/images/아바타7.jpg',
        '/images/아바타8.jpg',
        '/images/아바타9.jpg',
        '/images/아바타10.jpg'
    ];

    // 랜덤 이미지 선택 함수
    const getRandomImage = () => {
        const randomIndex = Math.floor(Math.random() * randomImages.length);
        return randomImages[randomIndex];
    };

    useEffect(() => {
        const fetchFriendOfFriends = async () => {
            try {
                const response = await axios.get(`${API_URL}/friend/list/${friendId}`, {
                    withCredentials: true,
                });
                // 데이터가 배열 형식인지 확인하고 배열로 설정
                console.log(response.data);
                setFriends(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Failed to fetch friends:', error);
                setFriends([]); // 오류 시 빈 배열로 설정
            }
        };

        fetchFriendOfFriends();
    }, [API_URL, friendId]);

    // 친구 프로필 클릭 핸들러
    const handleFriendClick = (friendId) => {
        navigate(`/friendPage/${friendId}`);
    };

    return (
        <Container className="my-5" style={{ maxWidth: '800px' }}>
            <h2 className="text-center mb-4">친구의 친구 목록</h2>
            <Row>
                {friends.map((friend) => (
                    <Col key={friend.friendId} md={12} className="mb-3">
                        <Card className="shadow-sm">
                            <Card.Body className="d-flex align-items-center">
                                <Image
                                    src={friend.profileImage ? `${API_URL}${friend.profileImage}` : getRandomImage()}
                                    roundedCircle
                                    style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '15px', cursor: 'pointer' }}
                                    alt="프로필 이미지"
                                    onClick={() => handleFriendClick(friend.friendId)}
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

export default FriendOfFriendList;
