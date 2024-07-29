import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axios";
import { UserInfo } from "../UserInfo";
import Update from "./Update";
import SelfStats from "./SelfStats";
import "./MyPage.css";

const MyPage = () => {
  const [currentPage, setCurrentPage] = useState("default");
  const nav = useNavigate();

  const {
    userId,
    setUserId,
    userNickname,
    setUserNickname,
    userImg,
    setUserImg,
  } = useContext(UserInfo);

  const [teamName, setTeamName] = useState(null);

  useEffect(() => {
    // ... (기존의 useEffect 코드 유지)
  }, [nav, setUserId, setUserNickname, setUserImg]);

  const showUpdatePage = () => {
    setCurrentPage("update");
  };

  const showSelfStatsPage = () => {
    setCurrentPage("selfstats");
  };

  return (
    <div id="mypage_container">
      <div id="mypage_container_left">
        <div id="mypage_container_left_up">
          <div id="mypage_container_logo_box">
            <img src={userImg} alt="User Icon" />
          </div>
          <div id="mypage_links">
            <button onClick={showUpdatePage} className="mypage-link">
              회원정보 수정하기
            </button>
            <br />
            <Link to="/teampage" className="mypage-link">
              팀페이지
            </Link>
            <br />
            <button onClick={showSelfStatsPage} className="mypage-link">
              능력치 등록
            </button>
          </div>
        </div>
        <div id="mypage_container_left_down">
          <div id="mypage_container_left_down_box">
            <div id="mypage_container_left_down_hex"></div>
          </div>
        </div>
      </div>
      <div id="mypage_container_right">
        {currentPage === "default" && (
          <div className="right-content">
            <h2>마이페이지</h2>
            <p>왼쪽 메뉴에서 원하는 항목을 선택하세요.</p>
          </div>
        )}
        {currentPage === "update" && (
          <div className="right-content">
            <Update />
          </div>
        )}
        {currentPage === "selfstats" && (
          <div className="right-content">
            <SelfStats />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPage;
