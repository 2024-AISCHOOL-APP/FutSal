import React, { useContext, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "../axios";
import { UserInfo } from "../UserInfo";
import { useNavigate } from "react-router-dom";

const SelfStats = () => {
  const {
    userId,
    setUserId,
    userPosition,
    setUserPosition,
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
        alert("로그인 하셔야 스탯 등록이 가능합니다");
        nav("/home");
      }
    };
    fetchSessionData();
  }, [nav]);

  const sendData = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "/user/SelfStats",
        {
          headers: {
            "x-session-id": sessionStorage.getItem("sessionId"),
          },
        },
        {
          userPosition,
          userShooting,
          userPassing,
          userDribbling,
          userSpeed,
          userDefending,
          userGoalkeeping,
          userId,
        }
      );
      console.log(response);
      alert("등록이 완료되었습니다.");
      response.data.success = nav("/home");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>능력치 등록</h1>
      <Form onSubmit={sendData}>
        <Form.Group className="mb-3">
          <Form.Label>주 포지션</Form.Label>
          <Form.Control
            type="text"
            placeholder="주 포지션을 입력해주세요"
            onChange={(e) => setUserPosition(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>슈팅 능력</Form.Label>
          <Form.Control
            type="text"
            placeholder="슈팅 능력을 입력해주세요"
            onChange={(e) => setUserShooting(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>패스 능력</Form.Label>
          <Form.Control
            type="text"
            placeholder="패스 능력을 입력해주세요"
            onChange={(e) => setUserPassing(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>드리블 능력</Form.Label>
          <Form.Control
            type="text"
            placeholder="드리블 능력을 입력해주세요"
            onChange={(e) => setUserDribbling(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>속도 능력</Form.Label>
          <Form.Control
            type="text"
            placeholder="속도 능력을 입력해주세요"
            onChange={(e) => setUserSpeed(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>수비 능력</Form.Label>
          <Form.Control
            type="text"
            placeholder="수비 능력을 입력해주세요"
            onChange={(e) => setUserDefending(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>골키퍼 능력</Form.Label>
          <Form.Control
            type="text"
            placeholder="골키퍼 능력을 입력해주세요"
            onChange={(e) => setUserGoalkeeping(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          능력치 설정
        </Button>
      </Form>
    </div>
  );
};

export default SelfStats;
