import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const nav = useNavigate(null);
  const [userId, setUserId] = useState(null);
  function myPage() {
    nav("mypage");
  }

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
      } catch (error) {}
    };

    fetchSessionData();
  }, [nav]);

  function logout() {
    axios
      .post(
        "http://localhost:8000/api/logout",
        {},
        {
          headers: {
            "x-session-id": sessionStorage.getItem("sessionId"),
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          console.log("Logout successful"); // 로그 추가
          sessionStorage.removeItem("sessionId"); // 세션 아이디 삭제
          sessionStorage.removeItem("userId"); // 사용자 아이디 삭제
          nav("/signin");
        } else {
          alert("Logout failed");
        }
      })
      .catch((error) => {
        console.error("Logout error:", error);
        alert("An error occurred during logout");
      });
  }
  return (
    <div>
      <div>
        <button onClick={myPage}>마이페이지</button>
        <button onClick={logout}>로그아웃</button>
      </div>
      <Button variant="dark">
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          HOME
        </Link>
      </Button>
      <Button variant="dark">
        <Link to="/signin" style={{ color: "white", textDecoration: "none" }}>
          SignIn
        </Link>
      </Button>
      <Button variant="dark">
        <Link to="/signup" style={{ color: "white", textDecoration: "none" }}>
          SignUp
        </Link>
      </Button>
      <Button variant="dark">
        <Link to="/board" style={{ color: "white", textDecoration: "none" }}>
          Board
        </Link>
      </Button>
      <Button variant="dark">
        <Link
          to="/createteam"
          style={{ color: "white", textDecoration: "none" }}
        >
          팀생성
        </Link>
      </Button>
      <Button variant="dark">
        <Link to="/teamlist" style={{ color: "white", textDecoration: "none" }}>
          팀 목록
        </Link>
      </Button>
      <Button variant="dark">
        <Link to="/winrate" style={{ color: "white", textDecoration: "none" }}>
          승률(임시)
        </Link>
      </Button>
      <Button variant="dark">
        <Link
          to="/evaluation"
          style={{ color: "white", textDecoration: "none" }}
        >
          평가(임시)
        </Link>
      </Button>
    </div>
  );
};

export default Header;
