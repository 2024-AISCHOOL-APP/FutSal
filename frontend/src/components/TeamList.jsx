import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
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
    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
            <Spinner animation="border" role="status">
                <span className="visually-hidden">로딩 중...</span>
            </Spinner>
        </Container>
    );
}

  return (
    <Container>
            <Row className="my-4">
                <Col>
                    <h1 className="text-center">Team List</h1>
                </Col>
            </Row>
            <Table striped bordered hover responsive>
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
                        <tr key={team.id} onClick={() => handleRowClick(team.id)} style={{ cursor: "pointer" }}>
                            <td>{team.name}</td>
                            <td>
                                <img src={team.icon} alt={team.name} style={{ width: "50px", height: "50px" }} />
                            </td>
                            <td>{team.area}</td>
                            <td>{team.score}</td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <img src={team.image_url} alt={team.name} style={{ width: "50px", height: "50px", marginRight: "10px" }} />
                                    <p className="mb-0">{team.description}</p>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Row className="my-4">
                <div className="pagination">
                <Button className="pagination-buttons" variant="primary" onClick={handlePreviousPage} disabled={currentPage === 1}>
                    이전
                </Button>
                <span className="pagination-info">페이지 {currentPage} / {totalPages}</span>
                <Button className="pagination-buttons" variant="primary" onClick={handleNextPage} disabled={currentPage === totalPages}>
                    다음
                </Button>
            </div>
            </Row>
        </Container>
  );
};

export default TeamList;
