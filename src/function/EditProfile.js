import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Button, Form } from 'react-bootstrap';

const EditUserProfile = () => {
    const [profile, setProfile] = useState({
        username: '',
        birth: '',
        gender: '',
        role: '',
        subscribe: ''
    });
    const [error, setError] = useState('');
    const [usernameCheckMessage, setUsernameCheckMessage] = useState(''); // 중복 확인 메시지
    const [isUsernameChecked, setIsUsernameChecked] = useState(false); // 중복 확인 여부

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
        setIsUsernameChecked(false); // 별명이 바뀌면 중복 확인을 다시 하도록 설정
    };

    // 사용자 별명 중복 확인 함수
    const checkUsername = async () => {
        try {
            const response = await axios.post('http://localhost:8080/user/username/check', null, {
                withCredentials: true,
                params: { username: profile.username }
            });
            setUsernameCheckMessage('사용 가능한 별명입니다.');
            setIsUsernameChecked(true);
        } catch (error) {
            setUsernameCheckMessage('이미 존재하는 별명입니다.');
            setIsUsernameChecked(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isUsernameChecked) {
            alert('별명 중복 확인을 해주세요.');
            return;
        }

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
                                <Form.Label>별명</Form.Label>
                                <div className="d-flex">
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        value={profile.username}
                                        onChange={handleChange}
                                        required
                                        style={{ backgroundColor: '#000', color: 'white' }}
                                    />
                                    <Button
                                        variant="outline-light"
                                        className="ms-2"
                                        onClick={checkUsername}
                                    >
                                        중복 확인
                                    </Button>
                                </div>
                                {usernameCheckMessage && (
                                    <p style={{ color: usernameCheckMessage === '사용 가능한 별명입니다.' ? 'green' : 'red' }}>
                                        {usernameCheckMessage}
                                    </p>
                                )}
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
