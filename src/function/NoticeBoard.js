import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NoticeBoard = () => {
    const [notices, setNotices] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);  // 🔹 관리자 권한 확인용
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    // 공지 리스트 불러오기 + 권한 체크
    useEffect(() => {
        axios.get(`${API_URL}/api/notice/list`)
            .then(response => {
                setNotices(response.data);
            })
            .catch(error => {
                console.error("Error fetching notices:", error);
            });

        axios.get(`${API_URL}/api/user`, { withCredentials: true })  // 🔹 유저 정보 요청
            .then(response => {
                const { role } = response.data;
                if (role === 'ROLE_ADMIN') {
                    setIsAdmin(true);
                }
            })
            .catch(error => {
                console.warn("관리자 여부 확인 실패:", error);
                // 로그인 안 되어있으면 그냥 무시
            });
    }, []);

    const handleClose = () => setShow(false);
    const handleShow = (notice) => {
        setSelectedNotice(notice);
        setShow(true);
    };

    const handleWriteClick = () => {
        navigate("/noticeWrite");
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>공지사항</h2>
                {isAdmin && (
                    <Button
                        variant="success"
                        onClick={handleWriteClick}
                        style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}
                    >
                        공지 작성
                    </Button>
                )}
            </div>

            <div className="row">
                {notices.map((notice) => (
                    <div key={notice.id} className="col-12 mb-4">
                        <Card className="d-flex flex-row">
                            {notice.image && <Card.Img variant="left" src={notice.image} alt="공지 이미지" style={{ width: '150px', objectFit: 'cover' }} />}
                            <Card.Body>
                                <Card.Title>{notice.title}</Card.Title>
                                <Card.Text>
                                    {notice.content.length > 100
                                        ? `${notice.content.substring(0, 100)}...`
                                        : notice.content}
                                </Card.Text>
                                <Button
                                    variant="primary"
                                    className="mt-4"
                                    style={{ backgroundColor: '#001f3f', borderColor: '#001f3f' }}
                                    onClick={() => handleShow(notice)}
                                >
                                    자세히 보기
                                </Button>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedNotice?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedNotice?.image && <img src={selectedNotice.image} alt="공지 이미지" className="img-fluid mb-3" />}
                    <p>{selectedNotice?.content}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        닫기
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default NoticeBoard;
