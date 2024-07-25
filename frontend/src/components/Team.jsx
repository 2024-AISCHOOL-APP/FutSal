import React, { useContext, useState, useEffect } from "react";
import { TeamInfo } from "../TeamInfo";
import axios from "../axios";
import { UserInfo } from "../UserInfo";
import ModalComponent from "./TeamApplyModal";
import TeamApply from "./TeamApply";

const Team = () => {
  const {
    teamId,
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
    teamImg1,
    setTeamImg1,
    teamImg2,
    setTeamImg2,
    teamText,
    setTeamText,
  } = useContext(TeamInfo, UserInfo);

  const [userId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
        alert("가입신청이 완료되었습니다.");
      } else {
        alert("이미 가입 신청 하셨습니다.");
      }
    } catch (error) {
      console.error("Error joining team:", error);
      alert("이미 가입 신청 하셨습니다.");
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div>
      <div>
        <h1>팀 정보</h1>
        <div>팀 아이콘: {teamIcon}</div>
        <div>팀 이름: {teamName}</div>
        <div>팀 ID: {teamId}</div>
        <div>팀 지역: {teamArea}</div>
        <div>팀 기록: {teamRecord}</div>
        <button onClick={handleShowModal}>가입 대기 </button>
        <button onClick={teamJoin}>가입 신청</button>
      </div>

      <div>
        <h2>팀 점수</h2>
        <div>{teamScore}</div>
        <div>
          요기는 차트 구현-팀 가입은 스탯 안적어도 가입되게 하고 스탯창 적용은
          마이페이지에서 셋팅해야 적용되게 적용
        </div>
      </div>

      <div>
        <h2>팀 이미지 및 설명</h2>
        <div>이미지 1: {teamImg1}</div>
        <div>이미지 2: {teamImg2}</div>
        <div>팀 설명: {teamText}</div>
      </div>
      <ModalComponent show={showModal} handleClose={handleCloseModal}>
        <TeamApply />
      </ModalComponent>
    </div>
  );
};

export default Team;
