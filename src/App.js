import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import ImageSlider from './components/ImageSlider';
import MovieCard from './function/Card';
import Login from './function/Login';
import UserProfile from "./function/UserProfile";
import Signup from './function/SignUp';
import NotificationComponent from "./function/NotificationComponent";
import Popup from "./function/Popup";
import WatchMovie from "./function/WatchMovie";
import Description from "./function/Description";
import EditProfile from "./function/EditProfile";
import UserList from "./function/UserList";
import MovieWrite from "./function/MovieWrite";
import MovieListAdmin from "./function/MovieListAdmin";
import AdminPage from "./function/AdminPage";
import RecommendedCard from "./function/RecommendedCard";
import NfcData from "./function/NfcData";
import ResetPassword from "./function/ResetPassword";
import ChatLayout from './components/ChatLayout';
import UsernameSetting from "./function/UsernameSetting";
import MovieSearch from "./function/MovieSearch";
import EditMovie from "./function/EditMovie";
import MovieList from "./function/MovieList";
import MyCommentList from "./function/MyCommentList";
import FriendList from "./function/FriendList";
import FriendProfile from "./function/FriendProfile";
import FriendOfFriendList from "./function/FriendOfFriendList";
import FriendCommentList from "./function/FriendCommentList";
import FriendMovieList from "./function/FriendMovieList";
import NoticeWrite from "./function/NoticeWrite";
import NoticeBoard from "./function/NoticeBoard";

function App() {
    return (
        <Router>
            <div className="App">
                <NotificationComponent />
                <Navbar />
                <Routes>
                    {/* 메인 페이지 */}
                    <Route path="/" element={ <>
                                <ImageSlider />
                                <Popup />
                                <Header />
                                <div className="container">
                                    <MainContent />
                                    <MovieCard />
                                </div>
                                <Footer /> </>} />
                    {/* 로그인 페이지 */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/auth/reset" element={<ResetPassword />} />
                    <Route path="/mypage" element={<UserProfile />} />
                    <Route path="/friendPage/:friend_id" element={<FriendProfile />} />
                    <Route path="/editProfile" element={<EditProfile />} />
                    <Route path="/adminPage" element={<AdminPage />} />
                    <Route path="/userList" element={<UserList />} />
                    <Route path="/movieWrite" element={<MovieWrite />} />
                    <Route path="/movieListAdmin" element={<MovieListAdmin />} />
                    <Route path="/nfcData" element={<NfcData />} />
                    <Route path="/movieSearch" element={<MovieSearch />} />
                    <Route path="/movieList" element={<MovieList />} />
                    <Route path="/api/friend/review/:friendId" element={<FriendMovieList />} />
                    <Route path="/myCommentList" element={<MyCommentList />} />
                    <Route path="/myFriendList" element={<FriendList />} />
                    <Route path="/friend/list/:friendId" element={<FriendOfFriendList />} />
                    <Route path="/api/friend/comment/:friendId" element={<FriendCommentList />} />

                    <Route path="/noticeWrite" element={<NoticeWrite />} />
                    <Route path="/noticeBoard" element={<NoticeBoard />} />


                    {/* 회원가입 페이지 */}
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/description" element={<Description/>}/>
                    <Route path="/editMovie" element={<EditMovie/>}/>
                    <Route path="/set-username" element={<UsernameSetting />} />
                    <Route path="/recommendedCard" element={ <>
                        <ImageSlider />
                        <Header />
                        <div className="container">
                            <MainContent />
                            <RecommendedCard />
                        </div>
                        <Footer /> </>} />
                    <Route path="/watchMovie" element={<WatchMovie/>}/>
                    {/*채팅*/}
                    <Route path="/chatroom" element={<ChatLayout />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
