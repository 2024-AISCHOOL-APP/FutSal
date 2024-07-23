import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const nav = useNavigate(null);

  function upDate() {
    nav("update");
  }
  return (
    <div>
      Home
      <div>
        <button onClick={upDate}>회원정보 수정</button>
      </div>
    </div>
  );
};

export default Home;
