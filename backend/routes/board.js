const express = require('express');
const router = express.Router();
const conn = require('../config/database');

// 게시물 작성
router.post('/handleWrite', (req, res) => {
    const { userId, boardType, boardTitle, boardContent, boardLike } = req.body;
    const sql = `
        INSERT INTO boardInfo (user_id, board_type, board_title, board_content, board_date, board_like)
        VALUES (?, ?, ?, ?, NOW(), ?)
    `;
    conn.query(sql, [userId, boardType, boardTitle, boardContent, boardLike], (err, results) => {
        if (err) throw err;
        const boardId = results.insertId;
        res.json({ success: true, boardId });
    });
});

// 게시글 가져오기
router.get('/getPosts', (req, res) => {
    const { page = 1, limit = 10, type = 0 } = req.query;
    const offset = (page - 1) * limit;

    let sql = 'SELECT * FROM boardInfo';
    const sqlParams = [];
    
    if (type > 0) {
        sql += ' WHERE board_type = ?';
        sqlParams.push(type);
    }
    sql += ' ORDER BY board_date DESC'; // 최신 게시물 상단으로 정렬
    sql += ' LIMIT ? OFFSET ?';
    sqlParams.push(Number(limit), Number(offset));

    conn.query(sql, sqlParams, (err, results) => {
        if (err) throw err;

        // 게시물 총 개수 계산
        const countSql = 'SELECT COUNT(*) AS totalCount FROM boardInfo' + (type > 0 ? ' WHERE board_type = ?' : '');
        conn.query(countSql, type > 0 ? [type] : [], (err, countResults) => {
            if (err) throw err;
            const totalCount = countResults[0].totalCount;
            res.json({ success: true, posts: results, totalCount });
        });
    });
});

// 게시글 상세 조회
router.get('/posts/:board_id', (req, res) => {
    const { board_id } = req.params;
    const sql = 'SELECT * FROM boardInfo WHERE board_id = ?';
    conn.query(sql, [board_id], (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            res.status(404).json({ success: false, message: 'Post not found' });
        } else {
            res.json({ success: true, post: results[0] });
        }
    });
});

// 게시글 수정
router.put('/posts/:board_id', (req, res) => {
    const { board_id } = req.params;
    const { board_content } = req.body;
    const userId = req.headers.userid;

    conn.query('SELECT user_id FROM boardInfo WHERE board_id = ?', [board_id], (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
            res.status(404).json({ success: false, message: 'Post not found' });
        } else if (results[0].user_id !== userId) {
            res.status(403).json({ success: false, message: 'You are not authorized to edit this post' });
        } else {
            conn.query('UPDATE boardInfo SET board_content = ? WHERE board_id = ?', [board_content, board_id], (err, results) => {
                if (err) throw err;
                res.json({ success: true });
            });
        }
    });
});

// 게시글 삭제
router.delete('/posts/:board_id', (req, res) => {
    const { board_id } = req.params;
    const userId = req.headers.userid;

    // 게시글의 작성자와 사용자가 일치하는지 확인
    conn.query('SELECT user_id FROM boardInfo WHERE board_id = ?', [board_id], (err, results) => {
    
        // 댓글 삭제
        conn.query('DELETE FROM commentInfo WHERE board_id = ?', [board_id], (err) => {
            if (err) return res.status(500).json({ success: false, message: 'Failed to delete comments' });

            // 게시글 삭제
            conn.query('DELETE FROM boardInfo WHERE board_id = ?', [board_id], (err) => {
                if (err) return res.status(500).json({ success: false, message: 'Failed to delete post' });

                res.json({ success: true, message: 'Post successfully deleted' });
            });
        });
    });
});

module.exports = router;