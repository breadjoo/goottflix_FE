import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap 스타일시트 추가

const UsernameSetting = () => {
    const [username, setUsername] = useState('');
    const [isUsernameValid, setIsUsernameValid] = useState(null); // 중복 확인 상태 저장
    const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 저장

    // 유저네임 중복 체크 함수
    const checkUsernameAvailability = () => {
        if (username.trim() === '') { // 입력된 값이 없으면 경고 메시지 출력
            setIsUsernameValid(false);
            setErrorMessage('닉네임을 입력해주세요');
            return;
        }

        axios.post('http://localhost:8080/user/username/check', null, {
            params: {
                username: username
            },
            withCredentials: true
        })
            .then(response => {
                console.log(response.data);  // 응답 데이터 확인
                if (response.data.available) {
                    setIsUsernameValid(true);
                    setErrorMessage('사용 가능한 닉네임입니다.');
                } else {
                    setIsUsernameValid(false);
                    setErrorMessage('이미 사용중인 닉네임입니다.');
                }
            })
            .catch(error => {
                setIsUsernameValid(false);
                setErrorMessage('Error checking username');
            });
    };

    // 유저네임 설정 함수
    const handleUsernameSubmit = () => {
        if (username.trim() === '') { // 입력된 값이 없으면 경고 메시지 출력
            setErrorMessage('닉네임을 입력해주세요');
            return;
        }

        axios.post('http://localhost:8080/api/user/set-username', null, {  // 데이터 전송 대신 URL 파라미터로 전송
            params: {
                username: username  // URL 파라미터로 전송
            },
            withCredentials: true
        })
            .then(response => {
                alert('Username has been set successfully');
                window.location.href = '/login'; // 설정 후 로그인 페이지로 리디렉션
            })
            .catch(error => {
                alert('Error setting username: ' + error.message);
            });
    };

    return (
        <div className="container d-flex justify-content-center">
            <div className="col-md-6 col-lg-4">
                <h2 className="mt-4 mb-4 text-center">별명을 설정해주세요!</h2>
                <div className="mb-3">
                    <div className="input-group">
                        <input
                            type="text"
                            className={`form-control ${isUsernameValid === false ? 'is-invalid' : isUsernameValid === true ? 'is-valid' : ''}`}
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setIsUsernameValid(null); // 입력 중에는 중복 확인 상태를 초기화
                            }}
                            placeholder="새로운 닉네임"
                            style={{ maxWidth: '250px' }} // 입력 필드 최대 너비 설정
                        />
                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-secondary"
                                onClick={checkUsernameAvailability}
                                disabled={username.trim() === ''} // 닉네임 입력이 없으면 버튼 비활성화
                            >
                                중복확인
                            </button>
                        </div>
                    </div>
                    {isUsernameValid === false && (
                        <div className="invalid-feedback d-block">
                            {errorMessage}
                        </div>
                    )}
                    {isUsernameValid === true && (
                        <div className="valid-feedback d-block">
                            {errorMessage}
                        </div>
                    )}
                </div>
                <button
                    className="btn btn-primary w-100"
                    onClick={handleUsernameSubmit}
                    disabled={isUsernameValid !== true || username.trim() === ''} // 닉네임이 유효하지 않거나 비어 있으면 버튼 비활성화
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default UsernameSetting;
