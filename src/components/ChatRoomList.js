import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/ChatRoomList.css';

function ChatRoomList({ setSelectedRoomId }) {
    const [chatRooms, setChatRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState('');
    const [userRole, setUserRole] = useState('');  // 사용자 역할 상태
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    useEffect(() => {
        // 채팅방 목록 가져오기
        axios.get(`${API_URL}/api/chatroom`)
            .then(response => {
                setChatRooms(Array.isArray(response.data) ? response.data : []);
            })
            .catch(error => {
                console.error('Error fetching chat rooms:', error);
                setChatRooms([]);  // 에러 시 빈 배열로 설정
            });

        // 사용자 역할 가져오기
        axios.get(`${API_URL}/api/chatroom/getRole`, { withCredentials: true })
            .then(response => {
                setUserRole(response.data);  // 사용자 권한 설정
            })
            .catch(error => {
                console.error('Error fetching user role:', error);
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

    const deleteChatRoom = (roomId) => {
        if (window.confirm("정말로 이 채팅방을 삭제하시겠습니까?")) {
            axios.delete(`${API_URL}/api/chatroom/${roomId}`)
                .then(() => {
                    setChatRooms(prevRooms => prevRooms.filter(room => room.id !== roomId));
                })
                .catch(error => {
                    console.error('Error deleting chat room:', error);
                });
        }
    };

    return (
        <div className="chatroom-list-container">
            <div className="chatroom-header">
                <h2>채팅방 목록</h2>
            </div>
            <ul className="chatroom-list">
                {Array.isArray(chatRooms) && chatRooms.map(room => (
                    <li key={room.id} className="chatroom-item">
                        <span onClick={() => setSelectedRoomId(room.id)}>{room.name}</span>
                        {/* ROLE_ADMIN인 경우에만 삭제 버튼 보이기 */}
                        {userRole === 'ROLE_ADMIN' && (
                            <button className="delete-button" onClick={() => deleteChatRoom(room.id)}>
                                삭제
                            </button>
                        )}
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