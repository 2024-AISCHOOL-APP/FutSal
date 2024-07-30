import React, { useState, useEffect, useContext } from "react";
import Update from "../components/Update";
import SelfStats from "../components/SelfStats";
import axios from "../axios";
import { UserInfo } from "../UserInfo";
import { useNavigate } from "react-router-dom";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import "../css/mypage.css";

// Chart.js 구성 요소 등록
ChartJS.register(RadarController, RadialLinearScale, LineElement, PointElement, Filler);

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
        setUserId(response.data.userId);
        sessionStorage.setItem("userId", response.data.userId);
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
  }, [nav, setUserId, setTeamId, setUserNickname, setUserImg, setUserShooting, setUserPassing, setUserDribbling, setUserSpeed, setUserDefending, setUserGoalkeeping]);

  const upDate = () => {
    setCurrentPage("update");
  };

  const selfStats = () => {
    setCurrentPage("selfstats");
  };

  const data = {
    labels: ['Shooting', 'Passing', 'Dribbling', 'Speed', 'Defending', 'Goalkeeping'],
    datasets: [
      {
        label: 'User Stats',
        data: [userShooting, userPassing, userDribbling, userSpeed, userDefending, userGoalkeeping],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1.5)'
      }
    ]
  };

  const options = {
    responsive: true,
    elements: {
      line: {
        borderWidth: 1,
      },
    },
    scales: {
      r: {
        angleLines: {
          display: true
        },
        suggestedMin: 0, // 최소값 설정
        suggestedMax: 100, // 최대값 설정
        ticks: {
          stepSize: 10,
          beginAtZero: true
        }
      }
    }
  };

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
          <Radar data={data} options={options} style={{ position: 'relative', width: '500px', height: '250px' }} />
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
