import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import axios from "../axios";

const TeamApply = () => {
  const [teamApplys, setTeamApplys] = useState([]);
  const [update, setUpdate] = useState(false); // 상태 변경을 위한 상태 추가

  useEffect(() => {
    const fetchTeamApplys = async () => {
      try {
        const response = await axios.get("/team/getApplys");
        const data = response.data;
        setTeamApplys(data.posts);
      } catch (error) {
        console.error("팀원 가입 목록 가져오기 실패", error);
      }
    };

    fetchTeamApplys();
  }, [update]); // update 상태가 변경될 때마다 실행

  const applyOk = async (userId) => {
    try {
      const response = await axios.post("/team/applyAccept", {
        user_id: userId,
      });
      alert("팀원 가입 완료", response.data);
      setUpdate(!update); // 상태 변경으로 useEffect 트리거
    } catch (error) {
      console.log(error);
    }
  };

  const applyNope = async (userId) => {
    try {
      const response = await axios.post("/team/applyRefuse", {
        user_id: userId,
      });
      alert("팀원 가입 거절 완료", response.data);
      setUpdate(!update); // 상태 변경으로 useEffect 트리거
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>신청 회원</th>
            <th>신청일</th>
            <th>수락 여부</th>
          </tr>
        </thead>
        <tbody>
          {teamApplys.map((apply) => (
            <tr key={apply.id}>
              <td>{apply.user_id}</td>
              <td>{apply.join_date}</td>
              <td>
                <button onClick={() => applyOk(apply.user_id)}>허가</button>
                <button onClick={() => applyNope(apply.user_id)}>거절</button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TeamApply;
