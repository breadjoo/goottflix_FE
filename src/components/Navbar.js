import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css'; // CSS 파일 임포트
import NotifyPopup from "./NotifyPopup";
import FriendPopup from "./Friend"; // 친구 팝업 컴포넌트 임포트
import axios from "axios";
import NotificationComponent from "../function/NotificationComponent";


const Navbar = () => {
    const [username, setUsername] = useState(null); // 사용자 이름 상태
    const [isNotifyPopupOpen, setIsNotifyPopupOpen] = useState(false);
    const [isFriendPopupOpen, setIsFriendPopupOpen] = useState(false);
    const notifyPopupRef = useRef(null);
    const friendPopupRef = useRef(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);


    // 알림 팝업 토글
    const toggleNotifyPopup = () => {
        setIsNotifyPopupOpen(!isNotifyPopupOpen);
    };

    // 메뉴를 수동으로 닫는 함수임
    const closeMenu = () => {
        const navbar = document.getElementById('navbarNav');
        if (navbar.classList.contains('show')) {
            navbar.classList.remove('show');
        }
    };

    // 친구 관리 팝업 토글
    const toggleFriendPopup = () => {
        setIsFriendPopupOpen(!isFriendPopupOpen);
    };

    // 페이지 외부 클릭 시 팝업 닫기 함수
    const handleClickOutside = (event) => {
        if (notifyPopupRef.current && !notifyPopupRef.current.contains(event.target)) {
            setIsNotifyPopupOpen(false); // 알림 팝업 닫기
        }
        if (friendPopupRef.current && !friendPopupRef.current.contains(event.target)) {
            setIsFriendPopupOpen(false); // 친구 팝업 닫기
        }
    };

    // 클릭 이벤트 등록 및 해제
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // 알림 개수 가져오기
    useEffect(() => {
        axios.get('http://localhost:8080/notify/allnotify', {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        })
            .then(response => {
                const unread = response.data.filter(notify => !notify.isRead).length;
                setUnreadCount(unread); // 읽지 않은 알림 개수 설정
                setNotifications(response.data);
            })
            .catch(error => {
                console.error('Error fetching notifications:', error);
            });
    }, []);

    // 백엔드에서 사용자 이름 가져오기
    useEffect(() => {
        axios.get('http://localhost:8080/api/user', { withCredentials: true })
            .then(response => {
                setUsername(response.data.username); // 사용자 이름 설정
            })
            .catch(error => {
                console.error('Failed to fetch user info', error);
            });
    }, []);

    window.IMP.init("imp77446200");

    const onClickPay = async () => {
        window.IMP.request_pay({
            pg: "kakaopay",
            pay_method: "card",
            amount: "9900",
            name: "구독",
        }, function(response){
            const {status, err_msg} = response;
            if(err_msg){
                alert(err_msg);
            }
            if(status==="paid"){
                alert("구독 결제 완료");
                subscribe_success();
            }

        });
    };

// JWT 토큰 쿠키 삭제 함수
    const deleteCookie = (name) => {
        document.cookie = `${name}=; Max-Age=0; path=/; domain=${window.location.localhost};`;
    };

// 로그아웃 버튼 클릭 시 처리할 함수
    const handleLogout = () => {
        // JWT 토큰이 저장된 쿠키 삭제
        deleteCookie('Authorization');

        // 백엔드에 로그아웃 요청 보내기
        axios.post('http://localhost:8080/api/logout', {}, { withCredentials: true })
            .then(() => {
                setUsername(null); // 사용자 이름 상태 초기화
                window.location.href = '/'; // 메인 페이지로 새로고침 후 리다이렉트
            })
            .catch(error => {
                console.error('Logout failed', error);
            });
    };


    const subscribe_success = async () => {
        try{
            await axios.post("http://localhost:8080/api/subscribe",null,{
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true  // 쿠키를 포함하여 요청
            });
        }catch (err){
            alert(err);
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#001f3f' }}>
            <div className="container-fluid">
                <Link className="navbar-brand" to="/" onClick={() => setIsNotifyPopupOpen(false)}>
                    <img
                        src="/images/goottflix.png"
                        alt="GoottFlix Logo"
                        style={{ height: '60px' }}
                    /> GoottFlix
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

                    </ul>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/"
                                  onClick={closeMenu}>메인페이지</Link>
                        </li>

                        {/* 로그인 여부에 따른 버튼 조건부 렌더링 */}
                        {username ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/mypage" onClick={closeMenu}>마이페이지</Link>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link" onClick={handleLogout}>로그아웃</button>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/userList" onClick={closeMenu}>관리자페이지</Link>
                                </li>

                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/signup" onClick={closeMenu}>회원가입</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login" onClick={closeMenu}>로그인</Link>
                                </li>
                            </>
                        )}

                            {/* 알림 아이콘 */}
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={toggleNotifyPopup} style={{ position: 'relative' }}>
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
                                {/* NotifyPopup 팝업 */}
                                <NotifyPopup isOpen={isNotifyPopupOpen} popupRef={notifyPopupRef} setUnreadCount={setUnreadCount} notifications={notifications} />
                            </li>

                        {/* 친구 관리 아이콘 */}
                        <li className="nav-item">
                            <button className="btn btn-link nav-link" onClick={toggleFriendPopup}>
                                <img src="/friends.png" alt="친구 아이콘" style={{width: '24px'}}/>
                            </button>
                            {/* FriendPopup 팝업 */}
                            <FriendPopup isOpen={isFriendPopupOpen} popupRef={friendPopupRef}/>
                        </li>
                    </ul>
                </div>
            </div>

            <NotificationComponent setUnreadCount={setUnreadCount} setNotifications={setNotifications} />

        </nav>
    );
};

export default Navbar;
