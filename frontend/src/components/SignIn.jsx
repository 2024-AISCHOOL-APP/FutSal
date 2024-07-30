import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { UserInfo } from "../UserInfo";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import "./board.css";

const SignIn = () => {
  const { userId, setUserId, userPw, setUserPw } = useContext(UserInfo);
  const nav = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [nickname, setNickname] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userInfoValid, setUserInfoValid] = useState(false);

  const sendData = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post("/user/handleSignIn", {
        userId: userId,
        userPw: userPw,
      });
      if (response.data.success) {
        sessionStorage.setItem("sessionId", response.data.sessionId); // 세션 ID 저장
        sessionStorage.setItem("userId", userId); // 유저 ID 저장
        nav("/"); // 홈 페이지로 이동
      } else {
        nav("/signin"); // 로그인 실패 시 다시 로그인 페이지로 이동
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePasswordResetRequest = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/user/password-reset-request", {
        userId,
        nickname,
      });
      if (response.data.success) {
        setUserInfoValid(true);
        setShowModal(false);
        setShowResetModal(true);
      } else {
        alert("아이디 또는 닉네임이 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("비밀번호 재설정 요청 오류:", error);
      alert("비밀번호 재설정 요청에 실패했습니다.");
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/user/password-reset", {
        userId,
        newPassword,
      });
      if (response.data.success) {
        alert("비밀번호가 성공적으로 재설정되었습니다.");
        setShowResetModal(false);
      } else {
        alert("비밀번호 재설정에 실패했습니다.");
      }
    } catch (error) {
      console.error("비밀번호 재설정 오류:", error);
      alert("비밀번호 재설정에 실패했습니다.");
    }
  };

  return (
    <div className="container">
      <Link
        to="/Home"
        style={{
          display: "inline-block",
          position: "relative",
          top: "-110px",
          left: "75px",
        }}
      >
        <img src="./image/logo2.png" alt="logo" style={{ width: "800px" }} />
      </Link>

      <Form
        onSubmit={sendData}
        className="signin-form"
        style={{
          position: "absolute",
          top: "500px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <Form.Group className="mb-3">
          <Form.Label
            className="input-label"
            style={{
              color: "rgba(0, 0, 0, 0.76)",
              fontSize: "18px",
              fontFamily: "Montserrat",
              fontWeight: "600",
            }}
          >
            아이디
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="아이디를 입력하세요."
            onChange={(e) => setUserId(e.target.value)}
            className="form-input"
            style={{
              width: "715px",
              height: "43px",
              padding: "10px",
              borderRadius: "50px",
              border: "1px solid #ccc",
              fontSize: "16px",
              background: "rgba(218, 218, 218, 0.53)",
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label
            className="input-label"
            style={{
              color: "rgba(0, 0, 0, 0.76)",
              fontSize: "18px",
              fontFamily: "Montserrat",
              fontWeight: "600",
            }}
          >
            비밀번호
          </Form.Label>
          <Form.Control
            type="password"
            placeholder="비밀번호를 입력하세요."
            onChange={(e) => setUserPw(e.target.value)}
            className="form-input"
            style={{
              width: "715px",
              height: "43px",
              padding: "10px",
              borderRadius: "50px",
              border: "1px solid #ccc",
              fontSize: "16px",
              background: "rgba(218, 218, 218, 0.53)",
            }}
          />
        </Form.Group>

        <div className="button" style={{ textAlign: "center", left: "200px" }}>
          <Button variant="primary" type="submit" className="loginButton">
            로그인
          </Button>
        </div>
      </Form>

      <div className="signupPrompt" style={{ top: "770px", left: "280px" }}>
        아직 회원이 아니신가요?
      </div>
      <Link
        to="/signup"
        className="signupButton"
        style={{ top: "770px", left: "600px" }}
      >
        회원가입
      </Link>
      <Button
        className="pwButton"
        style={{ top: "810px", left: "420px" }}
        onClick={() => setShowModal(true)}
      >
        비밀번호 찾기
      </Button>

      {/* 비밀번호 재설정 요청 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>비밀번호 재설정 요청</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePasswordResetRequest}>
            <Form.Group className="mb-3">
              <Form.Label>아이디</Form.Label>
              <Form.Control
                type="text"
                placeholder="아이디를 입력하세요."
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>닉네임</Form.Label>
              <Form.Control
                type="text"
                placeholder="닉네임을 입력하세요."
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              비밀번호 재설정 요청
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* 비밀번호 재설정 모달 */}
      <Modal show={showResetModal} onHide={() => setShowResetModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>비밀번호 재설정</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePasswordReset}>
            <Form.Group className="mb-3">
              <Form.Label>새 비밀번호</Form.Label>
              <Form.Control
                type="password"
                placeholder="새 비밀번호를 입력하세요."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              비밀번호 재설정
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SignIn;
