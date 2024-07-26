import React, { useContext, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { UserInfo } from "../UserInfo";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

const Update = () => {
  const {
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

  // 로컬 상태 추가
  const [localNickname, setLocalNickname] = useState(userNickname);
  const [localImg, setLocalImg] = useState(userImg);
  const [localAge, setLocalAge] = useState(userAge);
  const [localHeight, setLocalHeight] = useState(userHeight);
  const [localWeight, setLocalWeight] = useState(userWeight);
  const [localArea, setLocalArea] = useState(userArea);
  const [localEmail, setLocalEmail] = useState(userEmail);
  const [userPw, setUserPw] = useState("");
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
          userNickname: localNickname,
          userImg: localImg,
          userAge: localAge,
          userHeight: localHeight,
          userWeight: localWeight,
          userArea: localArea,
          userEmail: localEmail,
        },
        {
          headers: {
            "x-session-id": sessionStorage.getItem("sessionId"),
          },
        }
      );
      console.log(response);
      if (response.data.success) {
        setUserNickname(localNickname); // 글로벌 상태 업데이트
        setUserImg(localImg);
        setUserAge(localAge);
        setUserHeight(localHeight);
        setUserWeight(localWeight);
        setUserArea(localArea);
        setUserEmail(localEmail);
        alert("회원정보가 수정되었습니다.");
      } else {
        nav("/update");
      }
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
            value={localNickname}
            onChange={(e) => setLocalNickname(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Profile Image URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="Image URL"
            value={localImg}
            onChange={(e) => setLocalImg(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Age</Form.Label>
          <Form.Control
            type="number"
            placeholder="Age"
            value={localAge}
            onChange={(e) => setLocalAge(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Height</Form.Label>
          <Form.Control
            type="number"
            placeholder="Height"
            value={localHeight}
            onChange={(e) => setLocalHeight(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Weight</Form.Label>
          <Form.Control
            type="number"
            placeholder="Weight"
            value={localWeight}
            onChange={(e) => setLocalWeight(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Area</Form.Label>
          <Form.Control
            type="text"
            placeholder="Area"
            value={localArea}
            onChange={(e) => setLocalArea(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Email"
            value={localEmail}
            onChange={(e) => setLocalEmail(e.target.value)}
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
