import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axios";
import { UserInfo } from "../UserInfo";
import Update from "./Update";
import SelfStats from "./SelfStats";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import "../css/mypage.css";
import Button from "react-bootstrap/esm/Button";

// Chart.js 구성 요소 등록
ChartJS.register(
  RadarController,
  RadialLinearScale,
  LineElement,
  PointElement,
  Filler
);

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
    userScore,
    setUserScore
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
          setUserScore(userData.user_score);
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
  }, [nav, setUserId, setUserNickname, setUserImg]);

  const showUpdatePage = () => {
    setCurrentPage("update");
  };

  const showSelfStatsPage = () => {
    setCurrentPage("selfstats");
  };

  const data = {
    labels: [
      "Shooting",
      "Passing",
      "Dribbling",
      "Speed",
      "Defending",
      "Goalkeeping",
    ],
    datasets: [
      {
        label: "User Stats",
        data: [
          userShooting,
          userPassing,
          userDribbling,
          userSpeed,
          userDefending,
          userGoalkeeping,
        ],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1.5)",
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        ticks: {
          display: true,
        },
        pointLabels: {
          display: false,
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: { 
      legend: {
        display: false, // 범례 숨김
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className="container">
      <div className="mypage_container">
        <div id="mypage_container_left">
          <div id="mypage_container_left_up">
            <div id="mypage_container_logo_box">
              <img
                className="mp-img"
                src={
                  userImg
                    ? `${process.env.PUBLIC_URL}${userImg}`
                    : `${process.env.PUBLIC_URL}/image/userImage/default_profile.png`
                }
                alt="User Icon"
              />
            </div>

            <div id="mypage_links">
              <br />
              <Button onClick={() => nav('/teampage')} className="mypage-link">
                팀페이지
              </Button>
              <Button onClick={showUpdatePage} className="mypage-link">
                회원정보 수정하기
              </Button>
              <Button onClick={showSelfStatsPage} className="mypage-link">
                능력치 등록
              </Button>
            </div>
          </div>

          <div id="mypage_container_left_down">
            <div id="mypage_container_left_down_box">
              <div id="mypage_container_left_down_hex">
                <Radar data={data} options={options} />
              </div>
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
    </div>
  );
};

export default MyPage;
