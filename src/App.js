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

import Welcome from "./components/Welcome";
import Description from "./function/Description";
import EditProfile from "./function/EditProfile";
import UserList from "./function/UserList";
import MovieWrite from "./function/MovieWrite";
import MovieListAdmin from "./function/MovieListAdmin";
import AdminPage from "./function/AdminPage";
import RecommendedCard from "./function/RecommendedCard";

function App() {
    return (
        <Router>
            <div className="App">
                <NotificationComponent />
                <Navbar />
                <Welcome />
                <Routes>
                    {/* 메인 페이지 */}
                    <Route path="/" element={ <>
                                <ImageSlider />
                                <Header />
                                <div className="container">
                                    <MainContent />
                                    <MovieCard />
                                </div>
                                <Footer /> </>} />
                    {/* 로그인 페이지 */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/mypage" element={<UserProfile />} />
                    <Route path="/editProfile" element={<EditProfile />} />
                    <Route path="/adminPage" element={<AdminPage />} />
                    <Route path="/userList" element={<UserList />} />
                    <Route path="/movieWrite" element={<MovieWrite />} />
                    <Route path="/movieListAdmin" element={<MovieListAdmin />} />
                    {/* 회원가입 페이지 */}
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/description" element={<Description/>}/>
                    <Route path="/recommendedCard" element={ <>
                        <ImageSlider />
                        <Header />
                        <div className="container">
                            <MainContent />
                            <RecommendedCard />
                        </div>
                        <Footer /> </>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
