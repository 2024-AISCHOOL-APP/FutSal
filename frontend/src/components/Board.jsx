import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import axios from "../axios";
import { Link, useNavigate } from "react-router-dom";
import "../css/board.css";
import { Button } from "react-bootstrap";

// 게시글 타입 숫자를 문자열로 변환하는 함수
const getBoardTypeName = (type) => {
  const boardTypes = {
    1: "공지게시판",
    2: "자유게시판",
    3: "용병게시판",
  };
  return boardTypes[type] || "알 수 없음";
};

// 날짜 포맷팅
const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  const date = new Date(dateString);
  return date.toLocaleString("ko-KR", options).replace(",", ""); // 한국어 로케일 사용
};

const Board = () => {
  const [boardsId, setBoardsId] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedType, setSelectedType] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(""); // 초기값 빈 문자열로 설정
  const [sessionId, setSessionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    const storedSessionId = sessionStorage.getItem("sessionId");

    if (storedUserId && storedSessionId) {
      setUserId(storedUserId);
      setSessionId(storedSessionId);
    } else {
      setUserId("");
      setSessionId(null);
    }
  }, [navigate]);

  // 게시글 데이터를 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/board/getPosts", {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            type: selectedType,
          },
          headers: {
            "x-session-id": sessionId || "",
            "user-id": userId || "",
          },
        });
        setBoardsId(response.data.posts);
        setFilteredPosts(response.data.posts);
        setTotalPages(Math.ceil(response.data.totalCount / itemsPerPage)); // 페이지 수 재계산
      } catch (error) {
        setError("게시글을 가져오는 데 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [selectedType, currentPage, userId, sessionId]);

  // 게시글 타입 필터링
  const filterByType = (type) => {
    setSelectedType(type);
    setCurrentPage(1); // 타입 필터링 변경 시 페이지를 첫 페이지로 리셋
  };

  // 게시글 검색
  useEffect(() => {
    const filtered = boardsId.filter(
      (post) =>
        post.board_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.user_id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchQuery, boardsId]);

  // 게시글 클릭 핸들러
  const handleRowClick = (postId) => {
    navigate(`/posts/${postId}`);
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

  return (
    <div className="board-container">
      <div className="b-form-row">
        <Form.Group className="b-form-group">
          <Form.Label className="b-form-label" style={{ width: "200px" }}>
            게시글 타입
          </Form.Label>
          <Form.Control
            as="select"
            value={selectedType}
            onChange={(e) => filterByType(Number(e.target.value))}
          >
            <option value={0}>모두 보기</option>
            <option value={1}>공지게시판</option>
            <option value={2}>자유게시판</option>
            <option value={3}>용병게시판</option>
          </Form.Control>
        </Form.Group>

        <Form.Group className="b-search-group">
          <Form.Label className="b-form-label">검색</Form.Label>
          <Form.Control
            type="text"
            placeholder="제목 또는 작성자로 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Form.Group>
      </div>

      {/* 로딩 및 오류 처리 */}
      {loading && <p>로딩 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Table className="b-table" striped bordered hover>
        <thead>
          <tr>
            <th>게시글 타입</th>
            <th className="b-wr">작성자</th>
            <th className="b-na">제목</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody className="b-tbody">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <tr
                key={post.board_id}
                onClick={() => handleRowClick(post.board_id)}
                style={{ cursor: "pointer" }}
              >
                <td>{getBoardTypeName(post.board_type)}</td>
                <td className="b-wr truncate">{post.user_id}</td>
                <td className="b-na truncate">{post.board_title}</td>
                <td>{formatDate(post.board_date)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="b-text-center">
                게시글이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="b-pagination">
        <Button
          className="b-pagination-buttons"
          variant="primary"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          이전
        </Button>
        <span className="b-pagination-info">
          페이지 {currentPage} / {totalPages}
        </span>
        <Button
          className="b-pagination-buttons"
          variant="primary"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          다음
        </Button>
      </div>

      <div className="b-button-write">
        <Link to="/write">글쓰기</Link>
      </div>
    </div>
  );
};

export default Board;
