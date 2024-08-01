import React from "react";
import MiniBoard from "./MiniBoard";
import "../css/Home.css";

const Home = () => {
  return (
    <div className="container">
      <div className="h-container">
        <div className="logoContainer">
          <img
            src={process.env.PUBLIC_URL + "/Logo/Navbar-Logo.jpeg"}
            className="logo"
            alt="Logo"
          />
        </div>
        <div className="boardContainer">
          <div className="mini-board-wrapper">
            <h4 className="board-title">공지사항</h4>
            <MiniBoard type={1} />
          </div>
          <div className="mini-board-wrapper">
            <h4 className="board-title">자유게시판</h4>
            <MiniBoard type={2} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
