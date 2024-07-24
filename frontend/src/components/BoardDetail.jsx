import React, { useContext, useEffect, useState } from 'react';
import axios from '../axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Spinner, Button, Modal, Form } from 'react-bootstrap';
import { UserInfo } from '../UserInfo';

const BoardDetail = () => {
    const { id } = useParams(); // 
    const [post, setPost] = useState(null); // 게시글 데이터 저장할 상태 
    const [loading, setLoading] = useState(true); // 로딩 상태 
    const [showEditModal, setShowEditModal] = useState(false); // 수정 모달 표시 상태 
    const [editContent, setEditContent] = useState(''); // 수정할 게시글 내용 
    const { userId } = useContext(UserInfo); // 현재 로그인 사용자 id 
    const [currentUserId, setCurrentUserId] = useState(''); // 현재 사용자 id 상태
    const navigate = useNavigate(); // 페이지 이동 훅 

    // 게시글 가져오기 
    useEffect(() => { 
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/board/Posts/${id}`);
                setPost(response.data.post);
                setEditContent(response.data.post.board_content);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        // 현재 사용자 데이터 가져오기 ( 404에러 )
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get(`/user/${userId}`); // 사용자 id로 사용자 데이터 요청 
                setCurrentUserId(response.data.user_id); // 사용자 id 상태에 저장 
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };
        fetchPost(); // 게시글 데이터 가져오기 
        fetchCurrentUser(); // 현재 사용자 데이터 가져오기 호출 
    }, [id, userId]); 

    // 게시글 삭제 함수 
    const handleDelete = async () => {
        try {
            await axios.delete(`/board/Posts/${id}`);
            navigate('/board');
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    // 게시글 수정 함수 
    const handleEdit = async () => {
        try {
            await axios.put(`/board/Posts/${id}`, { board_content: editContent });
            setPost(prevPost => ({
                ...prevPost,
                board_content: editContent
            }));
            setShowEditModal(false);
        } catch (error) {
            console.error('Error editing post:', error);
        }
    };

    if (loading) {
        return <Spinner animation="border" variant="primary" />;
    }

    if (!post) {
        return <p>게시글을 찾을 수 없습니다.</p>;
    }

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

    return (
        <Card className="mt-4">
            <Card.Header as="h2">{post.board_title}</Card.Header>
            <Card.Body>
                <div className="mb-3">
                    <Card.Text>
                        <strong>작성자:</strong> {post.user_id}
                        &nbsp;<strong>게시글 타입:</strong> {getBoardTypeName(post.board_type)}
                        &nbsp;<strong>날짜:</strong> {post.board_date}
                        &nbsp;<strong>좋아요 수:</strong> {post.board_like}
                    </Card.Text>
                </div>
                <Card.Text className="border p-3 bg-light">
                    <strong>내용</strong>
                    <br />
                    {post.board_content}
                </Card.Text>
                {currentUserId === post.user_id && (
                    <div className="mt-3">
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
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        닫기
                    </Button>
                    <Button variant="primary" onClick={handleEdit}>
                        저장
                    </Button>
                </Modal.Footer>
            </Modal>
        </Card>
    );
};

export default BoardDetail;