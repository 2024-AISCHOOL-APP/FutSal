import React, { useEffect, useState } from "react";
import axios from "../axios"; // axios 인스턴스 설정
import { Form, Button, Card, Spinner } from "react-bootstrap";
import "../css/comment.css";

const Comment = ({ boardId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(sessionStorage.getItem("userId"));

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

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/coment/posts/${boardId}/comments`);
        console.log("Response Data:", response.data);
        console.log("Comments:", response.data.comments);
        setComments(response.data.comments);
      } catch (error) {
        console.error("댓글 가져오기 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [boardId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(`/coment/posts/${boardId}/comments`, {
        user_id: userId,
        comment_content: newComment,
      });

      const newCommentWithId = {
        comment_id: response.data.comment_id,
        user_id: userId,
        comment_content: newComment,
        comment_date: new Date().toISOString(), // Assuming the backend doesn't return the comment_date
      };

      setComments([...comments, newCommentWithId]);
      setNewComment("");
    } catch (error) {
      console.error("댓글 추가 중 오류 발생:", error);
    }
  };

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  return (
    <div className="comment-container">
      {/* 댓글 목록 */}
      <div className="comment-list">
        {comments.map((comment) => (
          <Card key={comment.comment_id} className="mb-3 commentBox">
            <Card.Body className="comment-text">
              <Card.Title className="mb-1"></Card.Title>
              <Card.Text>{comment.comment_content}</Card.Text>
              <Card.Text className="text-right">
                작성자: {comment.user_id}
              </Card.Text>
              <Card.Text className="text-right">
                작성일: {formatDate(comment.comment_date)}
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
      {/* 댓글 작성 폼 */}
      <Form
        className="mt-3"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddComment();
        }}
      >
        <Form.Group controlId="formComment">
          <Form.Label>댓글 작성</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 작성하세요..."
          />
        </Form.Group>
        <Button variant="primary" className="mt-2" type="submit">
          저장
        </Button>
      </Form>
    </div>
  );
};

export default Comment;
