import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotifyPopup = ({ isOpen, popupRef }) => {
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
                })
                .catch(error => {
                    console.error('Error fetching notifications:', error);

                });
        }
    }, [isOpen]);



    if (!isOpen) return null;

    return (
        <div className="notification-popup" ref={popupRef}>
            <div className="notification-header">
                <h5>알림</h5>
            </div>
            <ul>
                <li className="notification-item"></li>
                {notifications.length > 0 ? (
                    notifications.map((notify) => (
                        <li key={notify.id} className="notification-item">
                            <div className="notification-content">
                                <p>{notify.content}</p>
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