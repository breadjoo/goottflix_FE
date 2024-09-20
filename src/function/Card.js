import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import "../css/Card.css";

function KitchenSinkExample() {
    const [movies, setMovies] = useState([]);
    const [ratings, setRatings] = useState({}); // 각 영화별 별점 상태

    useEffect(() => {
        const getMovies = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/list');
                setMovies(response.data);
            } catch (err) {
                alert(err);
            }
        };

        getMovies();
    }, []);

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
            // 서버에 별점 제출 (API 경로는 필요에 따라 수정)
            await axios.post('http://localhost:8080/api/review', null, {
                params:{movieId, rating},
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true  // 쿠키를 포함하여 요청
            });
            alert('별점이 제출되었습니다.');
        } catch (err) {
            alert('별점 제출 실패: ' + err);
        }
        window.location.reload();
    };

    return (
        <div className="movie-container">
            {movies.map(movie => (
                <div key={movie.id} className="movie-card">
                    <Card style={{ width: '18rem', backgroundColor: '#001f3f', color: 'white' }}>
                        <Card.Img variant="top" src={"http://localhost:8080" + movie.posterUrl} alt={movie.posterUrl} className="card-img" />
                        <Card.Body>
                            <Card.Title style={{ color: '#00bfff' }}>{movie.title}</Card.Title>
                            <Card.Text>{movie.description}</Card.Text>
                        </Card.Body>
                        <ListGroup className="list-group-flush" style={{ backgroundColor: '#000', color: 'white' }}>
                            <ListGroup.Item style={{ backgroundColor: '#001f3f', color: 'white' }}>내 예상 별점</ListGroup.Item>
                            <ListGroup.Item style={{ backgroundColor: '#001f3f', color: 'white' }}>
                                <div>
                                    {[1, 2, 3, 4, 5].map(rating => (
                                        <label key={rating}>
                                            <input
                                                type="radio"
                                                name={`rating-${movie.id}`}
                                                value={rating}
                                                checked={ratings[movie.id] === rating}
                                                onChange={() => handleRatingChange(movie.id, rating)}
                                                style={{ display: 'none' }} // 라디오 버튼 숨기기
                                            />
                                            <span style={{ fontSize: '1.5em', cursor: 'pointer', color: ratings[movie.id] >= rating ? '#FFD700' : '#ccc' }}>★</span>
                                        </label>
                                    ))}
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                        <ListGroup.Item style={{ backgroundColor: '#001f3f', color: 'white' }}>영화 별점 : {movie.rating}</ListGroup.Item>
                        <Card.Body className="d-flex justify-content-between">
                            <Button variant="outline-light" href="#">영화 상세</Button>
                            <Button variant="outline-light" onClick={() => submitRating(movie.id)}>리뷰 달기</Button>
                        </Card.Body>
                    </Card>
                </div>
            ))}
        </div>
    );
}

export default KitchenSinkExample;
