const express = require("express");
const router = express.Router();
const conn = require("../config/database");

// 경기 정보 불러오기
router.get('/matchInfo', (req, res) => {
    const query = `
        SELECT match_num, team_id, match_date, match_place
        FROM matchInfo
    `;

    conn.query(query, (err, results) => {
        if (err) {
            console.error('쿼리 실행 중 오류 발생:', err);
            return res.status(500).json({ message: '서버 오류. 경기 정보를 가져오지 못했습니다.' });
        }
        res.status(200).json(results);
    });
});

// 팀 정보 불러오기
router.get('/teamInfo', (req, res) => {
    const query = `
        SELECT team_id, team_name
        FROM teamInfo
    `;

    conn.query(query, (err, results) => {
        if (err) {
            console.error('쿼리 실행 중 오류 발생:', err);
            return res.status(500).json({ message: '서버 오류. 팀 정보를 가져오지 못했습니다.' });
        }
        res.status(200).json(results);
    });
});

// 평가 데이터 저장
router.post('/postEvaluation', (req, res) => {
    const { matchNum, teamId, matchDate, matchPlace, matchResult, matchShooting, matchPassing, matchDribbling, matchSpeed, matchDefense, matchGoalkeeper } = req.body;

    // 데이터베이스 쿼리
    const query = `
        INSERT INTO matchInfo (
            match_num, team_id, match_date, match_place, match_result, match_shooting, 
            match_passing, match_dribbling, match_speed, match_defending, match_goalkeepin
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        matchNum, teamId, matchDate, matchPlace, matchResult, matchShooting,
        matchPassing, matchDribbling, matchSpeed, matchDefense, matchGoalkeeper
    ];

    conn.query(query, values, (err, results) => {
        if (err) {
            console.error('쿼리 실행 중 오류 발생:', err);
            return res.status(500).json({ message: '서버 오류. 데이터 저장에 실패했습니다.' });
        }
        res.status(201).json({ message: '평가 데이터가 성공적으로 저장되었습니다!', data: results });
    });
});

module.exports = router;
