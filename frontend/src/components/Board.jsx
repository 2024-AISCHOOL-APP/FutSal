import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from '../axios';
import { Link, useNavigate } from 'react-router-dom';

// 게시글 타입 숫자를 문자열로 변환하는 함수
const getBoardTypeName = (type) => {
    const boardTypes = {
        1: '공지게시판',
        2: '자유게시판',
        3: '용병게시판',
    };
    return boardTypes[type] || '알 수 없음';
};

// 날짜 포맷팅
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', options).replace(',', ''); // 한국어 로케일 사용
};

const Board = () => {
    const [boardsId, setBoardsId] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [selectedType, setSelectedType] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(''); // 초기값 빈 문자열로 설정
    const [sessionId, setSessionId] = useState(null);
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

    // 게시글 데이터를 가져오기
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('/board/getPosts');
                setBoardsId(response.data.posts);
                setFilteredPosts(response.data.posts);
            } catch (error) {
                setError('게시글을 가져오는 데 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    // 게시글 타입 필터링 
    const filterByType = (type) => {
        setSelectedType(type);
    };

    useEffect(() => {
        if (selectedType === 0) {
            setFilteredPosts(boardsId);
        } else {
            setFilteredPosts(boardsId.filter(post => post.board_type === selectedType));
        }
    }, [selectedType, boardsId]);

    // 게시글 클릭 핸들러
    const handleRowClick = (postId) => {
        navigate(`/posts/${postId}`);
    };

    return (
        <div>
            <Form.Group>
                <Form.Label>게시글 타입</Form.Label>
                <Form.Control
                    as="select"
                    value={selectedType}
                    onChange={(e) => filterByType(Number(e.target.value))} // 정수로 변환하여 상태 업데이트
                >
                    <option value={0}>모두 보기</option>
                    <option value={1}>공지게시판</option>
                    <option value={2}>자유게시판</option>
                    <option value={3}>용병게시판</option>
                </Form.Control>
            </Form.Group>

            {/* 로딩 및 오류 처리 */}
            {loading && <p>로딩 중...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>게시글 타입</th>
                        <th>작성자</th>
                        <th>제목</th>
                        <th>작성일</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map(post => (
                            <tr
                                key={post.board_id}
                                onClick={() => handleRowClick(post.board_id)} // 클릭 시 상세 페이지로 이동
                                style={{ cursor: 'pointer' }}
                            >
                                <td>{getBoardTypeName(post.board_type)}</td>
                                <td>{post.user_id}</td>
                                <td>{post.board_title}</td>
                                <td>{formatDate(post.board_date)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">게시글이 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <Button variant="info">
                <Link to='/write' style={{ color: 'white', textDecoration: 'none' }}>글쓰기</Link>
            </Button>
        </div>
    );
};

export default Board;