import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    window.IMP.init("imp77446200");

    const onClickPay = async () => {
        window.IMP.request_pay({
            pg: "kakaopay",
            pay_method: "card",
            amount: "10",
            name: "구독",
            merchant_uid: "ord20240920-000001",
        }, function(response){

        });
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#001f3f' }}>
            <div className="container-fluid">
                {/* 이미지로 대체 */}
                <Link className="navbar-brand" to="/">
                    <img
                        src="/images/goottflix.png"  /* 로고 이미지 파일 경로 */
                        alt="GoottFlix Logo"
                        style={{ height: '60px' }}   /* 적절한 이미지 크기 설정 */
                    />  GoottFlix
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
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
                            <Link className="nav-link active" aria-current="page" to="/">메인페이지</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/signup">회원가입</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">로그인</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
