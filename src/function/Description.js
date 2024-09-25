import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import "../css/Card.css";
import {useLocation} from "react-router-dom";

function Description() {
    const location = useLocation();
    const key = {...location.state}
    const [ratings, setRatings] = useState({}); // 각 영화별 별점 상태
    const [review, setReview] = useState("");

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
                params:{movieId, rating, review},
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
        <div>
            <img
                src={"http://localhost:8080" + key.movie.posterUrl}
                alt={key.movie.posterUrl}
                style={{maxWidth:'400px', maxHeight:'300px'}}
            />
            <div className="movie_desc">
                <p>{key.movie.title}</p>
                <p>{key.movie.description}</p>
                <p>{key.movie.releaseDate}</p>
                <p>{key.movie.rating}</p>
                <p>{key.movie.genre}</p>
                <p>{key.movie.director}</p>
            </div>
            <div className="review_container">
                {[1, 2, 3, 4, 5].map(rating => (
                    <label key={rating}>
                        <input
                            type="radio"
                            name={`rating-${key.movie.id}`}
                            value={rating}
                            checked={ratings[key.movie.id] === rating}
                            onChange={() => handleRatingChange(key.movie.id, rating)}
                            style={{display: 'none'}} // 라디오 버튼 숨기기
                        />
                        <span style={{
                            fontSize: '1.5em',
                            cursor: 'pointer',
                            color: ratings[key.movie.id] >= rating ? '#FFD700' : '#ccc'
                        }}>★</span>
                    </label>
                ))}
                <textarea
                    name="review_content"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="리뷰 내용을 입력하세요"
                />
                <button onClick={() => submitRating(key.movie.id)}>리뷰작성</button>
            </div>
        </div>
    );
}

export default Description;
