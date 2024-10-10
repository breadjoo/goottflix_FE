// ChatLayout.js
import React, { useState } from 'react';
import ChatRoomList from './ChatRoomList';
import ChatRoom from './ChatRoom';
import '../css/ChatLayout.css'; // 레이아웃 스타일 파일 추가

function ChatLayout() {
    const [selectedRoomId, setSelectedRoomId] = useState(null); // 선택된 채팅방 ID 상태

    return (
        <div className="chat-layout-container">
            {/* 채팅방 목록 */}
            <div className="chatroom-list-panel">
                <ChatRoomList setSelectedRoomId={setSelectedRoomId} />
            </div>

            {/* 선택된 채팅방 표시 */}
            <div className="chatroom-content-panel">
                {selectedRoomId ? (
                    <ChatRoom roomId={selectedRoomId} />
                ) : (
                    <div className="chatroom-placeholder">
                        채팅방을 선택하세요
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatLayout;