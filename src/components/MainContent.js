import React from 'react';
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const MainContent = () => {
    const navigate = useNavigate();

    const allMovies = async () =>{
        navigate("/");
    }

    const recommendedMovies = async () => {
        navigate("/recommendedCard");
    }

    return (
        <div className="row my-5">
            <div className="col-md-6">
                <div className="card shadow-sm">
                    <div className="card-body">
                        <h2 className="card-title">전체 영화 보러가기</h2>
                        <p className="card-text">전체 영화</p>
                        <Button className="btn btn-primary" onClick={() => allMovies()}>보러 가기</Button>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="card shadow-sm">
                    <div className="card-body">
                        <h2 className="card-title">추천 영화 보러가기</h2>
                        <p className="card-text">추천 영화</p>
                        <Button className="btn btn-primary" onClick={() => recommendedMovies()}>보러가기</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default MainContent;
