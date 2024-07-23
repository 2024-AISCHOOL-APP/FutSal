// 4-3. User페이지 경로 설정
// 프론트에서 입력한 데이터를 가져와 출력
const express = require('express');
const router = express.Router();
const conn = require('../config/database')
const bcrypt = require('bcrypt');

router.post('/handleSignIn', (req, res) => {
    console.log('handleSignIn', req.body);
    const { userId, userPw } = req.body;

    const sql = `
        SELECT user_id, user_pw
        FROM userInfo
        WHERE user_id=?
    `;
    conn.query(sql, [userId], async (err, rows) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }
        if (rows.length > 0) {
            const user = rows[0];

            // 비밀번호 비교
            const match = await bcrypt.compare(userPw, user.user_pw);
            if (match) {
                console.log('로그인 성공');
                req.session.user = user;
                res.json({
                    success: true
                });
            } else {
                console.log('로그인 실패: 비밀번호 불일치');
                res.json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }
        } else {
            console.log('로그인 실패: 사용자 없음');
            res.json({
                success: false,
                message: 'User not found'
            });
        }
    });
});

router.post('/handleSignUp', async (req, res) => {
    console.log(req.body);
    const { userId, userPw, userNickname, userGender, userAge, userHeight, userWeight, userEmail } = req.body;

    try {
        const saltRounds = 10;
        const hashedPw = await bcrypt.hash(userPw, saltRounds);

        const sql = `
        INSERT INTO userInfo (user_id, user_pw, user_nickname, user_gender, user_age, user_height, user_weight, user_email)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        conn.query(sql, [userId, hashedPw, userNickname, userGender, userAge, userHeight, userWeight, userEmail], (err, results) => {
            if (err) {
                console.error('SQL Error:', err);
                return res.status(500).json({ success: false, message: 'Database error occurred' });
            }
            console.log('SQL Results:', results);
            res.json({ success: true });
        });
    } catch (err) {
        console.error('Error during password hashing:', err);
        res.status(500).json({ success: false, message: 'Error occurred during sign-up process' });
    }
});

module.exports = router;