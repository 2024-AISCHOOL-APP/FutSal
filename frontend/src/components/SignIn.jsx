import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { UserInfo } from "../UserInfo";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./board.css";

const SignIn = () => {
  const { userId, setUserId, userPw, setUserPw } = useContext(UserInfo);

  const nav = useNavigate();

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
      <Link
        to="/password-reset"
        className="pwButton"
        style={{ top: "810px", left: "420px" }}
      >
        비밀번호 찾기
      </Link>
    </div>
  );
};

export default SignIn;
