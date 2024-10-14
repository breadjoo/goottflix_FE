import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

function MovieSearch() {
    const [movies, setMovies] = useState([]);
    const [genre, setGenre] = useState('');
    const [nation, setNation] = useState('');
    const [director, setDirector] = useState('');
    const [sortBy, setSortBy] = useState('rating'); // 기본 정렬은 평점순

    const fetchMovies = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/search', {
                params: { genre, nation, director, sortBy }
            });
            setMovies(response.data);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    const handleSearch = () => {
        fetchMovies(); // 검색 버튼을 누르면 필터링된 데이터를 가져옴
    };

    return (
        <div className="movie-search-container">
            {/* 필터 옵션 */}
            <div className="filter-container">
                <select value={genre} onChange={e => setGenre(e.target.value)}>
                    <option value="">장르 선택</option>
                    <option value="Action">액션</option>
                    <option value="Drama">드라마</option>
                    <option value="Comedy">코미디</option>
                </select>
                <select value={nation} onChange={e => setNation(e.target.value)}>
                    <option value="">국가 선택</option>
                    <option value="Korea">한국</option>
                    <option value="USA">미국</option>
                    <option value="Japan">일본</option>
                </select>
                <input
                    type="text"
                    placeholder="감독 이름"
                    value={director}
                    onChange={e => setDirector(e.target.value)}
                />
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="rating">평점 높은 순</option>
                    <option value="title">제목 가나다 순</option>
                    <option value="releaseDate">개봉일 순</option>
                </select>
                <Button variant="primary" onClick={handleSearch}>검색</Button>
            </div>

            {/* 영화 카드 */}
            <div className="movie-list">
                {movies.map(movie => (
                    <div key={movie.id} className="movie-card">
                        <Card style={{ width: '18rem', backgroundColor: '#001f3f', color: 'white' }}>
                            <Card.Img variant="top" src={"http://localhost:8080" + movie.posterUrl} />
                            <Card.Body>
                                <Card.Title>{movie.title}</Card.Title>
                                <Card.Text>{movie.description}</Card.Text>
                            </Card.Body>
                            <ListGroup className="list-group-flush">
                                <ListGroup.Item>감독: {movie.director}</ListGroup.Item>
                                <ListGroup.Item>국가: {movie.nation}</ListGroup.Item>
                                <ListGroup.Item>평점: {movie.rating}</ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MovieSearch;
