import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, Row, Col, Dropdown } from 'react-bootstrap';

const FriendMovieList = () => {
    const [movies, setMovies] = useState([]);
    const [sortKey, setSortKey] = useState('title'); // 기본 정렬 기준
    const [username, setUsername] = useState('');
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const { friendId } = useParams(); // friendId를 URL 경로에서 받아옴

    useEffect(() => {
        const fetchMovies = () => {
            axios
                .get(`${API_URL}/api/friend/review/${friendId}`, { withCredentials: true }) // 친구의 ID로 요청
                .then((response) => {
                    // 데이터 가져오기 및 사용자 이름 설정
                    setMovies(response.data);
                    if (response.data.length > 0) {
                        setUsername(response.data[0].username); // 첫 번째 영화의 사용자 이름을 가져옴
                    }
                })
                .catch((error) => {
                    console.error('Error fetching movies:', error);
                });
        };

        fetchMovies();
    }, [API_URL, friendId]);

    // 정렬 기준에 따라 영화 목록 정렬
    const sortMovies = (movies, key) => {
        const sortedMovies = [...movies];
        sortedMovies.sort((a, b) => {
            if (key === 'title' || key === 'genre') {
                return a[key].localeCompare(b[key]);
            } else if (key === 'releaseDate' || key === 'reviewDate') {
                return new Date(a[key]) - new Date(b[key]);
            } else if (key === 'myRating' || key === 'rating') {
                return b[key] - a[key]; // 내림차순 (높은 평점부터)
            }
            return 0;
        });
        return sortedMovies;
    };

    // 정렬 기준 변경 핸들러
    const handleSortChange = (key) => {
        setSortKey(key);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">{username} 님이 봤던 영화목록</h2>

            {/* 정렬 기준 선택 */}
            <Dropdown className="mb-4">
                <Dropdown.Toggle style={{ backgroundColor: '#003857' }} variant="primary" id="dropdown-basic">
                    정렬 기준 선택
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleSortChange('title')}>제목</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortChange('releaseDate')}>개봉일</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortChange('myRating')}>내 평점</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortChange('rating')}>영화의 평점</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortChange('reviewDate')}>리뷰 날짜</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortChange('genre')}>장르</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            {/* 정렬된 영화 목록 표시 */}
            <Row>
                {sortMovies(movies, sortKey).map((movie, index) => (
                    <Col key={index} md={3} className="mb-4">
                        <Card>
                            <Card.Img
                                variant="top"
                                src={`${API_URL}${movie.posterUrl}`}
                                alt={movie.title}
                                style={{ height: '300px', objectFit: 'cover' }}
                            />
                            <Card.Body>
                                <Card.Title>{movie.title}</Card.Title>
                                <Card.Text>
                                    <strong>장르:</strong> {movie.genre}
                                    <br />
                                    <strong>개봉일:</strong> {movie.releaseDate}
                                    <br />
                                    <strong>내 평점:</strong> {movie.myRating}점
                                    <br />
                                    <strong>리뷰 날짜:</strong> {movie.reviewDate}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default FriendMovieList;
