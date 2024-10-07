import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card } from 'react-bootstrap';
import axios from 'axios';

function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // URL에서 token 값을 가져옴
    const token = searchParams.get('token');

    const handleSubmit = (e) => {
        e.preventDefault();

        // 비밀번호 확인
        if (newPassword !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        axios.post('http://localhost:8080/auth/reset', null, {
            params: {
                token: token,
                password: newPassword
            }
        })
            .then((response) => {
                setSuccessMessage(
                    <>
                        비밀번호 재설정이 완료되었습니다.<br />
                        새로운 비밀번호로 로그인해주세요.<br />
                        <span style={{ color: 'red' }}>잠시 후 로그인페이지로 이동합니다!</span>
                    </>
                );
                setError('');
                // 몇 초 후 로그인 페이지로 이동
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            })
            .catch((error) => {
                console.error('비밀번호 재설정 실패:', error);
                setError('토큰이 유효하지 않거나 문제가 발생했습니다.');
            });
    };

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(to bottom, #000000, #001f3f)', // 그라데이션
            }}
        >
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', width: '100vw' }}>
                <Card style={{ width: '400px', backgroundColor: '#001f3f', color: 'white' }}>
                    <Card.Body>
                        <h2 className="text-center mb-4" style={{ color: '#00bfff' }}>비밀번호 재설정</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        {successMessage && <div className="alert alert-success">{successMessage}</div>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="newPassword">
                                <Form.Label>새 비밀번호</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="새 비밀번호"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    style={{ backgroundColor: '#000', color: 'white' }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="confirmPassword">
                                <Form.Label>비밀번호 확인</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="비밀번호 확인"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    style={{ backgroundColor: '#000', color: 'white' }}
                                />
                            </Form.Group>

                            <Button variant="outline-light" type="submit" className="w-100 mt-3">
                                비밀번호 재설정
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </Container>
    );
}

export default ResetPassword;
