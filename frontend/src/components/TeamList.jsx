import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(
    sessionStorage.getItem("userId") || "defaultUserId"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    const storedSessionId = sessionStorage.getItem("sessionId");

    if (storedUserId && storedSessionId) {
      setUserId(storedUserId);
      setSessionId(storedSessionId);
    } else {
    }
  }, [navigate]);

  // 팀 데이터를 가져오는 함수
  const fetchTeams = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/team/teamlist", {
        headers: {
          "x-session-id": sessionId,
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

  useEffect(() => {
    fetchTeams();
  }, [currentPage, userId]);

  useEffect(() => {
    // 검색어에 따라 팀 데이터 필터링
    const filtered = teams.filter((team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTeams(filtered);
  }, [searchTerm, teams]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // 검색어가 변경될 때 페이지를 1로 초기화
  };

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
    navigate(`/team/${teamId}`);
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
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
      <Row className="my-4">
        <Col>
          <Form.Label className="form-label">검색</Form.Label>
          <Form.Control
            type="text"
            placeholder="팀 이름 검색"
            value={searchTerm}
            onChange={handleSearch}
          />
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
          {filteredTeams.length > 0 ? (
            filteredTeams.map((team) => (
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
                  <div className="d-flex align-items-center">
                    <img
                      src={team.image_url}
                      alt={team.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        marginRight: "10px",
                      }}
                    />
                    <p className="mb-0">{team.description}</p>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                팀이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <Row className="my-4">
        <div className="pagination">
          <Button
            className="pagination-buttons"
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
            className="pagination-buttons"
            variant="primary"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            다음
          </Button>
        </div>
      </Row>
    </Container>
  );
};

export default TeamList;
