import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

function ChatRoom() {
    const { roomId } = useParams();
    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [sender, setSender] = useState('');

    useEffect(() => {

        axios.get("http://localhost:8080/api/chatroom/getusername", { withCredentials: true })
            .then(response => {
                setSender(response.data.username);  // 서버에서 반환된 사용자 이름을 설정
            })
            .catch(error => {
                console.error("Error fetching user information:", error);
            });

        // 기존 메시지 가져오기
        axios.get(`http://localhost:8080/api/message/${roomId}`)
            .then(response => {
                setMessages(response.data);
            })
            .catch(error => {
                console.error('Error fetching messages:', error);
            });

        // WebSocket 연결 설정
        const socket = new SockJS('http://localhost:8080/ws/chat');
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

        // 컴포넌트 언마운트 시 연결 해제
        return () => {
            if (client) {
                client.deactivate();
            }
        };
    }, [roomId]);

    const sendMessage = () => {
        if (stompClient && messageInput) {
            const chatMessage = {
                sender: sender, // 메시지에 sender 추가
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

    return (
        <div>
            <h2>채팅방 {roomId}</h2>
            <div>
                {messages.map(msg => (
                    <div key={msg.id}>
                        <strong>{msg.sender}:</strong> {msg.message}
                    </div>
                ))}
            </div>
            <div>
                <input
                    type="text"
                    placeholder="메시지를 입력하세요"
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}

                />
                <button onClick={sendMessage}>전송</button>
            </div>
        </div>
    );
}

export default ChatRoom;