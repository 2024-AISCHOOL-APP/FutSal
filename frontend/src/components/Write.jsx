import React, { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from '../axios';
import { Link, useNavigate } from 'react-router-dom';
import { BoardInfo } from '../BoardInfo';

const Write = () => {
    const { boardType, setBoardType, boardTitle, setBoardTitle, boardContent, setBoardContent, boardDate, setBoardDate, boardLike, setBoardLike } = useContext(BoardInfo);
    const [userId, setUserId] = useState(null); // userId 상태 추가
    const [sessionId, setSessionId] = useState(null); // sessionId 상태 추가
    const nav = useNavigate();

    useEffect(() => {
        // userId와 sessionId를 세션 스토리지에서 가져오기
        const storedUserId = sessionStorage.getItem('userId');
        const storedSessionId = sessionStorage.getItem('sessionId');

        if (storedUserId && storedSessionId) {
            setUserId(storedUserId);
            setSessionId(storedSessionId);
        } else {
            // 사용자 ID가 없거나 세션이 만료된 경우 처리
            console.error('사용자 ID 또는 세션 ID를 세션 스토리지에서 가져올 수 없습니다.');
            nav('/signin'); // 로그인 페이지로 리디렉션
        }

        // 초기값 설정
        if (boardType === undefined) setBoardType(1); // 기본값 : '공지게시판'
        if (boardDate === undefined) setBoardDate(new Date().toISOString().slice(0, 10));
        if (boardLike === undefined) setBoardLike(0); // 기본값 : 0
    }, [setBoardType, setBoardDate, setBoardLike, boardType, boardDate, boardLike, nav]);

    const sendData = async (e) => {
        e.preventDefault();
        try {
            if (!userId) {
                console.error('사용자 ID가 설정되지 않았습니다.');
                return;
            }
            const response = await axios.post('/board/handleWrite', {
                userId,
                boardType,
                boardTitle,
                boardContent,
                boardDate,
                boardLike: boardLike || 0  // boardLike를 추가
            });
            console.log("response : ", response);
            if (response.data.success) {
                // 게시물 작성 후 상태를 초기화
                setBoardType(1);
                setBoardTitle('');
                setBoardContent('');
                setBoardDate(new Date().toISOString().slice(0, 10));
                setBoardLike(0);
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
                        value={boardType || ''} 
                        onChange={e => setBoardType(Number(e.target.value))}
                    >
                        <option value="">선택하세요</option>
                        <option value={1}>공지게시판</option>
                        <option value={2}>자유게시판</option>
                        <option value={3}>용병게시판</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>제목</Form.Label>
                    <Form.Control
                        type="text"
                        value={boardTitle || ''} 
                        onChange={e => setBoardTitle(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>내용</Form.Label>
                    <Form.Control
                        as="textarea"
                        value={boardContent || ''} 
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
