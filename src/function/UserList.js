import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
    const [userList, setUserList] = useState([]);
    const [error, setError] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }); // 정렬 상태
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false); // 권한 확인 상태

    // 사용자 정보 가져와서 role 확인
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/user', { withCredentials: true });
                const { role } = response.data; // 사용자 role 정보 확인
                if (role === 'ROLE_ADMIN') {
                    setIsAuthorized(true);  // 권한이 있으면 true로 설정
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

        fetchUserInfo();  // 컴포넌트 마운트 시 사용자 정보 확인
    }, [navigate]);

    // 유저 목록 불러오기
    useEffect(() => {
        if (isAuthorized) {  // 관리자 권한이 있을 때만 유저 목록을 불러옴
            const fetchUserList = async () => {
                try {
                    const response = await axios.get('http://localhost:8080/admin/userList', {
                        withCredentials: true,  // 쿠키나 인증 정보가 필요할 경우 추가
                    });
                    setUserList(response.data);
                } catch (err) {
                    console.error('Failed to fetch user list:', err);
                    setError('유저 목록을 불러오는 데 실패했습니다.');
                }
            };

            fetchUserList();
        }
    }, [isAuthorized]);

    // 정렬 처리 함수
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedUserList = [...userList].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const order = sortConfig.direction === 'asc' ? 1 : -1;
        return a[sortConfig.key] > b[sortConfig.key] ? order : -order;
    });

    // 이메일로 검색 필터링 처리
    const filteredUserList = sortedUserList.filter((user) =>
        user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 권한을 관리자로 변경 또는 회원으로 변경하는 함수
    const handleRoleChange = async (id, currentRole) => {
        try {
            const endpoint = currentRole === 'ROLE_ADMIN'
                ? 'http://localhost:8080/admin/setUser'  // 회원으로 변경
                : 'http://localhost:8080/admin/setAdmin'; // 관리자로 변경

            await axios.post(endpoint, { id }, { withCredentials: true });

            alert(`권한이 ${currentRole === 'ROLE_ADMIN' ? '회원(User)' : '관리자(Admin)'}로 변경되었습니다.`);

            // 유저 목록 갱신
            setUserList(prevState => prevState.map(user =>
                user.id === id
                    ? { ...user, role: currentRole === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN' }
                    : user
            ));
        } catch (err) {
            console.error('Failed to update role:', err);
            alert('권한 변경에 실패했습니다.');
        }
    };

    // 날짜 형식 포맷팅 함수 (초까지 포함)
    const formatDateTime = (datetime) => {
        if (!datetime) return 'N/A';  // null 또는 undefined일 경우 기본값 처리

        const date = new Date(datetime);

        if (isNaN(date.getTime())) { // Invalid Date 처리
            return '유효하지 않은 날짜';
        }

        return date.toLocaleString('ko-KR', { hour12: false });
    };

    if (error) {
        return <div className="text-danger">{error}</div>;
    }

    if (!isAuthorized) {
        return <div>권한을 확인 중입니다...</div>;  // 권한 확인 중일 때 로딩 메시지
    }

    return (
        <Container>
            <h2 className="text-center my-4">유저 목록</h2>
            <Form className="mb-4">
                <Form.Group controlId="emailSearch">
                    <Form.Label>별명 검색</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="별명으로 검색"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Form.Group>
            </Form>
            <Table striped bordered hover variant="dark">
                <thead>
                <tr>
                    <th onClick={() => handleSort('loginId')}>로그인 ID</th>
                    <th onClick={() => handleSort('username')}>별명</th>
                    <th onClick={() => handleSort('email')}>이메일</th>
                    <th onClick={() => handleSort('role')}>권한</th>
                    <th onClick={() => handleSort('createdAt')}>생성일</th>
                    <th onClick={() => handleSort('lastLogin')}>마지막 로그인</th>
                    <th onClick={() => handleSort('isActive')}>활성 상태</th>
                    <th onClick={() => handleSort('subscribe')}>구독 상태</th>
                    <th>권한 변경</th>
                </tr>
                </thead>
                <tbody>
                {filteredUserList.map(user => (
                    <tr key={user.id}>
                        <td>{user.loginId}</td>
                        <td>{user.username}</td>
                        <td>{user.email || 'null'}</td>
                        <td>{user.role}</td>
                        <td>{formatDateTime(user.createdAt)}</td>
                        <td>{formatDateTime(user.lastLogin)}</td>
                        <td>{user.isActive ? '비활성화' : '활성화'}</td>
                        <td>{user.subscribe}</td>
                        <td>
                            {user.role === 'ROLE_ADMIN' ? (
                                <Button variant="danger" onClick={() => handleRoleChange(user.id, user.role)}>
                                    회원으로 변경
                                </Button>
                            ) : (
                                <Button variant="warning" onClick={() => handleRoleChange(user.id, user.role)}>
                                    관리자로 변경
                                </Button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default UserList;
