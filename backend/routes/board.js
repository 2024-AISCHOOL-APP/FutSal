const express = require('express');
const router = express.Router();
const conn = require('../config/database');

router.post('/handleWrite', (req, res) => {
    console.log('handleWrite', req.body);

    const { userId, boardType, boardTitle, boardContent, boardDate, boardLike } = req.body;

    const sql = `
        INSERT INTO boardInfo (user_id, board_type, board_title, board_content, board_date, board_like)
        VALUES (?, ?, ?, ?, current_timestamp(), ?)
    `;

    conn.query(sql, [userId, boardType, boardTitle, boardContent, boardLike], (err, results) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }
        const boardId = results.insertId;
        
        //console.log('SQL Results:', results);
        res.json({ success: true, boardId }); 
    });
});

router.post('/likePost', (req, res) => {
    const { postId } = req.body;

    try {
        const sql = `
            UPDATE boardInfo 
            SET board_like = board_like + 1 
            WHERE board_id = ?
        `;

        conn.query(sql, [postId], (err, results) => {
            if (err) {
                console.error('SQL Error:', err);
                return res.status(500).json({ success: false, message: 'Database error occurred' });
            }
            res.json({ success: true });
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
});

router.get('/getPosts', (req, res) => {
    try {
        const sql = 'SELECT * FROM boardInfo';
        conn.query(sql, (err, results) => {
            if (err) {
                // console.error('SQL Error:', err);
                return res.status(500).json({ success: false, message: 'Database error occurred' });
            }
            res.json({ success: true, posts: results });
        });
    } catch(err) {
        //console.error(err);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
});

router.post('/deletePosts', (req, res) => {
    const { postIds } = req.body;

    if (!postIds || postIds.length === 0) {
        return res.status(400).json({ success: false, message: 'No posts selected for deletion' });
    }

    try {
        const sql = `
            DELETE FROM boardInfo 
            WHERE board_id IN (?)
        `;

        conn.query(sql, [postIds], (err, results) => {
            if (err) {
                console.error('SQL Error:', err);
                return res.status(500).json({ success: false, message: 'Database error occurred' });
            }
            res.json({ success: true });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
});

module.exports = router;