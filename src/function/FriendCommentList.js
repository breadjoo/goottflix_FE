import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, Row, Col, Dropdown } from 'react-bootstrap';

const FriendCommentList = () => {
    const [comments, setComments] = useState([]);
    const [username, setUsername] = useState('');
    const [sortKey, setSortKey] = useState('reviewDate');
    const [sortDirection, setSortDirection] = useState('asc'); // 'asc' 또는 'desc'
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const { friendId } = useParams(); // friendId를 URL 경로에서 받아옴

    useEffect(() => {
        const fetchComments = () => {
            axios
                .get(`${API_URL}/api/friend/comment/${friendId}`, { withCredentials: true }) // 친구의 ID로 요청
                .then((response) => {
                    setComments(response.data);
                    if (response.data.length > 0) {
                        setUsername(response.data[0].username); // 첫 번째 영화의 사용자 이름을 가져옴
                    }
                })
                .catch((error) => {
                    console.error('Error fetching comments:', error);
                });
        };

        fetchComments();
    }, [API_URL, friendId]);

    // 정렬 기준에 따라 코멘트 목록 정렬
    const sortComments = (comments, key, direction) => {
        const sortedComments = [...comments];
        sortedComments.sort((a, b) => {
            let comparison = 0;
            if (key === 'title' || key === 'genre') {
                comparison = a[key].localeCompare(b[key]);
            } else if (key === 'releaseDate' || key === 'reviewDate') {
                comparison = new Date(a[key]) - new Date(b[key]);
            } else if (key === 'myRating' || key === 'recommend') {
                comparison = a[key] - b[key];
            }
            return direction === 'asc' ? comparison : -comparison;
        });
        return sortedComments;
    };

    // 정렬 기준 및 방향 변경 핸들러
    const handleSortChange = (key) => {
        if (sortKey === key) {
            // 같은 키를 선택하면 정렬 방향을 변경
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // 다른 키를 선택하면 정렬 키 변경, 방향은 기본적으로 'asc'
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">{username} 님이 남긴 코멘트</h2>

            {/* 정렬 기준 선택 */}
            <Dropdown className="mb-4">
                <Dropdown.Toggle style={{ backgroundColor: '#003857' }} variant="primary" id="dropdown-basic">
                    정렬 기준 선택
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleSortChange('title')}>제목</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortChange('releaseDate')}>개봉일</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortChange('genre')}>장르</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortChange('myRating')}>내 평점</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortChange('recommend')}>추천 수</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortChange('reviewDate')}>리뷰 남긴 날짜</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            {/* 정렬된 코멘트 목록 표시 */}
            <Row>
                {sortComments(comments, sortKey, sortDirection).map((comment, index) => (
                    <Col key={index} md={12} className="mb-4">
                        <Card className="shadow-sm">
                            <Card.Body>
                                <div className="d-flex">
                                    <img
                                        src={`${API_URL}${comment.posterUrl}`}
                                        alt={comment.title}
                                        style={{ width: '200px', height: '300px', objectFit: 'cover', marginRight: '15px' }}
                                    />
                                    <div>
                                        <h5>{comment.title}</h5>
                                        <p><strong>개봉일 :</strong> {comment.releaseDate}</p>
                                        <p><strong>장르 :</strong> {comment.genre}</p>
                                        <p><strong>내 평점 :</strong> {comment.myRating}점</p>
                                        <p><strong>코멘트 : </strong>{comment.review}</p>
                                        <p>좋아요 : {comment.recommend}</p>
                                        <p>스포일러 {comment.spoiler ? `신고:${comment.spoiler}` : 'X'}</p>
                                        <small className="text-muted">리뷰 날짜: {comment.reviewDate}</small>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default FriendCommentList;
