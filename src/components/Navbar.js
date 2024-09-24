import React, {useState, useRef, useEffect} from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css'; // CSS 파일 임포트
import NotifyPopup from "./NotifyPopup";
import axios from "axios";


const Navbar = () => {

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const popupRef = useRef(null);
    const [unreadCount, setUnreadCount] = useState(0);


    const togglePopup = () => {
        setIsPopupOpen(true);
    }


    // 메뉴를 수동으로 닫는 함수임
    const closeMenu = () => {
        const navbar = document.getElementById('navbarNav');
        if (navbar.classList.contains('show')) {
            navbar.classList.remove('show');
        }
    };

    // 2. 페이지 외부 클릭 시 팝업을 닫는 함수
    const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            setIsPopupOpen(false); // 팝업 외부를 클릭하면 팝업을 닫음
        }
    };

    // 3. 페이지 렌더링 시 클릭 이벤트 등록
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside); // 마우스 클릭 이벤트 리스너 추가
        return () => {
            document.removeEventListener('mousedown', handleClickOutside); // 컴포넌트가 언마운트될 때 리스너 제거
        };
    }, []);


    // 알림 개수 가져오기
    useEffect(() => {
        axios.get('http://localhost:8080/notify/allnotify', {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true,
        })
            .then(response => {
                const unread = response.data.filter(notify => !notify.isRead).length;
                setUnreadCount(unread); // 읽지 않은 알림 개수 설정
            })
            .catch(error => {
                console.error('Error fetching notifications:', error);
            });
    }, []);


    window.IMP.init("imp77446200");

    const onClickPay = async () => {
        window.IMP.request_pay({
            pg: "kakaopay",
            pay_method: "card",
            amount: "10",
            name: "구독",
            merchant_uid: "ord20240920-000021",
        }, function(response){

        });
    };



    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#001f3f' }}>
            <div className="container-fluid">
                <Link className="navbar-brand" to="/" onClick={closeMenu}>
                    <img
                        src="/images/goottflix.png"
                        alt="GoottFlix Logo"
                        style={{ height: '60px' }}
                    />  GoottFlix
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <button className="payment-button" type="button" onClick={onClickPay}>
                                구독
                            </button>
                        </li>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/"
                                  onClick={closeMenu}>메인페이지</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/signup" onClick={closeMenu}>회원가입</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/login" onClick={closeMenu}>로그인</Link>
                        </li>
                        <li className='nav-item'>
                            <Link className='nav-link' to="/friend" onClick={closeMenu}>친구</Link>
                        </li>

                        {/* 알림 아이콘 */}
                        <li className="nav-item">
                            <button className="btn btn-link nav-link" onClick={togglePopup} style={{ position: 'relative' }}>
                                <img src="/notify.png" alt="알림 아이콘" style={{ width: '24px' }} />
                                {unreadCount > 0 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '-5px',
                                        right: '-10px',
                                        backgroundColor: 'red',
                                        color: 'white',
                                        borderRadius: '50%',
                                        padding: '2px 6px',
                                        fontSize: '12px',
                                    }}>
                                            {unreadCount}
                                        </span>
                                )}
                            </button>
                            <NotifyPopup isOpen={isPopupOpen} popupRef={popupRef} setUnreadCount={setUnreadCount} />
                        </li>
                    </ul>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
