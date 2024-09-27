import {useEffect} from 'react';

function NotificationComponent() {

    useEffect(() => {
        const eventSource = new EventSource(`http://localhost:8080/notify/subscribe`,
            {withCredentials: true});

        eventSource.addEventListener("notify", function (event) {
            const notifyData = JSON.parse(event.data);
            console.log("New notification:", notifyData);


        });

        eventSource.onerror = function(event) {
            console.error("SSE connection error:", event);
        };


        return () => {
            eventSource.close();
        };
    }, []);

    return null;
}

export default NotificationComponent;