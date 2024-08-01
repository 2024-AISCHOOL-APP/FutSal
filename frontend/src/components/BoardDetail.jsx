import React, { useEffect, useState } from "react";
import axios from "../axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Spinner, Button, Modal, Form } from "react-bootstrap";
import Comment from "./Comment"; // 댓글 컴포넌트 임포트
import "../css/board.css";

const getBoardTypeName = (type) => {
  const boardTypes = {
    1: "공지게시판",
    2: "자유게시판",
    3: "용병게시판",
  };
  return boardTypes[type] || "알 수 없음";
};

const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  const date = new Date(dateString);
  return date.toLocaleString("ko-KR", options).replace(",", "");
};

const BoardDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [userId, setUserId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    const storedSessionId = sessionStorage.getItem("sessionId");

    if (storedUserId && storedSessionId) {
      setUserId(storedUserId);
      setSessionId(storedSessionId);
    }
  }, []);

  useEffect(() => {
    if (userId && sessionId) {
      const fetchPost = async () => {
        const response = await axios.get(`/board/posts/${id}`, {
          headers: {
            userId: userId,
            sessionId: sessionId,
          },
        });
        setPost(response.data.post);
        setEditContent(response.data.post.board_content);
        setIsAuthor(response.data.post.user_id === userId);
        setLoading(false);
      };

      fetchPost();
    }
  }, [id, userId, sessionId]);

  const handleDelete = async () => {
    await axios.delete(`/board/posts/${id}`, {
      headers: {
        userId: userId,
        sessionId: sessionId,
      },
    });
    navigate("/board");
  };

  const handleEdit = async () => {
    const contentToUpdate = editContent.trim() || " ";

    await axios.put(
      `/board/posts/${id}`,
      { board_content: contentToUpdate },
      {
        headers: {
          userId: userId,
          sessionId: sessionId,
        },
      }
    );
    setPost((prevPost) => ({
      ...prevPost,
      board_content: contentToUpdate,
    }));
    setShowEditModal(false);
  };

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  if (!post) {
    return <p>게시글을 찾을 수 없습니다.</p>;
  }

  return (
    <div className="board-container">
      <Card className="mt-4 board-detail-card card border-0">
        <Card.Header as="h2" className="text-left p-0 board-title">
          {post.board_title}
        </Card.Header>
        <Card.Body>
          <div className="mb-3 board-info">
            <Card.Text className="board-meta" style={{ fontSize: "1rem" }}>
              <strong>작성자:</strong> {post.user_id}
              &nbsp;<strong>게시글 타입:</strong>{" "}
              {getBoardTypeName(post.board_type)}
              &nbsp;<strong>작성일:</strong> {formatDate(post.board_date)}
            </Card.Text>
          </div>
          <Card.Text className="border p-3 bg-light board-content">
            {post.board_content}
          </Card.Text>
          {isAuthor && (
            <div className="button-group text-right mt-3">
              <Button variant="primary" onClick={() => setShowEditModal(true)}>
                수정
              </Button>
              <Button variant="danger" className="ml-2" onClick={handleDelete}>
                삭제
              </Button>
            </div>
          )}
        </Card.Body>
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>게시글 수정</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formEditContent">
                <Form.Label>내용</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className="text-right">
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              닫기
            </Button>
            <Button variant="primary" onClick={handleEdit} className="ml-2">
              저장
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>
      <br />
      {/* 댓글 컴포넌트 추가 */}
      <Comment boardId={id} />
    </div>
  );
};

export default BoardDetail;
