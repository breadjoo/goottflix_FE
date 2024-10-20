import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Card.css';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/Description.css';

function Description() {
    const navigate = useNavigate();
    const location = useLocation();
    const movie = location.state?.movie;
    const [reviews, setReviews] = useState([]);
    const [ratings, setRatings] = useState({});
    const [review, setReview] = useState('');
    const [video, setVideo] = useState(null);
    const [subscribe, setSubscribe] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false); // 관리자 권한 확인 상태 추가
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    // 사용자 정보 가져와서 role 확인
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/user`, { withCredentials: true });
                const { role } = response.data; // 사용자 role 정보 확인
                if (role === 'ROLE_ADMIN') {
                    setIsAuthorized(true);  // 권한이 있으면 true로 설정
                } else {
                    setIsAuthorized(false);  // 권한이 없으면 false로 설정
                }
            } catch (err) {
                console.error('Failed to fetch user info', err);
                alert('로그인이 필요합니다.');
                navigate('/login');  // 로그인 정보가 없으면 로그인 페이지로 리디렉션
            }
        };

        fetchUserInfo();
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            if (!movie || !movie.id) return;
            console.log("현재 영화 객체:", movie);  // movie 객체가 제대로 있는지 확인

            try {
                // 리뷰 가져오기
                const reviewResponse = await axios.get(`${API_URL}/api/review?movieId=${movie.id}`,{
                    withCredentials: true  // 쿠키 포함
                });
                setReviews(reviewResponse.data || []);

                const getSubscribe = await axios.get(`${API_URL}/api/userSubscribe`, {
                    withCredentials: true
                });
                setSubscribe(getSubscribe.data === true);

                const videoResponse = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
                    params: {
                        part: 'snippet',
                        q: movie.videoUrl,
                        key: 'AIzaSyBhy1AR1O0Poc0383mS2yueYn3EfzoEW94',
                        type: 'video',
                        regionCode: 'kr'
                    }
                });
                if (videoResponse.data.items.length > 0) {
                    setVideo(videoResponse.data.items[0]);
                }
            } catch (err) {
                alert('데이터를 가져오는 중 오류가 발생했습니다: ' + err.message);
            }
        };

        void fetchData();
    }, [movie]);

    const handleRatingChange = (movieId, rating) => {
        setRatings((prevRatings) => ({
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
                params: { movieId, rating, review },
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            alert('리뷰가 제출되었습니다.');
            setReview('');
            setRatings({ ...ratings, [movieId]: undefined });
        } catch (err) {
            alert('리뷰 제출 실패: ' + err);
        }
        window.location.reload();
    };

    const recommendReview = async (reviewId) =>{
        try{
            await axios.post(`${API_URL}/api/recommendUp`, null,{
                params:{reviewId},
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
        }catch (err){
            alert('에러 : '+err);
        }
        window.location.reload();
    }

    const declaration = async (reviewId) => {
        try{
            await  axios.post(`${API_URL}/api/declaration`,null,{
                params:{reviewId},
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true  // 쿠키를 포함하여 요청
            });
        }catch (err){
            alert('에러 : '+err);
        }
        window.location.reload();
    };

    const watchMovie = async (movie) => {
        if (subscribe === true) {
            navigate('/watchMovie', { state: { movie } });
        } else {
            alert('구독한 사람만 볼 수 있습니다.');
        }
    };

    const handleEditMovie = async (movie) => {
        navigate(`/editMovie`, { state: { movie } });
    };
    const handleDeleteMovie = async (movie) => {
        console.log("삭제할 영화 객체:", movie);
        if (!movie || !movie.id) {
            alert('잘못된 영화 정보입니다.');
            return;
        }
        try {
            await axios.delete(`${API_URL}/api/movie/delete/${movie.id}`, {
                withCredentials: true
            });
            alert('영화가 삭제되었습니다.');
            navigate('/');  // 메인 페이지로 이동
        } catch (err) {
            alert('영화 삭제 실패: ' + err);
        }
    };

    if (!movie) {
        return <div>영화 정보를 불러올 수 없습니다.</div>;
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-4">
                    <img
                        src={`${API_URL}${movie.posterUrl}`}
                        alt={movie.posterUrl}
                        className="img-fluid rounded shadow"
                    />
                </div>
                <div className="col-md-8">
                    <div className="card p-4 shadow">
                        <h3 className="card-title">{movie.title}</h3>
                        <p className="card-text">{movie.description}</p>
                        <p>
                            <strong>Release Date: </strong>{movie.releaseDate}
                        </p>
                        <p>
                            <strong>Rating: </strong>{movie.rating}
                        </p>
                        <p>
                            <strong>Genre: </strong>{movie.genre}
                        </p>
                        <p>
                            <strong>Director: </strong>{movie.director}
                        </p>
                        <button className="btn btn-primary" onClick={() => watchMovie(movie)}>영화 보러가기</button>

                        {isAuthorized && (  // 관리자만 수정, 삭제 버튼이 보임
                            <div className="mt-3">
                                <button className="btn btn-warning me-2" onClick={() =>handleEditMovie(movie)}>영화 수정</button>
                                <button className="btn btn-danger" onClick={() => handleDeleteMovie(movie)}>영화 삭제
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {video && (
                <div className="row mt-5">
                    <div className="col">
                        <div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden'}}>
                            <iframe
                                src={`https://www.youtube.com/embed/${video.id.videoId}?rel=0`}
                                title={video.snippet.title}
                                frameBorder="0"
                                style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}

            <div className="row mt-5">
                <div className="col-md-12">
                    <div className="card p-4 shadow">
                        <h4>리뷰 작성</h4>
                        <div className="d-flex justify-content-center align-items-center">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <label key={rating} className="mr-2">
                                    <input
                                        type="radio"
                                        name={`rating-${movie.id}`}
                                        value={rating}
                                        checked={ratings[movie.id] === rating}
                                        onChange={() => handleRatingChange(movie.id, rating)}
                                        style={{display: 'none'}}
                                    />
                                    <span
                                        style={{
                                            fontSize: '1.5em',
                                            cursor: 'pointer',
                                            color: ratings[movie.id] >= rating ? '#FFD700' : '#ccc'
                                        }}
                                    >
                            ★
                        </span>
                                </label>
                            ))}
                        </div>
                        <textarea
                            className="form-control mt-3"
                            name="review_content"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="리뷰 내용을 입력하세요"
                        />
                        <div className="d-flex justify-content-center mt-3">
                            <button className="btn btn-success btn-sm" onClick={() => submitRating(movie.id)}
                                    style={{width: '100px'}}>
                                리뷰 작성
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-5">
                <div className="col-md-12">
                    <h4>리뷰 목록</h4>
                    {reviews.map((re, index) => (
                        re.review.review && (
                            <div key={index} className="card p-3 mb-3 shadow">
                                <p>아이디 : {re.nickname}</p>
                                <p>별점 : {re.review.rating}</p>
                                <p>리뷰내용 : {re.review.review}</p>
                                <p>추천수 : {re.review.recommend}</p>
                                <div className="d-flex justify-content-center">
                                    {re.isLikes ? (
                                        <button className="btn btn-outline-primary btn-sm"
                                                onClick={() => recommendReview(re.review.id)} style={{width: '80px'}}>
                                            추천취소
                                        </button>
                                    ) : (
                                        <button className="btn btn-outline-primary btn-sm"
                                                onClick={() => recommendReview(re.review.id)} style={{width: '80px'}}>
                                            추천하기
                                        </button>
                                    )}
                                    <button className="btn btn-danger btn-sm ms-2"
                                            onClick={() => declaration(re.review.id)} style={{width: '80px'}}>
                                        스포일러
                                    </button>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Description;
