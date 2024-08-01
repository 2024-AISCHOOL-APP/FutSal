import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TeamInfo } from "../TeamInfo";
import axios from "../axios";
import { UserInfo } from "../UserInfo";
import ModalComponent from "./TeamApplyModal";
import TeamApply from "./TeamApply";
import TeamMembers from "./TeamMembers";
import "../css/team.css";
import { Button } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import "../css/mypage.css";

// Chart.js 구성 요소 등록
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const Team = () => {
  const { teamId } = useParams(); // URL 파라미터에서 teamId를 가져옴
  const navigate = useNavigate(); // useNavigate 훅 추가

  const {
    setTeamId,
    teamName,
    setTeamName,
    teamIcon,
    setTeamIcon,
    teamScore,
    setTeamScore,
    teamRecord,
    setTeamRecord,
    teamArea,
    setTeamArea,
    setTeamManager,
    teamImg1,
    setTeamImg1,
    teamImg2,
    setTeamImg2,
    teamText,
    setTeamText,
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
    setUserScore,
  } = useContext(TeamInfo, UserInfo);

  const [userId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalSize, setModalSize] = useState("lg");
  
const [userDataArray, setUserDataArray] = useState([]);

const [joinRequestStatus, setJoinRequestStatus] = useState(null); // 팀원 가입 신청 상태 변수

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await axios.get("/api/get-session", {
          headers: {
            "x-session-id": sessionStorage.getItem("sessionId"),
          },
        });
        console.log("Session data:", response.data);
        setUserId(response.data.userId);
        sessionStorage.setItem("userId", response.data.userId);
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
      }
    };

    const fetchTeamData = async () => {
      try {
        const response = await axios.get("/team/teamInfo", {
          headers: {
            "x-session-id": sessionStorage.getItem("sessionId"),
          },
          params: {
            teamId: teamId,
          },
        });
        console.log("Team data:", response.data);
    
        if (response.data.success) {
          const teamData = response.data.data;
          console.log("Team data success:", teamData);
          setTeamId(teamData.team_id);
          setTeamName(teamData.team_name);
          setTeamIcon(teamData.team_icon);
          setTeamScore(teamData.team_score);
          setTeamRecord(teamData.team_record);
          setTeamArea(teamData.team_area);
          setTeamManager(teamData.team_manager);
          setTeamImg1(teamData.team_img1);
          setTeamImg2(teamData.team_img2);
          setTeamText(teamData.team_text);
    
          console.log("Updated teamId:", teamData.team_id);
        } else {
          console.error("Failed to fetch team data:", response.data.message);
        }
      } catch (error) {
        console.error("Failed to fetch team data:", error);
      }
    };
    
    const initialize = async () => {
      await fetchSessionData();
      await fetchTeamData();
    };

    initialize();
  }, [
    setTeamId,
    setTeamName,
    setTeamIcon,
    setTeamScore,
    setTeamRecord,
    setTeamArea,
    setTeamImg1,
    setTeamImg2,
    setTeamText,
  ]);

  const teamJoin = async () => {
    try {
      const response = await axios.post(
        "/team/teamJoin",
        {
          teamId,
          userId,
        },
        {
          headers: {
            "x-session-id": sessionStorage.getItem("sessionId"),
          },
        }
      );

      if (response.data.success) {
        console.log("Joined team successfully:", response.data.message);
        setJoinRequestStatus("success")
        alert("가입신청이 완료되었습니다.");
      } else {
        alert("이미 가입 신청 하셨습니다.");
      }
    } catch (error) {
      console.error("Error joining team:", error);
      alert("이미 가입 신청 하셨습니다.");
    }
  };
  const handleShowModal = (content, size = "lg") => {
    setModalContent(content);
    setModalSize(size);
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  const data = {
    labels: ['Score'],
    datasets: [
      {
        label: 'Team Score',
        data: [teamScore || 0], // DB에서 가져온 teamScore 값을 사용합니다.
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `Score: ${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Score',
        },
      },
    },
  };




  const handleGoToWinRate = () => {
    navigate(`/winrate/${teamId}`); // 승률 페이지로 이동
  };
  const sendToFlask = async (userDataArray) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/winrate", // Flask 서버의 엔드포인트 URL
        userDataArray, // 전송할 데이터
        {
          headers: {
            "x-session-id": sessionStorage.getItem("sessionId"),
            "Content-Type": "application/json", // 데이터의 형식을 JSON으로 설정
          },
        }
      );
      console.log("Data sent to Flask successfully:", response.data);
    } catch (error) {
      console.error("Error sending data to Flask:", error);
    }
  };
  const teamM = async()=>{
    try {
      const response = await axios.post(
        "/team/teamM",
        {
          teamId: teamId
        },
        {
          headers: {
            "x-session-id": sessionStorage.getItem("sessionId"),
          },
        })
        if (response.data.success) {
          const userData = response.data.data;
          console.log(userData);
          setUserDataArray(userData);
          sendToFlask(userData);
        } else {
          console.error("Failed to fetch user data:", response.data.message);
        }
    
    }catch(error){
      console.error("Request error:", error);
    }
  }
  
  useEffect(() => {
   
    teamM();

},[navigate,joinRequestStatus]);

  return (
    <div className="container contai">
      <div className="leftSection">
        <div className="teamInfo">
          <div className="teamIconName">
            {/* <div className="teamIcon">팀 아이콘: {teamIcon}</div>  <- DB 받아오면 이거 쓰기 */}
            <div className="teamIcon">
              <img
                src={process.env.PUBLIC_URL + "/profileIcon.png"}
                width="150px"
                alt="profile-icon"
              />
            </div>
            <div className="teamName">
              <h3>{teamName}</h3>
            </div>
          </div>
          <div className="teamDetails">
            <div>◾️ 팀 ID: {teamId}</div>
            <div>◾️ 팀 지역: {teamArea}</div>
            <div>◾️ 팀 기록: {teamRecord}</div>
          </div>
          <Button
            className="team-btn"
            onClick={() =>
              handleShowModal(<TeamMembers teamId={teamId} />, "xl")
            }
          >
            팀원 목록
          </Button>
          <Button
            className="team-btn"
            onClick={() => handleShowModal(<TeamApply teamId={teamId} />)}
          >
            신청 목록
          </Button>
          <Button className="team-btn" onClick={teamJoin}>
            가입 신청
          </Button>

          <Button  // 승률 페이지로 이동하는 버튼
            className="team-btn"
            onClick={handleGoToWinRate}>
            승률 비교
          </Button>
          
        </div>

        <div className="teamInfo mt-3">
          <h2>팀 점수</h2>
          <div>{teamScore}</div>
          <div style={{ height: '200px' }}> {/* 차트의 높이를 설정합니다. */}
            <Bar data={data} options={options} />
          </div>
        </div>
      </div>

      <div className="rightSection">
        <div className="teamImagesAndText">
          <div className="teamImages">
            {/* <img src={teamImg1} alt="팀 이미지 1" <- DB 받아오면 이거 쓰기 />
            <img src={teamImg2} alt="팀 이미지 2" /> */}
            <img src={"/ggami.jpg"} alt="팀 이미지 1" />
            <img src={"/myTeam.png"} alt="팀 이미지 2" />
          </div>
          <div className="teamText">{teamText}</div>
        </div>
        <ModalComponent
          show={showModal}
          handleClose={handleCloseModal}
          size={modalSize}
        >
          {modalContent}
        </ModalComponent>
      </div>
    </div>
  );
};

export default Team;
