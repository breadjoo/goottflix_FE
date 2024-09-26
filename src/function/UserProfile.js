import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:8080/user/profile', {
                    withCredentials: true  // 쿠키 포함
                });
                setProfile(response.data);
            } catch (err) {
                setError('Failed to load user profile.');
            }
        };

        fetchProfile();
    }, []);

    const getSubscriptionStatus = (status) => {
        switch(status) {
            case 'free':
                return '처음 회원가입';
            case 'subscribe':
                return '구독 중';
            case 'expired':
                return '구독 만료 : 만료일 써줄계획';
            default:
                return 'null';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월 2자리 표시
        const day = String(date.getDate()).padStart(2, '0'); // 일 2자리 표시
        return `${year}년 ${month}월 ${day}일`;
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', { hour12: false}); // 날짜와 시간을 포함한 전체 표시
    };

    const formatGender = (gender) => {
        return gender === 'M' ? '남성' : '여성';
    };

    if (error) {
        return <div className="text-danger">{error}</div>;
    }

    if (!profile) {
        return <div>Loading...</div>;
    }
    const handleUpdate = () => {
        navigate('/editProfile');
    };

    return (
        <Container
            className="my-5 d-flex justify-content-center align-items-center"
            style={{
                minHeight: '100vh',
                minWidth : '200vh',
                background: 'linear-gradient(to bottom, #000000, #001f3f)', // 그라데이션 배경 추가
            }}
        >
            <Row className="justify-content-center">
                <Col md={6} className="d-flex justify-content-center">
                    <Card className="shadow" style={{ backgroundColor: '#001f3f', color: 'white', width: '1200px' }}> {/* 너비를 400px로 설정 */}
                        <Card.Header className="text-center" style={{ backgroundColor: '#001f3f' }}>
                            <h2>나의 프로필</h2>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex mb-3">
                                <h5 className="w-25" style={{ textAlign: 'right', paddingRight: '10px' }}>이름 :</h5>
                                <p className="w-55" >{profile.username}</p>
                            </div>
                            <div className="d-flex mb-3">
                                <h5 className="w-25" style={{ textAlign: 'right', paddingRight: '10px' }}>이메일 :</h5>
                                <p className="w-75" >{profile.email}</p>
                            </div>
                            <div className="d-flex mb-3">
                                <h5 className="w-25" style={{ textAlign: 'right', paddingRight: '10px' }}>생년월일 :</h5>
                                <p className="w-75" >{formatDateTime(profile.birth)}</p>
                            </div>
                            <div className="d-flex mb-3">
                                <h5 className="w-25" style={{ textAlign: 'right', paddingRight: '10px' }}>성별 :</h5>
                                <p className="w-75" >{formatGender(profile.gender)}</p>
                            </div>
                            <div className="d-flex mb-3">
                                <h5 className="w-25" style={{ textAlign: 'right', paddingRight: '10px' }}>회원가입일 :</h5>
                                <p className="w-75">{formatDateTime(profile.createdAt)}</p>
                            </div>
                            <div className="d-flex mb-3">
                                <h5 className="w-80" style={{ textAlign: 'right', paddingRight: '5px' }}>마지막 로그인:</h5>
                                <p className="w-75">{formatDateTime(profile.lastLogin)}</p>
                            </div>
                            <div className="d-flex mb-3">
                                <h5 className="w-25" style={{ textAlign: 'right', paddingRight: '10px' }}>회원 권한 :</h5>
                                <p className="w-75">{profile.role}</p>
                            </div>
                            <div className="d-flex mb-3">
                                <h5 className="w-25" style={{ textAlign: 'right', paddingRight: '10px' }}>구독 상태 :</h5>
                                <p className="w-75">{getSubscriptionStatus(profile.subscribe)}</p>
                            </div>
                        </Card.Body>
                        <Card.Footer className="text-center" style={{ backgroundColor: '#001f3f' }}>
                            <Button variant="outline-light" type="submit" className="w-50 mt-3"
                                    onClick={handleUpdate}>
                                프로필 수정하기
                            </Button>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UserProfile;
