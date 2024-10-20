import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import { Form, Row, Col, Container } from 'react-bootstrap'; // bootstrap 컴포넌트 추가
import { useNavigate } from 'react-router-dom';

function MovieSearch() {
    const [movies, setMovies] = useState([]);
    const [genre, setGenre] = useState('');
    const [nation, setNation] = useState('');
    const [director, setDirector] = useState('');
    const [sortBy, setSortBy] = useState('rating'); // 기본 정렬은 평점순
    const [ratings, setRatings] = useState({}); // 각 영화에 대한 별점 상태 관리

    // 장르 옵션
    const genreOptions = [
        { value: '액션', label: '액션' },
        { value: '드라마', label: '드라마' },
        { value: '코미디', label: '코미디' },
        { value: '범죄', label: '범죄' },
        { value: '로맨스', label: '로맨스' }
    ];

    // 국가 옵션
    const nationOptions = [
        { value: '한국', label: '한국' },
        { value: '미국', label: '미국' },
        { value: '일본', label: '일본' }
    ];

    const fetchMovies = async () => {
        try {
            const params = {};

            if (genre) {
                params.genre = genre;
            }
            if (nation) {
                params.nation = nation;
            }
            if (director) {
                params.director = director;
            }
            if (sortBy) {
                params.sortBy = sortBy;
            }

            const response = await axios.get('http://localhost:8080/api/search', {
                withCredentials: true,
                params: params
            });
            setMovies(response.data);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    const handleSearch = () => {
        fetchMovies(); // 검색 버튼을 누르면 필터링된 데이터를 가져옴
    };

    const handleRatingChange = (movieId, rating) => {
        setRatings(prevRatings => ({
            ...prevRatings,
            [movieId]: rating
        }));
    };

    const submitRating = async (movieId) => {
        const rating = ratings[movieId];
        if (!rating) {
            alert('별점을 선택해주세요.');
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/review', null, {
                params: { movieId, rating },
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            alert('별점이 제출되었습니다.');
        } catch (err) {
            alert('별점 제출 실패: ' + err);
        }
    };

    const navigate = useNavigate();

    const movie_Description = (movie) => {
        navigate("/description", { state: { movie } });
    };

    return (
        <Container className="movie-search-container">
            <p></p>
            {/* 필터 옵션을 컴팩트하게 배치 */}
            <Form className="filter-container">
                <Row className="align-items-center">
                    <Col xs={12} md={3}>
                        <div style={{height: '100%'}}>
                            <Select
                                options={genreOptions}  // 장르 옵션
                                value={genreOptions.find(option => option.value === genre)}  // 선택된 값
                                onChange={selectedOption => setGenre(selectedOption ? selectedOption.value : '')}  // 선택된 값을 업데이트
                                placeholder="장르 선택"
                                isClearable  // 선택 취소 가능
                                styles={{control: (base) => ({...base, height: '38px'})}} // 높이 조정
                            />
                        </div>
                    </Col>
                    <Col xs={12} md={3}>
                        <div style={{height: '100%'}}>
                            <Select
                                options={nationOptions}  // 국가 옵션
                                value={nationOptions.find(option => option.value === nation)}  // 선택된 값
                                onChange={selectedOption => setNation(selectedOption ? selectedOption.value : '')}  // 선택된 값을 업데이트
                                placeholder="국가 선택"
                                isClearable  // 선택 취소 가능
                                styles={{control: (base) => ({...base, height: '38px'})}} // 높이 조정
                            />
                        </div>
                    </Col>
                    <Col xs={12} md={3}>
                        <Form.Control
                            type="text"
                            placeholder="감독 이름"
                            value={director}
                            onChange={e => setDirector(e.target.value)}
                            style={{height: '38px'}}  // 높이 조정
                        />
                    </Col>
                    <Col xs={12} md={3}>
                        <Form.Select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{height: '38px'}}>
                            <option value="rating">평점 높은 순</option>
                            <option value="title">제목 가나다 순</option>
                            <option value="release_date">개봉일 순</option>
                        </Form.Select>
                    </Col>
                    <Col xs={12} md={3} className="mt-2">
                        <Button style={{backgroundColor: '#003857', height: '38px'}} variant="primary"
                                onClick={handleSearch} block>
                            검색
                        </Button>
                    </Col>
                </Row>
            </Form>

            {/* 영화 카드 한 줄에 4개씩 배치 */}
            <Row className="movie-list mt-4">
                {movies.map(movie => (
                    <Col xs={12} sm={6} md={3} key={movie.id} className="movie-card mb-4">
                        <Card style={{width: '100%', backgroundColor: '#001f3f', color: 'white'}}>
                            <Card.Img variant="top" src={"http://localhost:8080" + movie.posterUrl}/>
                            <Card.Body>
                                <Card.Title>{movie.title}</Card.Title>
                                <Card.Text>{movie.intro}</Card.Text>
                            </Card.Body>
                            <ListGroup className="list-group-flush">
                                <ListGroup.Item style={{
                                    backgroundColor: '#001f3f',
                                    color: 'white'
                                }}>장르: {movie.genre}</ListGroup.Item>
                                <ListGroup.Item style={{
                                    backgroundColor: '#001f3f',
                                    color: 'white'
                                }}>감독: {movie.director}</ListGroup.Item>
                                <ListGroup.Item style={{
                                    backgroundColor: '#001f3f',
                                    color: 'white'
                                }}>국가: {movie.nation}</ListGroup.Item>
                                <ListGroup.Item style={{
                                    backgroundColor: '#001f3f',
                                    color: 'white'
                                }}>평점: {movie.rating}</ListGroup.Item>
                                <ListGroup.Item style={{backgroundColor: '#001f3f', color: 'white'}}>
                                    <div>
                                        나의 평가:
                                        {[1, 2, 3, 4, 5].map(rating => (
                                            <label key={rating}>
                                                <input
                                                    type="radio"
                                                    name={`rating-${movie.id}`}
                                                    value={rating}
                                                    checked={ratings[movie.id] === rating}
                                                    onChange={() => handleRatingChange(movie.id, rating)}
                                                    style={{display: 'none'}}
                                                />
                                                <span style={{
                                                    fontSize: '1.5em',
                                                    cursor: 'pointer',
                                                    color: ratings[movie.id] >= rating ? '#FFD700' : '#ccc'
                                                }}>
                                                    ★
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                            <Card.Body className="d-flex justify-content-between">
                                <Button variant="outline-light" onClick={() => movie_Description(movie)}>영화 상세</Button>
                                <Button variant="outline-light" onClick={() => submitRating(movie.id)}>별점 주기</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default MovieSearch;
