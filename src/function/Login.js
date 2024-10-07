import React, { useState } from 'react';
import { Form, Button, Container, Card, Modal } from 'react-bootstrap';
import axios from 'axios';

function Login() {
    const [formData, setFormData] = useState({
        loginId: '',
        password: ''
    });

    const [showForgotModal, setShowForgotModal] = useState(false); // 모달 상태
    const [email, setEmail] = useState(''); // 이메일 입력 상태

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:8080/api/login', formData, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true  // 쿠키를 포함하여 요청
        })
            .then((response) => {
                alert('로그인 성공');
                window.location.href = '/';
            })
            .catch((error) => {
                console.error('로그인 실패:', error);
                alert('로그인 실패');
            });
    };

    const onNaverLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/naver";
    };

    const onGoogleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    const onKakaoLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
    };

    const testAxiosRequest = () => {
        axios
            .get("http://localhost:8080/test", { withCredentials: true })
            .then((res) => {
                alert(JSON.stringify(res.data));
            })
            .catch((error) => alert(error));
    };

    const handleForgotPassword = () => {
        axios.post('http://localhost:8080/auth/forgot', null, {
            params: { email }, // email 파라미터를 params로 전달
        })
            .then((response) => {
                alert('비밀번호 초기화를 위한 메일이 발송되었습니다.');
                setShowForgotModal(false);
            })
            .catch((error) => {
                console.error('에러:', error);
                alert('존재하지 않는 이메일입니다.');
            });
    };

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{
                minHeight: '100vh',
                minWidth : '100vw',
                margin : 0,
                padding : 0,
                background: 'linear-gradient(to bottom, #000000, #001f3f)', // 그라데이션 적용
            }}
        >
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', width: '100vw' }}>
                <Card style={{ width: '400px', backgroundColor: '#001f3f', color: 'white' }}>
                    <Card.Body>
                        <h2 className="text-center mb-4" style={{ color: '#00bfff' }}>로그인</h2>
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
                            <Button variant="outline-light" type="submit" className="w-100 mt-3">
                                로그인
                            </Button>
                        </Form>
                        <div className="w-100 text-center mt-3">
                            <a href="/signup" style={{ color: '#00bfff' }}>회원가입하기</a>
                        </div>
                        <div className="w-100 text-center mt-3">
                            <Button
                                variant="outline-success"
                                className="w-100"
                                onClick={onNaverLogin}
                                style={{
                                    backgroundColor: '#03c75a',
                                    border: 'none',
                                    color: 'white',
                                }}
                            >
                                네이버로 로그인
                            </Button>
                        </div>
                        <div className="w-100 text-center mt-3">
                            <Button
                                variant="outline-danger"
                                className="w-100"
                                onClick={onGoogleLogin}
                                style={{
                                    backgroundColor: '#db4437',
                                    border: 'none',
                                    color: 'white',
                                }}
                            >
                                구글로 로그인
                            </Button>
                        </div>
                        <div className="w-100 text-center mt-3">
                            <Button
                                variant="outline-warning"
                                className="w-100"
                                onClick={onKakaoLogin}
                                style={{
                                    backgroundColor: '#FEE500',
                                    border: 'none',
                                    color: '#381E1F',
                                }}
                            >
                                카카오로 로그인
                            </Button>
                        </div>
                        <div className="w-100 text-center mt-3">
                            <Button
                                variant="outline-info"
                                className="w-100"
                                onClick={testAxiosRequest}
                            >
                                테스트 요청 보내기
                            </Button>
                        </div>

                        {/* 계정이 기억나지 않습니까? 링크 */}
                        <div className="w-100 text-center mt-3">
                            <a href="#!" onClick={() => setShowForgotModal(true)} style={{ color: '#00bfff' }}>계정이 기억나지 않습니까?</a>
                        </div>
                    </Card.Body>
                </Card>
            </div>

            {/* 비밀번호 초기화 모달 */}
            <Modal show={showForgotModal} onHide={() => setShowForgotModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>비밀번호 초기화</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="forgotEmail">
                        <Form.Label>가입 시 입력한 이메일 주소를 입력해주세요</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="이메일 주소"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowForgotModal(false)}>
                        취소
                    </Button>
                    <Button variant="primary" onClick={handleForgotPassword}>
                        메일 보내기
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Login;
