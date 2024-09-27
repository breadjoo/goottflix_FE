import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // 쿠키를 읽기 위한 라이브러리
import { jwtDecode } from 'jwt-decode'; // JWT 토큰을 디코딩하기 위한 라이브러리



const FriendPopup = ({ isOpen, popupRef }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [friends, setFriends] = useState([]); // 검색 가능한 친구들
    const [filteredFriends, setFilteredFriends] = useState([]);
    const [userId, setUserId] = useState(''); // 현재 로그인된 사용자 ID
    const [friendList, setFriendList] = useState([]); // 친구가 된 사람들 목록
    const [friendToDelete, setFriendToDelete] = useState(null);


    // JWT 토큰에서 사용자 ID 가져오기
    useEffect(() => {
        const token = Cookies.get('Authorization'); // 쿠키에서 Authorization 가져오기
        if (token) {
            try {
                const decodedToken = jwtDecode(token); // JWT 디코딩
                setUserId(decodedToken.userId); // 토큰에서 userId 추출
            } catch (error) {
                console.error('Failed to decode token:', error);
            }
        }
    }, []);

    // 전체 친구 목록 가져오기
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await axios.get('http://localhost:8080/friend/search', {
                    withCredentials: true,
                }); // 모든 친구 목록을 가져오는 API
                setFriends(response.data);
            } catch (error) {
                console.error('Failed to fetch friends:', error);
            }
        };
        fetchFriends();
    }, []);

    // 친구가 된 사람 목록 가져오기
    useEffect(() => {
        const fetchFriendList = async () => {
            try {
                const response = await axios.get('http://localhost:8080/friend/list', {
                    withCredentials: true,
                });
                setFriendList(response.data); // 친구가 된 사람들 목록 설정
            } catch (error) {
                console.error('Failed to fetch friend list:', error);
            }
        };
        fetchFriendList();
    }, [userId]);

    // 검색어가 바뀔 때마다 필터링
    useEffect(() => {
        if (searchTerm === '') {
            setFilteredFriends([]); // 검색어가 없으면 목록을 비운다
        } else {
            const results = friends.filter((friend) =>
                friend.username.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredFriends(results);
        }
    }, [searchTerm, friends]);


    // 친구 추가 요청 보내기
    const handleAddFriend = async (friendId) => {
        try {
            await axios.post('http://localhost:8080/friend/add', null, {
                params: {
                    friendId: friendId // 추가할 친구의 ID
                },
                withCredentials: true,
            });
            alert("친구 추가 성공!");
            const addedFriend = friends.find((friend) => friend.id === friendId);
            setFriendList((prevFriendList) => [...prevFriendList, addedFriend]); // 현재 친구 목록에 추가
        } catch (error) {
            console.error('친구 추가 실패:', error);
            alert("이미 추가된 친구 입니다");
        }
    };


    // 친구 삭제 요청 보내기
    const handleDeleteFriend = async (friendId) => {
        try {
            await axios.delete('http://localhost:8080/friend/remove', {
                params: {
                    id : friendId// 삭제할 친구의 ID
                },
                withCredentials: true,
            });
            alert("친구 삭제 성공!");
            setFriendList((prevFriendList) => prevFriendList.filter(friend => friend.id !== friendId)); // 삭제 후 목록 갱신

        } catch (error) {
            console.error('친구 삭제 실패:', error);
            alert("친구 삭제 실패");
        }
    };


    if (!isOpen) return null;

    return (
        <div className="friend-popup" ref={popupRef}>
            <div className="friend-header">
                <h5>친구</h5>
            </div>

            {/* 친구 목록 */}
            <div className="mb-5">
                <h4>모든 친구</h4>
                <h5> 친구 ({friendList.length}명)</h5>
                {friendList.length > 0 ? (
                    <ul className="list-group">
                        {friendList.map((friend) => (
                            <li key={friend.id} className="list-group-item">
                                {friend.username}
                                {friendToDelete === friend.id ? (
                                    <>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteFriend(friend.id)}
                                        >
                                            삭제
                                        </button>
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => setFriendToDelete(null)} // 취소 버튼
                                        >
                                            취소
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className="btn btn-link btn-sm"
                                        onClick={() => setFriendToDelete(friend.id)} // X 버튼 누르면 삭제 버튼이 나타남
                                    >
                                        <img
                                            src='/deleteicon.png'
                                            alt='삭제 아이콘'
                                            className='delete-icon'
                                        />
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>친구가 없습니다.</p>
                )}
            </div>

            {/* 친구 검색 및 추가 */}
            <div className="mb-3">
                <h4>친구 검색</h4>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="친구 이름 검색"
                    className="form-control"
                />
            </div>

            {/* 검색된 친구 목록 */}
            {searchTerm && (
                <ul className="list-group">
                    {filteredFriends.map((friend) => (
                        <li key={friend.id}
                            className="list-group-item d-flex justify-content-between align-items-center">
                            {friend.username}
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleAddFriend(friend.id)}
                            >
                                친구 추가
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FriendPopup;