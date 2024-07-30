const express = require("express");
const router = express.Router();
const conn = require("../config/database");
const sessionStore = require("../sessionStore");

router.post('/SelfStats', async (req, res) => {
    const { userId, userPosition, userShooting, userPassing, userDribbling, userSpeed, userDefending, userGoalkeeping } = req.body;

    // 세션 유효성 검사
    const sessionId = req.headers['x-session-id'];
    if (!sessionId || !sessionStore[sessionId] || sessionStore[sessionId].user.user_id !== userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        // 사용자 능력치 저장
        let userStats = await UserStats.findOne({ userId });
        if (userStats) {
            // 이미 존재하는 사용자 업데이트
            userStats.userPosition = userPosition;
            userStats.userShooting = userShooting;
            userStats.userPassing = userPassing;
            userStats.userDribbling = userDribbling;
            userStats.userSpeed = userSpeed;
            userStats.userDefending = userDefending;
            userStats.userGoalkeeping = userGoalkeeping;
        } else {
            // 새로운 사용자 생성
            userStats = new UserStats({
                userId,
                userPosition,
                userShooting,
                userPassing,
                userDribbling,
                userSpeed,
                userDefending,
                userGoalkeeping,
            });
        }

        await userStats.save();
        res.json({ success: true });
    } catch (error) {
        console.error("Error saving user stats:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;