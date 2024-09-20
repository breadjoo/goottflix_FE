import React from 'react';

const NotifyPopup = ({ isOpen, popupRef }) => {
    if (!isOpen) return null; // 팝업이 열리지 않았으면 렌더링하지 않음

    return (
        <div className="notification-popup" ref={popupRef}>
            <div className="notification-header">
                <h5>알림</h5>
            </div>
            <ul>
                <li className="notification-item">
                    <div className="notification-content">
                        <p>회원님이 로그인을 승인했습니다.</p>
                        <span className="notification-time">방금 전</span>
                    </div>
                </li>
                <li className="notification-item">
                    <div className="notification-content">
                        <p>안동근님과 범준손님의 생일이 하루 지났습니다.</p>
                        <span className="notification-time">1일 전</span>
                    </div>
                </li>
                {/* 알림 항목 추가 */}
            </ul>
        </div>
    );
};

export default NotifyPopup;