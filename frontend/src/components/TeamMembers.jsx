import React, { useEffect, useState } from "react";
import axios from "axios";

const TeamMembers = ({ teamId }) => {
  const [members, setMembers] = useState([]);
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get(`/team/members?teamId=${teamId}`);

        if (response.data.success) {
          setMembers(response.data.data);
        } else {
          console.error("Failed to fetch team members:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };

    fetchTeamMembers();
  }, [teamId]);
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>회원 닉네임</th>
            <th>나이</th>
            <th>키</th>
            <th>몸무게</th>
            <th>주 포지션</th>
            <th>슈팅</th>
            <th>패스</th>
            <th>드리블</th>
            <th>스피드</th>
            <th>수비</th>
            <th>골키퍼</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.user_nickName}>
              <td>{member.user_nickName}</td>
              <td>{member.user_age}</td>
              <td>{member.user_height}</td>
              <td>{member.user_weight}</td>
              <td>{member.user_position}</td>
              <td>{member.user_shooting}</td>
              <td>{member.user_passing}</td>
              <td>{member.user_dribbling}</td>
              <td>{member.user_speed}</td>
              <td>{member.user_defending}</td>
              <td>{member.user_goalkeeping}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamMembers;
