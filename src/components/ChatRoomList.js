// ChatRoomList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/ChatRoomList.css';

function ChatRoomList({ setSelectedRoomId }) {
    const [chatRooms, setChatRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState('');
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    useEffect(() => {
        axios.get(`${API_URL}/api/chatroom`)
            .then(response => {
                // 응답 데이터가 배열인지 확인 후 설정
                setChatRooms(Array.isArray(response.data) ? response.data : []);
            })
            .catch(error => {
                console.error('Error fetching chat rooms:', error);
                setChatRooms([]); // 에러 시 빈 배열로 설정
            });
    }, []);


    const createChatRoom = () => {
        if (!newRoomName.trim()) {
            alert("채팅방 이름을 입력하세요");
            return;
        }

        axios.post(`${API_URL}/api/chatroom/createroom`, { name: newRoomName })
            .then(response => {
                const createdRoom = response.data;
                setChatRooms(prevRooms => [...prevRooms, createdRoom]);
                setNewRoomName('');
            })
            .catch(error => {
                console.error('Error creating chat room:', error);
            });
    };

    return (
        <div className="chatroom-list-container">
            <div className="chatroom-header">
                <h2>채팅방 목록</h2>
            </div>
            <ul className="chatroom-list">
                {Array.isArray(chatRooms) && chatRooms.map(room => (
                    <li key={room.id} className="chatroom-item" onClick={() => setSelectedRoomId(room.id)}>
                        <span>{room.name}</span>
                    </li>
                ))}
            </ul>

            <div className="chatroom-create-container">
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