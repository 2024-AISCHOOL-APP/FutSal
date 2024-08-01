// src/routes/team.js
const express = require('express');
const router = express.Router();
const conn = require('../config/database');
const sessionStore = require('../sessionStore');

// 팀 스코어 가져오기
router.get('/winrate', (req, res) => {
    const { teamId } = req.query; // teamId를 쿼리 파라미터에서 가져옴

    if (!teamId) {
        return res.status(400).json({ success: false, message: 'Team ID is required' });
    }

    // teamInfo 테이블에서 팀 스코어 가져오기
    const sql = 'SELECT team_score FROM teamInfo WHERE team_id = ?';

    conn.query(sql, [teamId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No data found for the given team ID' });
        }

        const { team_score } = results[0];

        res.json({
            success: true,
            data: { team_score }
        });
    });
});

module.exports = router;
