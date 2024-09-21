import React, { useState, useEffect} from 'react';
import axios from "axios";


const NotifyPopup = ({ isOpen, popupRef, userId }) => {
    const [notifications, setNotifications] = useState([]);



    useEffect(() => {
        console.log("isOpen: ", isOpen, "userId: ", userId);
        if (isOpen && userId) {
            // 백엔드에서 알림 데이터를 가져오는 API 호출

            axios.get(`/notify/all/${userId}`, {
                withCredentials: true // 쿠키를 요청에 포함 (필요한 경우)
            })
                .then(response => {
                    setNotifications(response.data); // 알림 데이터를 상태에 저장
                })
                .catch(error => {
                    console.error("알림 데이터를 불러오는 중 오류가 발생했습니다.", error);
                });
        }
    }, [isOpen, userId]);


    if (!isOpen) return null; // 팝업이 열리지 않았으면 렌더링하지 않음

    return (
        <div className="notification-popup" ref={popupRef}>
            <div className="notification-header">
                <h5>알림</h5>
            </div>
            <ul>
                {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                        <li key={index} className="notification-item">
                            <div className="notification-content">
                                <p>{notification.content}</p>
                                <span className="notification-time">{notification.timeAgo}</span>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="notification-item">
                        <div className="notification-content">
                            <p>새로운 알림이 없습니다.</p>
                        </div>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default NotifyPopup;