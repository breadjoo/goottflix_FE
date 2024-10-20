import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminPage = () => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    // 사용자 정보 가져와서 관리자 권한 확인
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/user`, { withCredentials: true });
                const { role } = response.data;

                if (role === 'ROLE_ADMIN') {
                    setIsAuthorized(true);  // 관리자 권한 확인
                } else {
                    alert('접근 권한이 없습니다.');
                    navigate('/');  // 권한이 없으면 메인 페이지로 리디렉션
                }
            } catch (err) {
                console.error('Failed to fetch user info', err);
                alert('로그인이 필요합니다.');
                navigate('/login');  // 로그인 정보가 없으면 로그인 페이지로 리디렉션
            }
        };

        fetchUserInfo();
    }, [navigate]);

    if (!isAuthorized) {
        return <div>권한을 확인 중입니다...</div>;  // 권한 확인 중일 때 로딩 메시지
    }

    return (
        <Container className="mt-5 text-center">
            <h2 style={{ color: '#001f3f', marginBottom: '40px' }}>관리자 페이지</h2>
            <Row className="justify-content-md-center">
                <Col md={3}>
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={() => navigate('/UserList')}
                        style={{ backgroundColor: '#001f3f', borderColor: '#001f3f', width: '100%' }}
                    >
                        회원관리
                    </Button>
                </Col>
                <Col md={3}>
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={() => navigate('/movieWrite')}
                        style={{ backgroundColor: '#001f3f', borderColor: '#001f3f', width: '100%' }}
                    >
                        영화추가
                    </Button>
                </Col>
                <Col md={3}>
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={() => navigate('/movieListAdmin')}
                        style={{ backgroundColor: '#001f3f', borderColor: '#001f3f', width: '100%' }}
                    >
                        영화알림보내기
                    </Button>
                </Col>
                <Col md={3}>
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={() => navigate('/nfcData')}
                        style={{ backgroundColor: '#001f3f', borderColor: '#001f3f', width: '100%' }}
                    >
                        NFC 확인
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminPage;
