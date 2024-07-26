import React, { useState, useEffect, useContext } from "react";
import Update from "../components/Update";
import SelfStats from "../components/SelfStats";
import axios from "../axios";
import { UserInfo } from "../UserInfo";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const [currentPage, setCurrentPage] = useState("default");
  const nav = useNavigate();

  const {
    userId,
    setUserId,
    teamId,
    setTeamId,
    userNickname,
    setUserNickname,
    userImg,
    setUserImg,
    userShooting,
    setUserShooting,
    userPassing,
    setUserPassing,
    userDribbling,
    setUserDribbling,
    userSpeed,
    setUserSpeed,
    userDefending,
    setUserDefending,
    userGoalkeeping,
    setUserGoalkeeping,
  } = useContext(UserInfo);

  const [teamName, setTeamName] = useState(null);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await axios.get("/api/get-session", {
          headers: {
            "x-session-id": sessionStorage.getItem("sessionId"),
          },
        });
        console.log(userId);
        setUserId(response.data.userId);
        sessionStorage.setItem("userId", response.data.userId); // 세션에 userId 저장
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
        alert("로그인 하셔야 마이 페이지를 확인할 수 있습니다");
        nav("/home");
      }
    };
    const fetchUserData = async () => {
      try {
        const response = await axios.post(
          "/user/userInfo",
          {
            userId: sessionStorage.getItem("userId"),
          },
          {
            headers: {
              "x-session-id": sessionStorage.getItem("sessionId"),
            },
          }
        );

        if (response.data.success) {
          const userData = response.data.data;
          setTeamId(userData.team_id);
          setUserNickname(userData.user_nickname);
          setUserImg(userData.user_img);
          setUserShooting(userData.user_shooting);
          setUserPassing(userData.user_passing);
          setUserDribbling(userData.user_dribbling);
          setUserSpeed(userData.user_speed);
          setUserDefending(userData.user_defending);
          setUserGoalkeeping(userData.user_goalkeeping);
          setTeamName(userData.team_name);
        } else {
          console.error("Failed to fetch user data:", response.data.message);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    const initialize = async () => {
      await fetchSessionData();
      await fetchUserData();
    };

    initialize();
  }, [nav]);

  function upDate() {
    setCurrentPage("update");
  }

  function selfStats() {
    setCurrentPage("selfstats");
  }

  return (
    <div>
      <div>
        <div>회원 아이콘 : {userImg}</div>
        <div>회원 닉네임 : {userNickname}</div>
        <button onClick={upDate}>회원정보 수정</button>
        <button onClick={selfStats}>나의 스탯</button>
        <button>회원 탈퇴</button>
        <div>소속 팀-클릭 시 팀 페이지 이동 : {teamName}</div>
      </div>

      <div>
        <div>개인 스탯 차트 구현 공간</div>
      </div>

      <div>
        {currentPage === "default" && <div>기본 페이지 내용</div>}
        {currentPage === "update" && <Update />}
        {currentPage === "selfstats" && <SelfStats />}
      </div>
    </div>
  );
};

export default MyPage;
