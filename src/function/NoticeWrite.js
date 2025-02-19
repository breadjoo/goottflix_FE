import React, { useEffect, useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const NoticeWrite = () => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: null,
        password: '',
    });
    const [writer, setWriter] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/user`, { withCredentials: true });
                const { username } = response.data; // user ID (writer)
                setWriter(username);
                setIsAuthorized(true);
            } catch (err) {
                console.error('Failed to fetch user info', err);
                alert('로그인이 필요합니다.');
                navigate('/login');
            }
        };

        fetchUserInfo();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!writer) {
            alert("사용자 정보를 불러오는 중입니다.");
            return;
        }

        const notice = {
            title: formData.title,
            content: formData.content,
            password: formData.password,
        };

        const formDataToSend = new FormData();
        formDataToSend.append("notice", new Blob([JSON.stringify(notice)], { type: "application/json" }));

        if (formData.image) {
            formDataToSend.append("file", formData.image);
        }

        try {
            const response = await axios.post(`${API_URL}/api/notice/create`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });

            alert("공지사항이 성공적으로 작성되었습니다!");
            navigate("/noticeBoard");
        } catch (error) {
            console.error("Error:", error);
            alert("오류가 발생했습니다. 다시 시도해주세요.");
        }
    };



    if (!isAuthorized) {
        return <div>권한을 확인 중입니다...</div>;
    }

    return (
        <Container className="mt-5" style={{ maxWidth: '500px' }}>
            <h2 className="text-center" style={{ color: '#001f3f' }}>공지사항 작성</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formTitle">
                    <Form.Label>제목</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        placeholder="제목"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formContent" className="mt-3">
                    <Form.Label>내용</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="content"
                        placeholder="내용을 입력하세요"
                        value={formData.content}
                        onChange={handleChange}
                        rows={5}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formImage" className="mt-3">
                    <Form.Label>이미지 업로드</Form.Label>
                    <Form.Control
                        type="file"
                        name="image"
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mt-3">
                    <Form.Label>비밀번호</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        placeholder="비밀번호 입력"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-4" style={{ backgroundColor: '#001f3f', borderColor: '#001f3f' }}>
                    작성
                </Button>
            </Form>
        </Container>
    );
};

export default NoticeWrite;
