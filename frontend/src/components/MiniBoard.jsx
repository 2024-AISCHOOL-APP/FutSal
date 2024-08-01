import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import "../css/MiniBoard.css";

const MiniBoard = ({ type }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/board/getPosts", {
          params: {
            page: 1,
            limit: 10,
            type: type,
          },
        });
        setPosts(response.data.posts);
      } catch (error) {
        setError("게시글을 가져오는 데 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [type]);

  const handleRowClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <div className="mini-board">
      {loading && <p>로딩 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Table className="mini-table" striped bordered hover>
        <thead>
          <tr>
            <th className="wr">작성자</th>
            <th className="na">제목</th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map((post) => (
              <tr
                key={post.board_id}
                onClick={() => handleRowClick(post.board_id)}
                style={{ cursor: "pointer" }}
              >
                <td className="wr truncate">{post.user_id}</td>
                <td className="na truncate">{post.board_title}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="text-center">
                게시글이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default MiniBoard;
