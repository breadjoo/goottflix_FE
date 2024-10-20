// ChatRoom.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import '../css/ChatRoom.css';

function ChatRoom({ roomId }) {  // props로 roomId 받기
    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [sender, setSender] = useState('');
    const [roomName, setRoomName] = useState('');
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    useEffect(() => {
        if (!roomId) return; // roomId가 없으면 실행하지 않음

        axios.get(`${API_URL}/api/chatroom/${roomId}/name`)
            .then(response => {
                setRoomName(response.data);
            })
            .catch(error => {
                console.log("채팅방 이름을 가져오는데 실패함", error);
            });

        axios.get(`${API_URL}/api/chatroom/getusername`, { withCredentials: true })
            .then(response => {
                setSender(response.data.username);
            })
            .catch(error => {
                console.error("Error fetching user information:", error);
            });

        axios.get(`${API_URL}/api/message/${roomId}`)
            .then(response => {
                setMessages(response.data);
            })
            .catch(error => {
                console.error('Error fetching messages:', error);
            });

        const socket = new SockJS(`${API_URL}/ws/chat`);
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: (str) => console.log(str),
        });

        client.onConnect = () => {
            console.log('Connected to WebSocket');
            client.subscribe(`/topic/chat/${roomId}`, (message) => {
                const newMessage = JSON.parse(message.body);
                setMessages(prevMessages => [...prevMessages, newMessage]);
            });
        };

        client.onStompError = (error) => {
            console.error('WebSocket error:', error);
        };

        client.activate();
        setStompClient(client);

        return () => {
            if (client) {
                client.deactivate();
            }
        };
    }, [roomId]);

    const sendMessage = () => {
        if (stompClient && messageInput) {
            const chatMessage = {
                sender: sender,
                message: messageInput,
                roomId: roomId,
            };
            stompClient.publish({
                destination: '/app/chat',
                body: JSON.stringify(chatMessage),
            });
            setMessageInput('');
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    }

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
                    <div
                        key={msg.id}
                        className={`message ${msg.sender === sender ? 'message-right' : 'message-left'}`}
                    >
                        <div className="sender">{msg.sender}</div>
                        <div>{msg.message}</div>
                        <div className="timestamp">
                            {formatTimestamp(msg.timestamp)}
                        </div>
                    </div>
                ))}
            </div>
            <div className="message-input-container">
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