import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import ImageSlider from './components/ImageSlider';
import KitchenSinkExample from './function/Card';
import Login from './function/Login';
import Signup from './function/SignUp';
import Friend from "./components/Friend";


function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    {/* 메인 페이지 */}
                    <Route path="/" element={ <>
                                <ImageSlider />
                                <Header />
                                <div className="container">
                                    <MainContent />
                                    <KitchenSinkExample />
                                </div>
                                <Footer /> </>} />
                    {/* 로그인 페이지 */}
                    <Route path="/login" element={<Login />} />
                    {/* 회원가입 페이지 */}
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/friend" element={<Friend />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
