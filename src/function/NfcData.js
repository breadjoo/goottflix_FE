import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NfcData = () => {
    const [uid, setUid] = useState('');  // NFC로부터 받은 UID
    const [messages, setMessages] = useState([]);  // 메시지 목록
    const [mode, setMode] = useState('register');  // 초기 모드는 'register'
    const [bookInfo, setBookInfo] = useState(null);  // BookInfo 데이터를 저장할 상태
    const [isAuthorized, setIsAuthorized] = useState(false);  // 권한 확인 상태
    const navigate = useNavigate();  // 리디렉션을 위해 useNavigate 사용
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    // 사용자 정보 가져와서 role 확인
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/user`, { withCredentials: true });
                const { role } = response.data; // 사용자 role 정보 확인
                if (role === 'ROLE_ADMIN') {
                    setIsAuthorized(true);  // 권한이 있으면 true로 설정
                } else {
                    alert('접근 권한이 없습니다.');
                    navigate('/');  // 권한이 없으면 메인 페이지로 리디렉션
                }
            } catch (err) {
                console.error('Failed to fetch user info', err);
                alert('로그인이 필요합니다.');
                navigate('/login');  // 로그인 정보가 없으면 로그인 페이지로 리디렉션
            }
        };

        fetchUserInfo();  // 컴포넌트 마운트 시 사용자 정보 확인
    }, [navigate]);

    // NFC UID 수신
    useEffect(() => {
        if (isAuthorized) {  // 관리자 권한이 있을 때만 NFC 데이터를 받아옴
            const eventSource = new EventSource(`${API_URL}/book/nfc-data`, {
                withCredentials: true
            });

            eventSource.onmessage = (event) => {
                setMessages((prevMessages) => [...prevMessages, event.data]);
                setUid(event.data);  // UID 저장
            };

            return () => {
                eventSource.close();
            };
        }
    }, [isAuthorized]);

    // POST 요청을 통해 UID와 모드를 전송
    const sendUidToBackend = () => {
        const url = `${API_URL}/book/process-card`;
        axios.post(url, { uid, mode }, {
            withCredentials: true
        })
            .then(response => {
                console.log('Response:', response.data);  // 서버에서 받은 데이터 확인
                if (mode === 'validate') {
                    setBookInfo(response.data);  // validate 모드에서 BookInfo 데이터 저장
                } else if (mode === 'registerUser') {
                    alert('success: ' + response.data);
                } else {
                    alert('Success: ' + response.data);
                }
            })
            .catch(error => {
                alert('Error: ' + error.message);
            });
    };

    if (!isAuthorized) {
        return <div>권한을 확인 중입니다...</div>;  // 권한 확인 중일 때 로딩 메시지
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">NFC Card Operation</h1>

            {messages.length > 0 && (
                <ul className="list-group mb-3">
                    <h3>NFC 카드정보</h3>
                    {messages.map((message, index) => (
                        <li
                            key={index}
                            className={`list-group-item ${index === messages.length - 1 ? 'bg-warning' : ''}`}
                        >
                            {message}
                        </li>
                    ))}
                </ul>
            )}

            <div className="mb-3">
                <div className="form-check form-check-inline">
                    <input
                        type="radio"
                        className="form-check-input"
                        value="register"
                        id="registerRadio"
                        checked={mode === 'register'}
                        onChange={() => setMode('register')}
                    />
                    <label className="form-check-label" htmlFor="registerRadio">카드 등록</label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        type="radio"
                        className="form-check-input"
                        value="registerUser"
                        id="registerUserRadio"
                        checked={mode === 'registerUser'}
                        onChange={() => setMode('registerUser')}
                    />
                    <label className="form-check-label" htmlFor="registerUserRadio">유저 등록</label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        type="radio"
                        className="form-check-input"
                        value="validate"
                        id="validateRadio"
                        checked={mode === 'validate'}
                        onChange={() => setMode('validate')}
                    />
                    <label className="form-check-label" htmlFor="validateRadio">입장 확인</label>
                </div>
            </div>

            <button
                className="btn btn-primary"
                onClick={sendUidToBackend}
                disabled={!uid}
            >
                Submit
            </button>

            {bookInfo && mode === 'validate' && (
                <div className="table-responsive mt-4">
                    <table className="table table-bordered table-striped">
                        <thead className="thead-dark">
                        <tr>
                            <th>Username</th>
                            <th>Login ID</th>
                            <th>Birth</th>
                            <th>Gender</th>
                            <th>Genre</th>
                            <th>Title</th>
                            <th>Director</th>
                            <th>Card ID</th>
                            <th>Room Number</th>
                            <th>Seat Number</th>
                            <th>Show Time</th>
                            <th>Entered</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{bookInfo.username}</td>
                            <td>{bookInfo.loginId}</td>
                            <td>{new Date(bookInfo.birth).toLocaleDateString()}</td>
                            <td>{bookInfo.gender}</td>
                            <td>{bookInfo.genre}</td>
                            <td>{bookInfo.title}</td>
                            <td>{bookInfo.director}</td>
                            <td>{bookInfo.cardId}</td>
                            <td>{bookInfo.roomNumber}</td>
                            <td>{bookInfo.seatNumber}</td>
                            <td>{new Date(bookInfo.showTime).toLocaleString()}</td>
                            <td>{bookInfo.entered}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default NfcData;
