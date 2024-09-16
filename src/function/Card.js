import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

function KitchenSinkExample() {
    return (
        <Card style={{ width: '18rem', backgroundColor: '#001f3f', color: 'white' }}> {/* 네이비 배경, 흰색 텍스트 */}
            <Card.Img variant="top" src="/images/에일리언.jpg" alt="Movie Poster" />
            <Card.Body>
                <Card.Title style={{ color: '#00bfff' }}>에일리언</Card.Title> {/* 영화 제목을 밝은 색상으로 */}
                <Card.Text>
                    폐쇄된 공간에서 펼쳐지는 압도적인 공포를 느껴라!
                </Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush" style={{ backgroundColor: '#000', color: 'white' }}> {/* 검은색 배경 */}
                <ListGroup.Item style={{ backgroundColor: '#001f3f', color: 'white' }}>내 예상 별점</ListGroup.Item> {/* 네이비 배경 */}
                <ListGroup.Item style={{ backgroundColor: '#001f3f', color: 'white' }}>영화 평균 별점</ListGroup.Item>
            </ListGroup>
            <Card.Body className="d-flex justify-content-between">
                <Button variant="outline-light" href="#">영화 상세</Button> {/* 흰색 테두리 버튼 */}
                <Button variant="outline-light" href="#">리뷰 달기</Button>
            </Card.Body>
        </Card>
    );
}

export default KitchenSinkExample;
