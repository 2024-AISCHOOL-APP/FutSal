const express = require('express');
const router = express.Router();
const conn = require('../config/database');
const sessionStore = require("../sessionStore"); // 세션 스토어 불러오기

// 팀 스코어 가져오기
router.get('/winrate', (req, res) => {
    const { teamId } = req.query; // teamId를 쿼리 파라미터에서 가져옴

    if (!teamId) {
        return res.status(400).json({ success: false, message: 'Team ID is required' });
    }

    // teamInfo 테이블에서 팀 스코어 가져오기
    const sql = 'SELECT team_score FROM teamInfo WHERE team_id = ?'; // 수정된 쿼리문

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

// 사용자 정보 가져오기
router.get('/userInfo', (req, res) => { 
    const sessionId = req.headers['x-session-id'];

    if (!sessionId) {
        return res.status(400).json({ success: false, message: 'Session ID is required' });
    }

    console.log(`Session ID received: ${sessionId}`); // 디버깅용 로그

    // 세션 저장소에서 사용자 정보 가져오기
    sessionStore.get(sessionId, (err, session) => {
        if (err || !session) {
            console.error('Session error:', err);
            return res.status(500).json({ success: false, message: 'Session error occurred' });
        }

        const userId = session.user.user_id;

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is missing in session' });
        }

        // userInfo 테이블에서 사용자 팀 ID 가져오기
        const sql = 'SELECT team_id FROM userInfo WHERE user_id = ?';

        conn.query(sql, [userId], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ success: false, message: 'Database error occurred' });
            }

            if (results.length === 0) {
                return res.status(404).json({ success: false, message: 'No data found for the given user ID' });
            }
            const { team_id } = results[0];

            res.json({
                success: true,
                data: { teamId: team_id }
            });
        });
    });
});

module.exports = router;
