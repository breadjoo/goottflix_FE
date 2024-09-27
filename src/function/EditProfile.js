import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
const EditUserProfile = () => {
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        birth: '',
        gender: '',
        role: '',
        subscribe: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:8080/user/profile', {
                    withCredentials: true
                });
                setProfile(response.data);
            } catch (err) {
                setError('Failed to load user profile.');
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        axios.post('http://localhost:8080/user/profile/update', profile, {
            withCredentials: true
        })
            .then(() => {
                alert('Profile updated successfully!');
            })
            .catch((err) => {
                console.error('정보 수정 실패:', err);
                alert('정보 수정 실패');
            });
    };


    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{
                minHeight: '100vh',
                minWidth: '200vh',
                background: 'linear-gradient(to bottom, #000000, #001f3f)', // 그라데이션 적용
            }}
        >
            <div
                className="d-flex justify-content-center align-items-center"
                style={{
                    minHeight: '100vh',
                }}
            >
                <Card style={{ width: '400px', backgroundColor: '#001f3f', color: 'white' }}>
                    <Card.Body>
                        <h2 className="text-center mb-4" style={{ color: '#00bfff' }}>프로필 수정</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group id="username" className="mb-3">
                                <Form.Label>이름</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    value={profile.username}
                                    onChange={handleChange}
                                    required
                                    style={{ backgroundColor: '#000', color: 'white' }}
                                />
                            </Form.Group>
                            <Form.Group id="email" className="mb-3">
                                <Form.Label>이메일</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={profile.email}
                                    onChange={handleChange}
                                    required
                                    style={{ backgroundColor: '#000', color: 'white' }}
                                />
                            </Form.Group>
                            <Form.Group id="birth" className="mb-3">
                                <Form.Label>생년월일</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="birth"
                                    value={profile.birth}
                                    onChange={handleChange}
                                    required
                                    style={{ backgroundColor: '#000', color: 'white' }}
                                />
                            </Form.Group>
                            <Form.Group id="gender" className="mb-3">
                                <Form.Label>성별</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="gender"
                                    value={profile.gender}
                                    onChange={handleChange}
                                    required
                                    style={{ backgroundColor: '#000', color: 'white' }}
                                >
                                    <option value="M">남성</option>
                                    <option value="F">여성</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group id="subscribe" className="mb-3">
                                <Form.Label>구독 상태</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="subscribe"
                                    value={profile.subscribe}
                                    onChange={handleChange}
                                    readOnly
                                    style={{ backgroundColor: '#000', color: 'white' }}
                                />
                            </Form.Group>
                            <Button variant="outline-light" type="submit" className="w-100 mt-3">
                                프로필 업데이트
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </Container>
    );
};


export default EditUserProfile;
