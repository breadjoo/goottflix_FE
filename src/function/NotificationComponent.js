import {useEffect} from 'react';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function NotificationComponent({ setUnreadCount, setNotifications }) {

    useEffect(() => {
        const eventSource = new EventSource(`${API_URL}/notify/subscribe`,
            {withCredentials: true});

        eventSource.addEventListener("notify", function (event) {
            const notifyData = JSON.parse(event.data);
            console.log("New notification:", notifyData);

            // 새로운 알림을 받으면 알림 목록에 추가
            setNotifications(prevNotifications => [...prevNotifications, notifyData]);

            // 읽지 않은 알림 수 증가
            setUnreadCount(prevUnreadCount => prevUnreadCount + 1);
        });

        eventSource.onerror = function(event) {
            console.error("SSE connection error:", event);
        };


        return () => {
            eventSource.close();
        };
    }, [setUnreadCount, setNotifications]);

    return null;
}

export default NotificationComponent;