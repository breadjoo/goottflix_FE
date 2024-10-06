import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ChatRoomList({setSelectedRoomId}) {
    const [chatRooms, setChatRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState('');

    // 여기서 useEffect 함수가 시작됩니다.
    useEffect(() => {
        axios.get('http://localhost:8080/api/chatroom')
            .then(response => {
                setChatRooms(response.data);
            })
            .catch(error => {
                console.error('Error fetching chat rooms:', error);
            });
    }, []);  // useEffect 함수 닫는 중괄호를 올바른 위치로 이동



    const createChatRoom = () => {
        if (!newRoomName.trim()) {
            alert("채팅방 이름을 입력하세요");
            return;
        }

        axios.post('http://localhost:8080/api/chatroom/createroom', { name: newRoomName })
            .then(response => {
                console.log("Created Room Response:", response.data);  // ChatRoom 객체가 반환되었는지 확인
                const createdRoom = response.data;

                setChatRooms(prevRooms => [...prevRooms, createdRoom]);
                setNewRoomName('');  // 입력 필드 초기화
            })
            .catch(error => {
                console.error('Error creating chat room:', error);
            });
    };

    return (
        <div>
            <h2>채팅방 목록</h2>
            <ul>
                {chatRooms.map(room => (
                    <li key={room.id}>
                        <Link to={`/chat/${room.id}`}>{room.name}</Link>
                    </li>
                ))}
            </ul>
            {/* 채팅방 생성 기능 추가 */}
            <div>
                <input
                    type="text"
                    placeholder="채팅방 이름"
                    value={newRoomName}
                    onChange={e => setNewRoomName(e.target.value)}
                />
                <button onClick={createChatRoom}>채팅방 생성</button>
            </div>
        </div>
    );
}

export default ChatRoomList;