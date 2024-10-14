import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Button, Form } from 'react-bootstrap';

const EditUserProfile = () => {
    const [profile, setProfile] = useState({
        username: '',
        birth: '',
        gender: '',
        role: '',
        subscribe: '',
        profileImage: null,  // 프로필 이미지 필드 추가
    });
    const [isUsernameValid, setIsUsernameValid] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:8080/user/profile', {
                    withCredentials: true
                });
                setProfile(response.data);
            } catch (err) {
                console.error('Failed to load user profile:', err);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setProfile(prevState => ({
            ...prevState,
            [name]: files ? files[0] : value,  // 파일이면 files[0] 처리
        }));
        setIsUsernameValid(null);  // 중복 확인 상태 초기화
    };

    // 유저네임 중복 체크 함수
    const checkUsernameAvailability = () => {
        if (profile.username.trim() === '') {
            setIsUsernameValid(false);
            setErrorMessage('닉네임을 입력해주세요');
            return;
        }

        axios.post('http://localhost:8080/user/username/check', null, {
            params: { username: profile.username },
            withCredentials: true
        })
            .then(response => {
                if (response.data.available) {
                    setIsUsernameValid(true);
                    setErrorMessage('사용 가능한 닉네임입니다.');
                } else {
                    setIsUsernameValid(false);
                    setErrorMessage('이미 사용중인 닉네임입니다.');
                }
            })
            .catch(() => {
                setIsUsernameValid(false);
                setErrorMessage('Error checking username');
            });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isUsernameValid !== true) {
            alert('별명 중복 확인을 해주세요.');
            return;
        }

        const formData = new FormData();

        // JSON 데이터를 문자열로 변환하여 추가
        formData.append('user', new Blob([JSON.stringify({
            username: profile.username,
            birth: profile.birth,
            gender: profile.gender
        })], { type: 'application/json' }));

        // 파일이 있을 경우 추가
        if (profile.profileImage) {
            formData.append('file', profile.profileImage);
        }

        axios.post('http://localhost:8080/user/profile/update', formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(() => {
                alert('프로필이 성공적으로 업데이트되었습니다.');
                window.location.href = '/login';  // 로그아웃 후 로그인 페이지로 리다이렉트
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
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Card style={{ width: '400px', backgroundColor: '#001f3f', color: 'white' }}>
                    <Card.Body>
                        <h2 className="text-center mb-4" style={{ color: '#00bfff' }}>프로필 수정</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group id="username" className="mb-3">
                                <Form.Label>별명</Form.Label>
                                <div className="input-group">
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        value={profile.username}
                                        onChange={handleChange}
                                        required
                                        style={{ backgroundColor: '#000', color: 'white' }}
                                        className={`form-control ${isUsernameValid === false ? 'is-invalid' : isUsernameValid === true ? 'is-valid' : ''}`}
                                    />
                                    <div className="input-group-append">
                                        <Button
                                            variant="outline-light"
                                            className="ms-2"
                                            onClick={checkUsernameAvailability}
                                            disabled={profile.username.trim() === ''}
                                        >
                                            중복 확인
                                        </Button>
                                    </div>
                                </div>
                                {isUsernameValid === false && (
                                    <div className="invalid-feedback d-block">
                                        {errorMessage}
                                    </div>
                                )}
                                {isUsernameValid === true && (
                                    <div className="valid-feedback d-block">
                                        {errorMessage}
                                    </div>
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

                            <Form.Group id="profileImage" className="mb-3">
                                <Form.Label>프로필 이미지 업로드</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="profileImage"
                                    onChange={handleChange}  // 파일 처리
                                    style={{ backgroundColor: '#000', color: 'white' }}
                                />
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

                            <Button
                                variant="outline-light"
                                type="submit"
                                className="w-100 mt-3"
                                disabled={isUsernameValid !== true || profile.username.trim() === ''}
                            >
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
