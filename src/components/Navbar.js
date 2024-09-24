import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Navbar.css'; // CSS 파일 임포트
import NotifyPopup from "./NotifyPopup";
import axios from 'axios'; // 백엔드로 API 요청을 보내기 위한 axios

const Navbar = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const popupRef = useRef(null);
    const [username, setUsername] = useState(null); // 사용자 이름 상태
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    // 메뉴를 수동으로 닫는 함수
    const closeMenu = () => {
        const navbar = document.getElementById('navbarNav');
        if (navbar.classList.contains('show')) {
            navbar.classList.remove('show');
        }
    };

    // 페이지 외부 클릭 시 팝업을 닫는 함수
    const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            setIsPopupOpen(false); // 팝업 외부를 클릭하면 팝업을 닫음
        }
    };

    // 페이지 렌더링 시 클릭 이벤트 등록
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside); // 마우스 클릭 이벤트 리스너 추가
        return () => {
            document.removeEventListener('mousedown', handleClickOutside); // 컴포넌트가 언마운트될 때 리스너 제거
        };
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
            amount: "10",
            name: "구독",
            merchant_uid: "ord20240920-000001",
        }, function (response) {
            // 결제 후 처리 로직 추가
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


    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#001f3f' }}>
            <div className="container-fluid">
                <Link className="navbar-brand" to="/" onClick={closeMenu}>
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
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/" onClick={closeMenu}>메인페이지</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/signup" onClick={closeMenu}>회원가입</Link>
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
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login" onClick={closeMenu}>로그인</Link>
                                </li>
                            </>
                        )}

                        {/* 알림 아이콘 */}
                        <li className="nav-item">
                            <button className="btn btn-link nav-link" onClick={togglePopup}>
                                <img src="/notify.png" alt="알림 아이콘" style={{ width: '24px' }} />
                            </button>

                            <NotifyPopup isOpen={isPopupOpen} popupRef={popupRef} />
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
