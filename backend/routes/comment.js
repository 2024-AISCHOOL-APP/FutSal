const express = require('express');
const router = express.Router();
const conn = require('../config/database'); 

// 댓글 가져오기
router.get('/posts/:board_id/comments', (req, res) => {
    const { board_id } = req.params;
    const sql = 'SELECT * FROM commentInfo WHERE board_id = ?';
    conn.query(sql, [board_id], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Database error' });
        } else {
            res.json({ success: true, comments: results });
        }
    });
});
// 댓글 작성
router.post('/posts/:board_id/comments', (req, res) => {
    const { board_id } = req.params;
    const { user_id, comment_content } = req.body;
    
    // 현재 시간 설정
    const comment_date = new Date(); 

    // SQL 쿼리문
    const sql = 'INSERT INTO commentInfo (board_id, user_id, comment_content, comment_date, comment_like) VALUES (?, ?, ?, ?, 0)';

    conn.query(sql, [board_id, user_id, comment_content, comment_date], (err, results) => {
        if (err) {
            console.error('Database error:', err); // 에러 로그 추가
            res.status(500).json({ success: false, message: 'Database error' });
        } else {
            res.json({ success: true, comment_id: results.insertId });
        }
    });
});


module.exports = router;