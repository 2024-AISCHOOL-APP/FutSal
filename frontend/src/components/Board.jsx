import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from '../axios';
import { Link, useNavigate } from 'react-router-dom';

// 게시글 타입 숫자를 문자열로 변환하는 함수
const getBoardTypeName = (type) => {
    switch (type) {
        case 1:
            return '공지게시판';
        case 2:
            return '자유게시판';
        case 3:
            return '용병게시판';
        default:
            return '알 수 없음';
    }
};

const Board = () => {
    const [boardsId, setBoardsId] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [selectedType, setSelectedType] = useState(0); // 초기값은 0으로 설정 (모두 보기)
    const navigate = useNavigate(); // useNavigate 훅을 사용하여 페이지 이동

    // 게시글 데이터를 가져오기
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('/board/getPosts');
                setBoardsId(response.data.posts);
                setFilteredPosts(response.data.posts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchPosts();
    }, []);

    // 게시글 타입 필터링 함수
    const filterByType = (type) => {
        setSelectedType(type);
    };

    // selectedType 상태가 변경될 때마다 filteredPosts 업데이트
    useEffect(() => {
        if (selectedType === 0) {
            setFilteredPosts(boardsId);
        } else {
            setFilteredPosts(boardsId.filter(post => post.board_type === selectedType));
        }
    }, [selectedType, boardsId]);

    // 좋아요 버튼 클릭 핸들러
    // const handleLike = async (postId) => {
    //     try {
    //         const response = await axios.post('/board/likePost', { postId });
    //         if (response.data.success) {
    //             setBoardsId(boardsId.map(post =>
    //                 post.board_id === postId ? { ...post, board_like: post.board_like + 1 } : post
    //             ));
    //         }
    //     } catch (error) {
    //         console.error('Error liking post:', error);
    //     }
    // };

    // 게시글 클릭 핸들러
    const handleRowClick = (postId) => {
        navigate(`/posts/${postId}`); // 상세 페이지로 이동
    };

    return (
        <div>
            <Form.Group>
                <br></br>
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
            <br></br>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>게시글 타입</th>
                        <th>작성자</th>
                        <th>제목</th>
                        <th>날짜</th>
                        {/* <th>좋아요 수</th>
                        <th></th> */}
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
                                <td>{post.board_date}</td>
                                {/* <td>{post.board_like}</td>
                                <td>
                                    <Button variant="white" onClick={(e) => {e.stopPropagation(); // 클릭 이벤트가 tr로 전파되지 않도록 함
                                            handleLike(post.board_id);}} >💕</Button>
                                </td> */}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">게시글이 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <br></br>
            <Button variant="info">
                <Link to='/write' style={{ color: 'white', textDecoration: 'none' }}>글쓰기</Link>
            </Button>
        </div>
    );
};

export default Board;