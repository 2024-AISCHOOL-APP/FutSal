import React, { useEffect, useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useNavigate } from "react-router-dom";
import "../css/navbar.css";

const NavMenu = () => {
  const [userId, setUserId] = useState(sessionStorage.getItem("userId"));
  const nav = useNavigate();

  useEffect(() => {
    const handleUserChange = () => {
      setUserId(sessionStorage.getItem("userId"));
    };

    window.addEventListener("userChange", handleUserChange);

    return () => {
      window.removeEventListener("userChange", handleUserChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const sessionId = sessionStorage.getItem("sessionId");
      const response = await axios.post(
        "http://localhost:8000/api/logout",
        {},
        {
          headers: {
            "x-session-id": sessionId,
          },
        }
      );

      if (response.data.success) {
        console.log("Logout successful"); // 로그 추가
        sessionStorage.removeItem("sessionId"); // 세션 아이디 삭제
        sessionStorage.removeItem("userId"); // 사용자 아이디 삭제
        const event = new Event("userChange");
        window.dispatchEvent(event);
        nav("/signin");
      } else {
        alert("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred during logout");
    }
  };

  return (
    <Navbar expand="lg" style={{ backgroundColor: "#80E5A8" }}>
      <Container fluid>
        <Navbar.Brand href="/" className="Navbar-brand">
          <img
            src={process.env.PUBLIC_URL + "/Logo/Navbar-Logo.jpeg"}
            width="100px"
            alt="Navbar Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll" className="flex-grow-1">
          <Nav
            className="justify-content-end flex-grow-1 pe-3"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Link to="/board" className="nav-link">
              게시판
            </Link>
            <NavDropdown title="팀" id="navbarScrollingDropdown">
              <NavDropdown.Item onClick={() => nav("/team")}>
                마이 팀
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => nav("/teamlist")}>
                팀 찾기
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => nav("/createteam")}>
                팀 생성
              </NavDropdown.Item>
            </NavDropdown>
            {userId ? (
              <>
                <Link to="/mypage" className="nav-link">
                  마이페이지
                </Link>
                <button
                  onClick={handleLogout}
                  className="nav-link btn btn-link"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link to="/signin" className="nav-link">
                로그인
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavMenu;
