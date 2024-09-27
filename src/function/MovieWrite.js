import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

const MovieWrite = () => {
  const [formData, setFormData] = useState({
    title: '',
    intro: '',
    description: '',
    releaseDate: '',
    genre: '',
    director: '',
    file: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    fetch('http://localhost:8080/api/movie/write', {
      method: 'POST',
      body: data,
    })
        .then((response) => {
          // 응답의 상태 코드를 먼저 확인
          if (!response.ok) {
            throw new Error('서버 응답에 문제가 있습니다.');
          }

          // 응답이 JSON일 때만 처리
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            return response.json(); // JSON 응답 처리
          } else {
            return response.text(); // 텍스트 응답 처리
          }
        })
        .then((data) => {
          // 서버 응답이 JSON일 때 처리
          if (typeof data === 'object') {
            console.log('Success:', data);
            alert('영화 작성이 성공적으로 처리되었습니다!');
          } else {
            // 서버 응답이 텍스트인 경우에도 처리
            console.log('Success (Text):', data);
            alert('영화 작성이 성공적으로 처리되었습니다!');
          }
          window.location.reload(); // 페이지 새로고침
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('오류가 발생했습니다. 다시 시도해주세요.');
        });
  };
  return (
      <Container className="mt-5" style={{ maxWidth: '500px' }}>
        <h2 className="text-center" style={{ color: '#001f3f' }}>영화 작성</h2>
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

          <Form.Group controlId="formIntro" className="mt-3">
            <Form.Label>한줄설명</Form.Label>
            <Form.Control
                as="textarea"
                name="intro"
                placeholder="한줄설명"
                value={formData.intro}
                onChange={handleChange}
                rows={2}
                required
            />
          </Form.Group>

          <Form.Group controlId="formDescription" className="mt-3">
            <Form.Label>설명</Form.Label>
            <Form.Control
                as="textarea"
                name="description"
                placeholder="설명"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                required
            />
          </Form.Group>

          <Form.Group controlId="formReleaseDate" className="mt-3">
            <Form.Label>개봉일</Form.Label>
            <Form.Control
                type="date"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                required
            />
          </Form.Group>

          <Form.Group controlId="formGenre" className="mt-3">
            <Form.Label>장르</Form.Label>
            <Form.Control
                type="text"
                name="genre"
                placeholder="장르 (여러개일때는 '_'를 써서 구분해주세요)"
                value={formData.genre}
                onChange={handleChange}
                required
            />
          </Form.Group>

          <Form.Group controlId="formDirector" className="mt-3">
            <Form.Label>감독</Form.Label>
            <Form.Control
                type="text"
                name="director"
                placeholder="감독"
                value={formData.director}
                onChange={handleChange}
                required
            />
          </Form.Group>

          <Form.Group controlId="formFile" className="mt-3">
            <Form.Label>파일 업로드</Form.Label>
            <Form.Control
                type="file"
                name="file"
                onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-4" style={{ backgroundColor: '#001f3f', borderColor: '#001f3f' }}>
            작성
          </Button>
        </Form>
      </Container>
  );
};

export default MovieWrite;
