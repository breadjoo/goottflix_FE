import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import '../css/ChatRoom.css';

function ChatRoom({ roomId }) {
    const [messages, setMessages] = useState([]);  // 채팅 메시지 목록
    const [stompClient, setStompClient] = useState(null);  // WebSocket 클라이언트
    const [messageInput, setMessageInput] = useState('');  // 텍스트 입력 필드
    const [sender, setSender] = useState('');  // 현재 사용자
    const [roomName, setRoomName] = useState('');  // 채팅방 이름
    const [image, setImage] = useState(null);  // 업로드된 이미지 URL
    const messageEndRef = useRef(null);  // 스크롤 제어를 위한 ref

    // 채팅 메시지 목록을 받아왔을 때 스크롤을 맨 아래로 이동시키는 함수
    const scrollToBottom = () => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };


    // 메시지가 업데이트될 때마다 자동 스크롤
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 채팅방 정보 및 유저 정보 가져오기
    useEffect(() => {
        if (!roomId) return;

        // 채팅방 이름 가져오기
        axios.get(`http://localhost:8080/api/chatroom/${roomId}/name`)
            .then(response => setRoomName(response.data))
            .catch(error => console.log("채팅방 이름을 가져오는데 실패함", error));

        // 현재 유저 정보 가져오기
        axios.get("http://localhost:8080/api/chatroom/getusername", { withCredentials: true })
            .then(response => setSender(response.data.username))
            .catch(error => console.error("Error fetching user information:", error));

        // 기존 메시지 목록 가져오기
        axios.get(`http://localhost:8080/api/message/${roomId}`)
            .then(response => setMessages(response.data))
            .catch(error => console.error('Error fetching messages:', error));

        // WebSocket 연결 설정
        const socket = new SockJS('http://localhost:8080/ws/chat');
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: (str) => console.log(str),
        });

        // WebSocket 연결 성공 시 메시지 구독 설정
        client.onConnect = () => {
            console.log('Connected to WebSocket');
            client.subscribe(`/topic/chat/${roomId}`, (message) => {
                const newMessage = JSON.parse(message.body);
                setMessages(prevMessages => [...prevMessages, newMessage]);
            });
        };

        // WebSocket 오류 처리
        client.onStompError = (error) => console.error('WebSocket error:', error);

        client.activate();  // WebSocket 활성화
        setStompClient(client);

        // 컴포넌트가 사라질 때 WebSocket 연결 해제
        return () => {
            if (client) client.deactivate();
        };
    }, [roomId]);


// 파일 업로드 처리 및 URL 반환
        const uploadFile = async (file) => {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axios.post('http://localhost:8080/api/upload/image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                });
                return response.data;  // 서버에서 반환된 이미지 URL
            } catch (error) {
                console.error('파일 업로드 실패:', error);
                return null;
            }
        };

    // 이미지 파일을 업로드하고 URL을 저장
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileUrl = await uploadFile(file);  // 파일 업로드 후 URL 받기
            if (fileUrl) {
                setImage(fileUrl);  // 업로드된 이미지 URL 저장
            }
        }
    };

    // 메시지 전송 함수 (텍스트 또는 이미지 URL)
    const sendMessage = () => {
        if (stompClient && (messageInput || image)) {
            const chatMessage = {
                sender: sender,
                message: image ? image : messageInput,  // 이미지가 있으면 URL 전송
                roomId: roomId,
                type: image ? 'IMAGE' : 'TEXT'  // 메시지 타입 구분
            };
            stompClient.publish({
                destination: '/app/chat',
                body: JSON.stringify(chatMessage),
            });
            setMessageInput('');  // 입력 필드 초기화
            setImage(null);  // 이미지 초기화
        }
    };

    // 엔터 키로 메시지 전송
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    };

    // 타임스탬프 포맷 함수
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <div className="chat-container">
            <h2 className="chat-header">{roomName}</h2>
            <div className="chat-message-container">
                {messages.map(msg => (
                    <div key={msg.id} className={`message ${msg.sender === sender ? 'message-right' : 'message-left'}`}>
                        <div className="sender">{msg.sender}</div>
                        {/* 메시지 타입에 따라 텍스트 또는 이미지 렌더링 */}
                        {msg.type === 'IMAGE' ? (
                            <img src={msg.message} alt="전송된 이미지" className="chat-image" />
                        ) : (
                            <div>{msg.message}</div>
                        )}
                        <div className="timestamp">{formatTimestamp(msg.timestamp)}</div>
                    </div>
                ))}
                {/* 스크롤을 자동으로 맞추기 위한 ref */}
                <div ref={messageEndRef} />
            </div>
            <div className="message-input-container">
                {/* 파일 업로드 입력 필드 */}
                <input type="file" accept="image/*" onChange={handleFileUpload} />
                {/* 텍스트 입력 필드 */}
                <input
                    type="text"
                    placeholder="메시지를 입력하세요"
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="message-input"
                />
                <button onClick={sendMessage} className="send-button">전송</button>
            </div>
        </div>
    );
}

export default ChatRoom;