import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(
    sessionStorage.getItem("userId") || "defaultUserId"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate(); // useNavigate 훅 초기화

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get("/team/teamlist", {
          headers: {
            "x-session-id": sessionStorage.getItem("sessionId"),
            "user-id": userId,
          },
          params: {
            page: currentPage,
            limit: itemsPerPage,
          },
        });
        setTeams(response.data.teams);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("팀 정보를 가져오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [userId, currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleRowClick = (teamId) => {
    navigate(`/team/${teamId}`); // 팀 ID를 URL 파라미터로 전달
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <Form.Group>
        <Form.Label>TeamList</Form.Label>
      </Form.Group>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>팀 이름</th>
            <th>팀 아이콘</th>
            <th>팀 지역</th>
            <th>팀 점수</th>
            <th>팀 이미지 및 설명</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr
              key={team.id}
              onClick={() => handleRowClick(team.id)}
              style={{ cursor: "pointer" }}
            >
              <td>{team.name}</td>
              <td>
                <img
                  src={team.icon}
                  alt={team.name}
                  style={{ width: "50px", height: "50px" }}
                />
              </td>
              <td>{team.area}</td>
              <td>{team.score}</td>
              <td>
                <div>
                  <img
                    src={team.image_url}
                    alt={team.name}
                    style={{ width: "50px", height: "50px" }}
                  />
                  <p>{team.description}</p>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="pagination">
        <Button
          variant="primary"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          이전
        </Button>
        <span className="pagination-info">
          페이지 {currentPage} / {totalPages}
        </span>
        <Button
          variant="primary"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          다음
        </Button>
      </div>
    </div>
  );
};

export default TeamList;
