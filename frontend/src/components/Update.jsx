import React, { useContext, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { UserInfo } from "../UserInfo";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

const Update = () => {
  const {
    userPw,
    setUserPw,
    userNickname,
    setUserNickname,
    userImg,
    setUserImg,
    userAge,
    setUserAge,
    userHeight,
    setUserHeight,
    userWeight,
    setUserWeight,
    userArea,
    setUserArea,
    userEmail,
    setUserEmail,
  } = useContext(UserInfo);
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState(false); // 상태 추가: 비밀번호 불일치 에러 표시용
  const [userId, setUserId] = useState(null); // userId 상태 추가

  const nav = useNavigate();

  // 사용자 ID 가져오기
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
        alert("Session expired, please login again.");
        nav("/login");
      }
    };

    fetchSessionData();
  }, [nav]);

  const sendData = async (e) => {
    e.preventDefault();

    const userId = sessionStorage.getItem("userId");

    // 비밀번호 일치 확인
    if (userPw !== confirmPw) {
      setPwError(true); // 비밀번호 불일치 상태 설정
      return; // 비밀번호가 일치하지 않으면 여기서 함수 종료
    }
    setPwError(false); // 비밀번호 일치 시 에러 상태 해제

    try {
      const response = await axios.post(
        "/user/handleUpdate",
        {
          userId,
          userPw,
          userNickname,
          userImg,
          userAge,
          userHeight,
          userWeight,
          userArea,
          userEmail,
        },
        {
          headers: {
            "x-session-id": sessionStorage.getItem("sessionId"),
          },
        }
      );
      console.log(response);
      response.data.success ? nav("/home") : nav("/update");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>회원 정보 수정</h1>
      <Form onSubmit={sendData}>
        <Form.Group className="mb-3">
          <Form.Label>변경 비밀번호</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(e) => setUserPw(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>비밀번호 확인</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPw(e.target.value)}
            isInvalid={pwError}
          />
          {pwError && (
            <Form.Control.Feedback type="invalid">
              비밀번호가 일치하지 않습니다.
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Nickname</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nickname"
            onChange={(e) => setUserNickname(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Profile Image URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="Image URL"
            onChange={(e) => setUserImg(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Age</Form.Label>
          <Form.Control
            type="number"
            placeholder="Age"
            onChange={(e) => setUserAge(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Height</Form.Label>
          <Form.Control
            type="number"
            placeholder="Height"
            onChange={(e) => setUserHeight(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Weight</Form.Label>
          <Form.Control
            type="number"
            placeholder="Weight"
            onChange={(e) => setUserWeight(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Area</Form.Label>
          <Form.Control
            type="text"
            placeholder="Area"
            onChange={(e) => setUserArea(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Email"
            onChange={(e) => setUserEmail(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Update
        </Button>
      </Form>
    </div>
  );
};

export default Update;
