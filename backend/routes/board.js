const express = require('express');
const router = express.Router();
const conn = require('../config/database');
const sessionStore = require("../sessionStore"); 
// 게시물 작성
router.post('/handleWrite', (req, res) => {
    const { userId, boardType, boardTitle, boardContent, boardLike } = req.body;
    const sql = `
        INSERT INTO boardInfo (user_id, board_type, board_title, board_content, board_date, board_like)
        VALUES (?, ?, ?, ?, NOW(), ?)
    `;
    conn.query(sql, [userId, boardType, boardTitle, boardContent, boardLike], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }
        const boardId = results.insertId;
        res.json({ success: true, boardId });
    });
});

// 게시글 가져오기
router.get('/getPosts', (req, res) => {
    const sql = 'SELECT * FROM boardInfo';
    conn.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }
        res.json({ success: true, posts: results });
    });
});

// 게시글 상세 조회
router.get('/posts/:board_id', (req, res) => {
    const { board_id } = req.params;

    const sql = 'SELECT * FROM boardInfo WHERE board_id = ?';

    conn.query(sql, [board_id], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        res.json({ success: true, post: results[0] });
    });
});

// 게시글 수정
router.put('/posts/:board_id', (req, res) => {
    const { board_id } = req.params;
    const { board_content } = req.body;
    
    // 세션에서 user_id 가져오기
    const userId = req.session.userId; 
    

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const checkAuthorSql = 'SELECT user_id FROM boardInfo WHERE board_id = ?';
    conn.query(checkAuthorSql, [board_id], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        if (results[0].user_id !== userId) {
            return res.status(403).json({ success: false, message: 'You are not authorized to edit this post' });
        }

        const updateSql = 'UPDATE boardInfo SET board_content = ? WHERE board_id = ?';
        conn.query(updateSql, [board_content, board_id], (err, results) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Database error occurred' });
            }
            res.json({ success: true });
        });
    });
});

// 게시글 삭제
router.delete('/posts/:board_id', (req, res) => {
    const { board_id } = req.params;
    
    // 세션에서 user_id 가져오기
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const checkAuthorSql = 'SELECT user_id FROM boardInfo WHERE board_id = ?';
    conn.query(checkAuthorSql, [board_id], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        if (results[0].user_id !== userId) {
            return res.status(403).json({ success: false, message: 'You are not authorized to delete this post' });
        }

        const deleteSql = 'DELETE FROM boardInfo WHERE board_id = ?';
        conn.query(deleteSql, [board_id], (err, results) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Database error occurred' });
            }
            res.json({ success: true });
        });
    });
});

module.exports = router;
