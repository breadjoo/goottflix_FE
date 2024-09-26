import { useEffect } from 'react';

function NotificationComponent() {
    useEffect(() => {// 쿠키에서 토큰 가져오기
        const eventSource = new EventSource(`http://localhost:8080/notify/subscribe`,
            {withCredentials: true});

        eventSource.addEventListener("notify", function (event) {
            const notifyData = JSON.parse(event.data);
            console.log("New notification:", notifyData);
        });

        return () => {
            eventSource.close();
        };
    }, []);

    return null;
}

export default NotificationComponent;