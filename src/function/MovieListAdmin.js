import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const MovieListAdmin = () => {
    const [movieList, setMovieList] = useState([]);
    const [error, setError] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }); // 정렬 상태
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false); // 권한 확인 상태

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/user`, { withCredentials: true });
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

    // 영화 목록 불러오기
    useEffect(() => {
        if (isAuthorized) {  // 관리자 권한이 있을 때만 영화 목록을 불러옴
            const fetchMovieList = async () => {
                try {
                    const response = await axios.get(`${API_URL}/api/list`, {
                        withCredentials: true,  // 쿠키나 인증 정보가 필요할 경우 추가
                    });
                    setMovieList(response.data);
                } catch (err) {
                    console.error('Failed to fetch movie list:', err);
                    setError('영화 목록을 불러오는 데 실패했습니다.');
                }
            };

            fetchMovieList();
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

    const sortedMovieList = [...movieList].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const order = sortConfig.direction === 'asc' ? 1 : -1;
        return a[sortConfig.key] > b[sortConfig.key] ? order : -order;
    });

    // 영화 알림 보내기 함수
    const handleMovieUpdate = async (id) => {
        try {
            await axios.post(`${API_URL}/notify/movieupdate`, { movieId: id }, { withCredentials: true });
            alert('영화 알림이 성공적으로 전송되었습니다.');
        } catch (err) {
            console.error('Failed to send movie notification:', err);
            alert('영화 알림 전송에 실패했습니다.');
        }
    };

    // 날짜 형식 포맷팅 함수
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'; // 날짜가 없는 경우 처리
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return '유효하지 않은 날짜'; // 잘못된 날짜일 경우
        }
        return date.toLocaleDateString('ko-KR');  // 한국 시간 기준으로 날짜 형식을 표시
    };

    if (error) {
        return <div className="text-danger">{error}</div>;
    }

    if (!isAuthorized) {
        return <div>권한을 확인 중입니다...</div>;  // 권한 확인 중일 때 로딩 메시지
    }

    return (
        <Container>
            <h2 className="text-center my-4">영화 목록</h2>
            <Table striped bordered hover variant="dark">
                <thead>
                <tr>
                    <th onClick={() => handleSort('id')}>ID</th>
                    <th onClick={() => handleSort('title')}>제목</th>
                    <th onClick={() => handleSort('intro')}>소개</th>
                    <th onClick={() => handleSort('release_date')}>개봉일</th>
                    <th onClick={() => handleSort('rating')}>평점</th>
                    <th onClick={() => handleSort('genre')}>장르</th>
                    <th onClick={() => handleSort('director')}>감독</th>
                    <th>영화 알림 보내기</th>
                </tr>
                </thead>
                <tbody>
                {sortedMovieList.map(movie => (
                    <tr key={movie.id}>
                        <td>{movie.id}</td>
                        <td>{movie.title}</td>
                        <td>{movie.intro}</td>
                        <td>{formatDate(movie.release_date)}</td> {/* 개봉일 포맷팅 적용 */}
                        <td>{movie.rating}</td>
                        <td>{movie.genre}</td>
                        <td>{movie.director}</td>
                        <td>
                            <Button variant="warning" onClick={() => handleMovieUpdate(movie.id)}>
                                영화 알림 보내기
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default MovieListAdmin;
