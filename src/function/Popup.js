// components/Popup.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/Popup.css';

function Popup() {
    const location = useLocation();
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const hasSeenPopup = localStorage.getItem('hidePopup');
        if (location.pathname === '/' && !hasSeenPopup) {
            setShowPopup(true);
        }
    }, [location]);

    const handleClose = () => {
        setShowPopup(false);
    };

    const handleDoNotShowAgain = () => {
        localStorage.setItem('hidePopup', 'true');
        setShowPopup(false);
    };

    if (!showPopup) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>📢 로그인 후 이용해주세요.</h2>
                <p>ID : admin</p>
                <p>PW : 1234</p>
                <div className="popup-buttons">
                    <button onClick={handleClose}>닫기</button>
                    <button onClick={handleDoNotShowAgain}>다시 보지 않기</button>
                </div>
            </div>
        </div>
    );
}

export default Popup;
