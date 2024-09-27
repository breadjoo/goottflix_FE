import React, { useState } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import axios from 'axios';

function Signup() {
    const [formData, setFormData] = useState({
        loginId: '', // loginId 추가
        username: '',
        email: '',
        password: '',
        birth: '',
        gender: 'M' // 기본값 설정
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:8080/api/join', formData)
            .then((response) => {
                alert('회원가입 성공');
                window.location.href = '/login';
            })
            .catch((error) => {
                console.error('회원가입 실패:', error);
                alert('회원가입 실패');
            });
    };

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{
                minHeight: '100vh',
                minWidth : '100vw',
                margin : 0,
                padding: 0,
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
                        <h2 className="text-center mb-4" style={{ color: '#00bfff' }}>회원가입</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group id="loginId" className="mb-3">
                                <Form.Label>로그인 ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="loginId"
                                    value={formData.loginId}
                                    onChange={handleChange}
                                    required
                                    style={{ backgroundColor: '#000', color: 'white' }}
                                />
                            </Form.Group>
                            <Form.Group id="username" className="mb-3">
                                <Form.Label>사용자 이름</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    value={formData.username}
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
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    style={{ backgroundColor: '#000', color: 'white' }}
                                />
                            </Form.Group>
                            <Form.Group id="password" className="mb-3">
                                <Form.Label>비밀번호</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
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
                                    value={formData.birth}
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
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                    style={{ backgroundColor: '#000', color: 'white' }}
                                >
                                    <option value="M">남성</option>
                                    <option value="F">여성</option>
                                </Form.Control>
                            </Form.Group>
                            <Button variant="outline-light" type="submit" className="w-100 mt-3">
                                회원가입
                            </Button>
                        </Form>
                        <div className="w-100 text-center mt-3">
                            <a href="/login" style={{ color: '#00bfff' }}>이미 계정이 있나요? 로그인</a>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </Container>
    );
}

export default Signup;
