import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import "../css/Card.css";
import { useNavigate } from "react-router-dom";

function MovieCard() {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [ratings, setRatings] = useState({});
    const [page, setPage] = useState(1); // 현재 페이지 상태
    const [totalMovies, setTotalMovies] = useState(0); // 총 영화 개수 상태
    const [loading, setLoading] = useState(false); // 로딩 상태
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    useEffect(() => {
        const getMovies = async () => {
            setLoading(true); // 로딩 시작
            try {
                // 서버로부터 페이지에 해당하는 영화 목록과 전체 영화 개수 받아옴
                const response = await axios.get(`${API_URL}/api/list/page`, {
                    params: { page, size: 12 }, // 페이지와 사이즈를 API에 요청
                    withCredentials: true
                });

                const { movies: newMovies, totalMovies } = response.data;

                // 새로운 데이터를 기존 데이터에 추가
                setMovies(prevMovies => {
                    // 새로운 영화 목록에서 기존 영화와 중복되지 않는 것만 추가
                    const movieIds = new Set(prevMovies.map(movie => movie.id)); // 기존 영화들의 ID를 Set에 저장
                    const filteredMovies = newMovies.filter(movie => !movieIds.has(movie.id)); // 중복된 영화는 추가하지 않음

                    return [...prevMovies, ...filteredMovies]; // 기존 영화에 새로운 영화 추가
                });

                setTotalMovies(totalMovies); // 총 영화 개수 설정
                console.log('Movies Length:', movies.length + newMovies.length); // 디버깅용 출력
                console.log('Total Movies:', totalMovies);
            } catch (err) {
                alert(err);
            }
            setLoading(false); // 로딩 종료
        };

        getMovies();
    }, [page]); // 페이지가 변경될 때마다 영화 리스트를 불러옴


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
            await axios.post(`${API_URL}/api/review`, null, {
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
        window.location.reload();
    };

    const movie_Description = async (movieId) => {
        navigate("/description", { state: { movieId }});
    };

    const loadMoreMovies = () => {
        if (movies.length < totalMovies && !loading) {
            setPage(prevPage => prevPage + 1); // 다음 페이지 로드
        }
    };

    return (
        <div className="movie-container">
            {movies.map(movie => (
                <div key={movie.id} className="movie-card"> {/* movie.id로 고유한 key 설정 */}
                    <Card style={{ width: '18rem', backgroundColor: '#001f3f', color: 'white' }}>
                        <Card.Img variant="top" src={`${API_URL}` + movie.posterUrl} alt={movie.posterUrl} className="card-img" />
                        <Card.Body>
                            <Card.Title style={{ color: '#00bfff' }}>{movie.title}</Card.Title>
                            <Card.Text>{movie.intro}</Card.Text>
                        </Card.Body>
                        <ListGroup className="list-group-flush" style={{ backgroundColor: '#000', color: 'white' }}>
                            <ListGroup.Item style={{ backgroundColor: '#001f3f', color: 'white' }}>내 예상 별점</ListGroup.Item>
                            <ListGroup.Item style={{ backgroundColor: '#001f3f', color: 'white' }}>
                                <div>
                                    {[1, 2, 3, 4, 5].map(rating => (
                                        <label key={rating}> {/* rating도 고유한 key 설정 */}
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
                            <Button variant="outline-light" onClick={() => movie_Description(movie.id)}>영화 상세</Button>
                            <Button variant="outline-light" onClick={() => submitRating(movie.id)}>별점 주기</Button>
                        </Card.Body>
                    </Card>
                </div>
            ))}


            {/* 더보기 버튼 */}
            {movies.length < totalMovies && (
                <div className="load-more-container">
                    <Button style = {{ backgroundColor : '#003857' }} className="load-more-button" onClick={loadMoreMovies} disabled={loading}>
                        {loading ? '로딩 중...' : '영화 더보기'}
                    </Button>
                </div>
            )}
        </div>
    );
}

export default MovieCard;
