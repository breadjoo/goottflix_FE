import React, { useState } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import axios from 'axios';

function Signup() {
    const [formData, setFormData] = useState({
        loginId: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '', // 비밀번호 확인 추가
        birth: '',
        gender: 'M',
        verificationCode: '', // 입력한 인증번호를 저장
        isVerified: false, // 이메일 인증 여부
        sentCode: false // 인증 코드 발송 여부
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 이메일 인증 코드 발송
    const sendVerificationCode = () => {
        axios.post('http://localhost:8080/auth/sendCode', null, {
            params: { email: formData.email }
        })
            .then(response => {
                alert('인증 코드가 발송되었습니다.');
                setFormData({
                    ...formData,
                    sentCode: true
                });
            })
            .catch(error => {
                console.error('인증 코드 발송 실패:', error);
                alert('인증 코드 발송 실패 : ' + error.response.data);
            });
    };

    // 인증 코드 확인
    const verifyCode = () => {
        axios.post('http://localhost:8080/auth/verifyCode', {
            email: formData.email,
            code: formData.verificationCode
        })
            .then(response => {
                alert('이메일 인증이 완료되었습니다.');
                setFormData({
                    ...formData,
                    isVerified: true
                });
            })
            .catch(error => {
                console.error('인증 실패:', error);
                alert('인증번호가 잘못되었습니다.');
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.isVerified) {
            alert('이메일 인증을 완료해주세요.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        // 비밀번호 확인 필드는 서버로 보내지 않도록 삭제
        const dataToSubmit = { ...formData };
        delete dataToSubmit.confirmPassword;

        axios.post('http://localhost:8080/api/join', dataToSubmit)
            .then(response => {
                alert('회원가입 성공');
                window.location.href = '/login';
            })
            .catch(error => {
                console.error('회원가입 실패:', error);
                alert('회원가입 실패');
            });
    };

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{
                minHeight: '100vh',
                minWidth: '100vw',
                margin: 0,
                padding: 0,
                background: 'linear-gradient(to bottom, #000000, #001f3f)',
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
                                <Form.Label>사용자 별명</Form.Label>
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
                                {!formData.isVerified && (
                                    <>
                                        <Button
                                            variant="outline-light"
                                            className="mt-2"
                                            onClick={sendVerificationCode}
                                            disabled={formData.sentCode}
                                        >
                                            {formData.sentCode ? '코드 발송 완료' : '인증 코드 발송'}
                                        </Button>
                                        {formData.sentCode && (
                                            <>
                                                <Form.Group className="mt-3">
                                                    <Form.Label>인증 코드</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="verificationCode"
                                                        value={formData.verificationCode}
                                                        onChange={handleChange}
                                                        required
                                                        style={{ backgroundColor: '#000', color: 'white' }}
                                                    />
                                                </Form.Group>
                                                <Button
                                                    variant="outline-light"
                                                    className="mt-2"
                                                    onClick={verifyCode}
                                                >
                                                    인증 코드 확인
                                                </Button>
                                            </>
                                        )}
                                    </>
                                )}
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
                            <Form.Group id="confirmPassword" className="mb-3">
                                <Form.Label>비밀번호 확인</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
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
