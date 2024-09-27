import React, { useState, useEffect } from 'react';
import axios from 'axios';


const NotifyPopup = ({ isOpen, popupRef, setUnreadCount }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (isOpen) {
            axios.get('http://localhost:8080/notify/allnotify', {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            })
                .then(response => {
                    setNotifications(response.data);
                    const unread = response.data.filter(notify => !notify.isRead).length;
                    setUnreadCount(unread); // Navbar에 unreadCount 업데이트
                })
                .catch(error => {
                    console.error('Error fetching notifications:', error);
                });
        }
    }, [isOpen, setUnreadCount]);

    const handleReadNotify = (notifyId, userId) => {
        axios.put("http://localhost:8080/notify/read", null, {
            params: {
                userId: userId,
                notifyId: notifyId
            },
            withCredentials: true,
        })
            .then(() => {
                // 알림을 읽음 처리 후 로컬 상태에서 읽음 여부를 업데이트
                setNotifications(prevNotifications =>
                    prevNotifications.map(notification =>
                        notification.id === notifyId ? { ...notification, isRead: true } : notification
                    )
                );
                // 읽지 않은 알림 수 업데이트
                setUnreadCount(prevNotifications =>
                    prevNotifications.filter(notify => !notify.isRead).length
                );
            })
            .catch(error => {
                console.error('알림 업데이트 실패', error);
            });
    };

    const handleDeleteNotify = (notifyId) => {
        axios.delete('http://localhost:8080/notify/deleteNotify', {
            params: { notifyId },
            withCredentials: true,
        })
            .then(() => {
                setNotifications(prevNotifications =>
                    prevNotifications.filter(notification => notification.id !== notifyId)
                );
            })
            .catch(error => {
                console.error('알림 삭제 실패', error);
            });
    };

    if (!isOpen) return null;

    return (
        <div className="notification-popup" ref={popupRef}>
            <div className="notification-header">
                <h5>알림</h5>
            </div>
            <ul>
                {notifications.length > 0 ? (
                    notifications.map((notify) => (
                        <li key={notify.id} className="notification-item"
                            style={{ backgroundColor: notify.isRead ? 'white' : '#f0f0f0' }}
                            onClick={() => handleReadNotify(notify.id, notify.userId)}>
                            <img
                                src={notify.notifyType === 'friendAdd'
                                    ? '/addfriendicon.png'
                                    : '/movienotify.png'
                                }
                                alt="icon"
                                className="notification-icon"
                            />
                            <div className="notification-content">
                                <a href={notify.url}>{notify.content}</a>
                            </div>
                            <img
                                src='/deleteicon.png'
                                alt="삭제 아이콘"
                                className='delete-icon'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteNotify(notify.id);
                                }}
                            />
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