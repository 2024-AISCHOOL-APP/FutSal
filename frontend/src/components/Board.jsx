import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from '../axios';
import { Link } from 'react-router-dom';

const Board = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [selectedType, setSelectedType] = useState(0); // 초기값은 0으로 설정 (모두 보기)
    const [selectedPosts, setSelectedPosts] = useState([]); // 선택된 게시물 ID 상태

    // 게시글 데이터를 가져오기
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('/board/getPosts'); 
                setPosts(response.data.posts);
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
            setFilteredPosts(posts);
        } else {
            setFilteredPosts(posts.filter(post => post.board_type === selectedType));
        }
    }, [selectedType, posts]);

    // 좋아요 버튼 클릭 핸들러
    const handleLike = async (postId) => {
        try {
            const response = await axios.post('/board/likePost', { postId });
            if (response.data.success) {
                setPosts(posts.map(post => 
                    post.board_id === postId ? { ...post, board_like: post.board_like + 1 } : post
                ));
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    // 게시물 선택 핸들러
    const handleSelect = (postId) => {
        setSelectedPosts(prevSelected => 
            prevSelected.includes(postId) 
                ? prevSelected.filter(id => id !== postId)
                : [...prevSelected, postId]
        );
    };

    // 선택된 게시물 삭제 핸들러
    const handleDelete = async () => {
        try {
            const response = await axios.post('/board/deletePosts', { postIds: selectedPosts });
            if (response.data.success) {
                setPosts(posts.filter(post => !selectedPosts.includes(post.board_id)));
                setSelectedPosts([]);
            }
        } catch (error) {
            console.error('Error deleting posts:', error);
        }
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
                    <option value={2}>일반게시판</option>
                </Form.Control>
            </Form.Group>
            <br></br>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>선택</th>
                        <th>board_title</th>
                        <th>user_id</th>
                        <th>board_date</th>
                        <th>board_like</th>
                        <th>actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map(post => (
                            <tr key={post.board_id}>
                                <td>
                                    <input 
                                        type="checkbox" 
                                        checked={selectedPosts.includes(post.board_id)} 
                                        onChange={() => handleSelect(post.board_id)} 
                                    />
                                </td>
                                <td>{post.board_title}</td>
                                <td>{post.user_id}</td>
                                <td>{post.board_date}</td>
                                <td>{post.board_like}</td>
                                <td>
                                    <Button variant="white" onClick={() => handleLike(post.board_id)}>💕</Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">게시글이 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <br></br>
            <Button variant="info">
                <Link to='/write' style={{ color: 'white', textDecoration: 'none' }}>글쓰기</Link>
            </Button>

            <Button variant="secondary">
                <Link to='/update' style={{ color: 'white', textDecoration: 'none' }}>수정하기</Link>
            </Button>

            <Button variant="danger" onClick={handleDelete}>삭제하기</Button>
        </div>
    );
};

export default Board;