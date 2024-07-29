import React, { useContext, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { TeamInfo } from "../TeamInfo";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

const CreateTeam = () => {
  const {
    teamName,
    setTeamName,
    teamIcon,
    setTeamIcon,
    teamArea,
    setTeamArea,
  } = useContext(TeamInfo);
  const [userId, setUserId] = useState(null); // userId 상태 추가

  const nav = useNavigate();

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
        alert("로그인 하셔야 팀 생성이 가능합니다");
        nav("/home");
      }
    };
    fetchSessionData();
  }, [nav]);

  const sendData = async (e) => {
    e.preventDefault();

    const userId = sessionStorage.getItem("userId");

    try {
      const response = await axios.post(
        "/team/handleCreateTeam",
        {
          userId,
          teamName,
          teamIcon,
          teamArea,
        },
        {
          headers: {
            "x-session-id": sessionStorage.getItem("sessionId"),
          },
        }
      );
      console.log(response);
      response.data.success = nav("/home");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <h1>팀 생성</h1>
      <Form onSubmit={sendData}>
        <Form.Group className="mb-3">
          <Form.Label>팀 이름</Form.Label>
          <Form.Control
            type="text"
            placeholder="Teamname"
            onChange={(e) => setTeamName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>팀 사진</Form.Label>
          <Form.Control
            type="text"
            placeholder="Image URL"
            onChange={(e) => setTeamIcon(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>주 활동 지역</Form.Label>
          <Form.Control
            type="text"
            placeholder="Area"
            onChange={(e) => setTeamArea(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          팀 생성
        </Button>
      </Form>
    </div>
  );
};
export default CreateTeam;
