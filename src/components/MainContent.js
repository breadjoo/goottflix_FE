import React from 'react';

const MainContent = () => {
    return (
        <div className="row my-5">
            <div className="col-md-6">
                <div className="card shadow-sm">
                    <div className="card-body">
                        <h2 className="card-title">이번주 박스오피스 바로가기</h2>
                        <p className="card-text">영화 순위 보기</p>
                        <a href="#boxoffice" className="btn btn-primary">자세히 보기</a>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="card shadow-sm">
                    <div className="card-body">
                        <h2 className="card-title">본 영화 리뷰달러 가기</h2>
                        <p className="card-text">리뷰와 평점을 남겨주세요</p>
                        <a href="#reviews" className="btn btn-primary">리뷰 남기기</a>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default MainContent;
