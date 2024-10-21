import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const NotifyPopup = ({ isOpen, popupRef, setUnreadCount }) => {
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            axios.get(`${API_URL}/notify/allnotify`, {
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
        axios.put(`${API_URL}/notify/read`, null, {
            params: {
                userId: userId,
                notifyId: notifyId
            },
            withCredentials: true,
        })
            .then(() => {
                // 알림을 읽음 처리 후 로컬 상태에서 읽음 여부를 업데이트
                setNotifications(prevNotifications =>
                    Array.isArray(prevNotifications) ? prevNotifications.map(notification =>
                        notification.id === notifyId ? { ...notification, isRead: true } : notification
                    ) : []
                );

                // 읽지 않은 알림 수를 새로 계산해서 업데이트
                setUnreadCount(notifications =>
                    Array.isArray(notifications) ? notifications.filter(notify => !notify.isRead).length : 0
                );
            })
            .catch(error => {
                console.error('알림 업데이트 실패', error);
            });
    };

    const handleDeleteNotify = (notifyId) => {
        axios.delete(`${API_URL}/notify/deleteNotify`, {
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

    const handleNavigate = (notify) => {
        return() => {
            navigate(notify.url, { state: { movieId: notify.movieId }});
        };
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
                                src={notify.notifyType === 'friendadd'
                                    ? '/addfriendicon.png'
                                    : '/movienotify.png'
                                }
                                alt="icon"
                                className="notification-icon"
                            />
                            <div className="notification-content">

                                <p onClick={handleNavigate(notify)} style={{ cursor: 'pointer' }}>
                                    {notify.content}
                                </p>
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