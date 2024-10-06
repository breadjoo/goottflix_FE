// ChatPage.js
import React, { useState } from 'react';
import ChatRoomList from './ChatRoomList';
import ChatRoom from './ChatRoom';

function ChatPage() {
    const [selectedRoomId, setSelectedRoomId] = useState(null);  // 선택된 채팅방 ID 상태 관리

    return (
        <div style={{ display: 'flex' }}>
            {/* 채팅방 목록 */}
            <div style={{ width: '30%', borderRight: '1px solid #ccc', padding: '10px' }}>
                <ChatRoomList setSelectedRoomId={setSelectedRoomId} />
            </div>

            {/* 채팅방 내용 */}
            <div style={{ width: '70%', padding: '10px' }}>
                {selectedRoomId ? (
                    <ChatRoom roomId={selectedRoomId} />
                ) : (
                    <div>채팅방을 선택하세요.</div>
                )}
            </div>
        </div>
    );
}

export default ChatPage;