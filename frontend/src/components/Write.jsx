import React, { useState, useContext, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from '../axios';
import { Link, useNavigate } from 'react-router-dom';
import { UserInfo } from '../UserInfo';
import { BoardInfo } from '../BoardInfo';

const Write = () => {
    const { userId } = useContext(UserInfo);
    const { boardType, setBoardType, boardTitle, setBoardTitle, boardContent, setBoardContent, boardDate, setBoardDate, boardLike, setBoardLike } = useContext(BoardInfo);
    const nav = useNavigate();

    useEffect(() => {
        setBoardType(1); // 기본값 설정: '공지게시판'
        setBoardDate(new Date().toISOString().slice(0, 10));
        setBoardLike(0); // 기본값 설정: 0
    }, [setBoardType, setBoardDate, setBoardLike]);

    const sendData = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/board/handleWrite', {
                userId,
                boardType,
                boardTitle,
                boardContent,
                boardDate,
                boardLike
            });
            console.log("response : ", response);
            if (response.data.success) {
                nav('/board');
            } else {
                nav('/write');
            }
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    return (
        <div>
            <Form onSubmit={sendData}>
                <Form.Group className="mb-3">
                    <Form.Label>게시글 타입</Form.Label>
                    <Form.Control
                        as="select"
                        value={boardType}
                        onChange={e => setBoardType(Number(e.target.value))}
                    >
                        <option value={1}>공지게시판</option>
                        <option value={2}>일반게시판</option>
                        <option value={3}>용병게시판</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>제목</Form.Label>
                    <Form.Control
                        type="text"
                        value={boardTitle}
                        onChange={e => setBoardTitle(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>내용</Form.Label>
                    <Form.Control
                        as="textarea"
                        value={boardContent}
                        onChange={e => setBoardContent(e.target.value)}
                    />
                </Form.Group>
                <Button variant="info" type="submit">작성완료</Button>
                <Button variant="secondary">
                    <Link to='/board' style={{ color: 'white', textDecoration: 'none' }}>취소</Link>
                </Button>
            </Form>
        </div>
    );
};

export default Write;