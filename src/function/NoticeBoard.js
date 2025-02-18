import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Modal, Form } from "react-bootstrap";

const NoticeBoard = () => {
    const [notices, setNotices] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    useEffect(() => {
        axios.get(`${API_URL}/api/notice/list`)
            .then(response => {
                setNotices(response.data);
            })
            .catch(error => {
                console.error("Error fetching notices:", error);
            });
    }, []);

    const handleClose = () => setShow(false);
    const handleShow = (notice) => {
        setSelectedNotice(notice);
        setShow(true);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">공지사항</h2>
            <div className="row">
                {notices.map((notice) => (
                    <div key={notice.id} className="col-12 mb-4">
                        <Card className="d-flex flex-row">
                            {notice.image && <Card.Img variant="left" src={notice.image} alt="공지 이미지" style={{ width: '150px', objectFit: 'cover' }} />}
                            <Card.Body>
                                <Card.Title>{notice.title}</Card.Title>
                                <Card.Text>{notice.content.substring(0, 100)}...</Card.Text>
                                <Button variant="primary" type="submit" className="mt-4" style={{ backgroundColor: '#001f3f', borderColor: '#001f3f' }} onClick={() => handleShow(notice)}>
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
