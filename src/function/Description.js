import React, { useEffect, useState } from 'react';
import axios from "axios";
import "../css/Card.css";
import {useLocation} from "react-router-dom";
import "../css/Description.css";

function Description() {
    const location = useLocation();
    const movie = location.state?.movie;
    const [reviews, setReviews] = useState([]);
    const [ratings, setRatings] = useState({}); // 각 영화별 별점 상태
    const [review, setReview] = useState("");
    const [video, setVideo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!movie || !movie.id) return; // movie가 없으면 early return

            try {
                // 리뷰 가져오기
                const reviewResponse = await axios.get(`http://localhost:8080/api/review?movieId=${movie.id}`);
                setReviews(reviewResponse.data || []);

                // 유튜브 비디오 가져오기
                const videoResponse = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
                    params: {
                        part: 'snippet',
                        q: movie.videoUrl,
                        key: 'AIzaSyDkl-0XuLETbRGMS51xz98D8CqoMzmYevI', // 실제 API 키로 대체
                        type: 'video',
                        regionCode: 'kr',
                    },
                });
                if (videoResponse.data.items.length > 0) {
                    setVideo(videoResponse.data.items[0]); // 첫 번째 비디오를 설정
                }
            } catch (err) {
                alert("데이터를 가져오는 중 오류가 발생했습니다: " + err.message);
            }
        };

        void fetchData();
    }, [movie]);

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
            alert('리뷰가 제출되었습니다.');
            setReview(""); // Clear review input
            setRatings({ ...ratings, [movieId]: undefined }); // Reset rating for movie
        } catch (err) {
            alert('리뷰 제출 실패: ' + err);
        }
        window.location.reload();
    };

    const recommendReview = async (userId) =>{
        try{
            await axios.post('http://localhost:8080/api/recommendUp', null,{
                params:{userId},
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true  // 쿠키를 포함하여 요청
            });
            alert('리뷰 추천');
        }catch (err){
            alert('리뷰 추천 실패'+err);
        }
        window.location.reload();
    }

    if (!movie) {
        return <div>영화 정보를 불러올 수 없습니다.</div>; // 영화 정보가 없을 때 메시지 표시
    }

    return (
        <div>
            <div>
                <img
                    src={`http://localhost:8080${movie.posterUrl}`}
                    alt={movie.posterUrl}
                    style={{maxWidth: "400px"}}
                />
                {video && (
                    <iframe
                        width="560"
                        height="315"
                        src={`https://www.youtube.com/embed/${video.id.videoId}?rel=0`}
                        title={video.snippet.title}
                        frameBorder="0"
                        allowFullScreen
                    />
                )}
            </div>
            <div className="movie_desc">
                <p>{movie.title}</p>
                <p>{movie.description}</p>
                <p>{movie.releaseDate}</p>
                <p>{movie.rating}</p>
                <p>{movie.genre}</p>
                <p>{movie.director}</p>
            </div>
            <div className="review_container">
                <div className="write_review">
                    {[1, 2, 3, 4, 5].map(rating => (
                        <label key={rating}>
                            <input
                                type="radio"
                                name={`rating-${movie.id}`}
                                value={rating}
                                checked={ratings[movie.id] === rating}
                                onChange={() => handleRatingChange(movie.id, rating)}
                                style={{display: 'none'}} // 라디오 버튼 숨기기
                            />
                            <span style={{
                                fontSize: '1.5em',
                                cursor: 'pointer',
                                color: ratings[movie.id] >= rating ? '#FFD700' : '#ccc'
                            }}>★</span>
                        </label>
                    ))}
                    <textarea
                        name="review_content"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="리뷰 내용을 입력하세요"
                    />
                    <button onClick={() => submitRating(movie.id)}>리뷰작성</button>
                </div>
                <div className="read_Review">
                    {reviews.map((re, index) => (
                        <div key={index} style={{border:"1px solid black", padding: "10px", margin: "10px"}}>
                            <p>아이디 : {re.nickname}</p>
                            <p>별점 : {re.review.rating}</p>
                            <p>리뷰내용 : {re.review.review}</p>
                            <p>추천수 : {re.review.recommend}</p>
                            <button onClick={() => recommendReview(re.review.id)}
                                    style={{backgroundColor:"transparent", border:"none", fontSize:"14px"}}>추천하기</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Description;
