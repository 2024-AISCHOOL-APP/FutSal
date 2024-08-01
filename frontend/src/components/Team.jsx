import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TeamInfo } from "../TeamInfo";
import axios from "../axios";
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
  } = useContext(TeamInfo);

  const [userId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalSize, setModalSize] = useState("lg");
  const [members, setMembers] = useState([]);
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

          // 모든 팀원 데이터 가져오기
          const membersResponse = await axios.get("/team/members", {
            headers: {
              "x-session-id": sessionStorage.getItem("sessionId"),
            },
            params: {
              teamId: teamId,
            },
          });
          console.log("Members response:", membersResponse.data);

          // user_score가 있는 팀원만 필터링
          const filteredMembers = membersResponse.data.data.filter(member => member.user_score > 0);
          setMembers(filteredMembers);

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
  }, [teamId]);

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

  // 차트 데이터 업데이트
  const data = {
    labels: ['Team Score', ...members.map(member => member.user_nickName)], // 팀 스코어와 팀원 닉네임을 레이블로 사용
    datasets: [
      {
        label: 'Score',
        data: [teamScore, ...members.map(member => member.user_score || 0)], // 팀 스코어와 팀원 유저 스코어를 데이터로 사용
        backgroundColor: ['rgba(75, 192, 192, 0.5)', ...members.map(() => 'rgba(255, 99, 132, 0.5)')], // 각각의 색상을 설정
        borderColor: ['rgba(75, 192, 192, 1)', ...members.map(() => 'rgba(255, 99, 132, 1)')], // 각각의 경계 색상을 설정
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw}`, // 레이블 형식 설정
        },
      },
    },
    indexAxis: 'y', // 수직 바 차트 설정
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
        },
        ticks: {
          max: 100, // 점수 범위에 따라 수정
          min: 0,
        },
      },
    },
  };


  // 기존 팀 비교 버튼 클릭 이벤트 핸들러

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
    console.log('작동');
    teamM();

},[navigate,joinRequestStatus]);
  return (
    <div className="container">
      <div className="team-container">
        <div className="leftSection">
          <div className="teamInfo">
            <div className="teamIconName">
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
          </div>

          <div className="teamInfo mt-3">
            <div style={{ height: '200px' }}> 
              <Bar data={data} options={options} />
            </div>
            <h3>Team Score : {teamScore}</h3>
            <Button  // 승률 페이지로 이동하는 버튼
              className="team-btn"
              onClick={handleGoToWinRate}>
              승률 비교
            </Button>

          </div>
        </div>

        <div className="rightSection">
          <div className="teamImagesAndText">
            <div className="teamImages">
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
    </div>
  );
};

export default Team;
