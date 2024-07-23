const express = require("express");
const router = express.Router();
const conn = require("../config/database");
const sessionStore = require("../sessionStore"); // 세션 스토어 불러오기

router.post("/handleCreateTeam", (req, res) => {
  console.log("handleCreateTeam", req.body);
  const { userId, teamName, teamIcon, teamArea } = req.body;

  const sql = `
    INSERT INTO teamInfo (user_id, team_name,team_icon,team_area)
    VALUES (?,?,?,?)
    `;
  conn.query(sql, [userId, teamName, teamIcon, teamArea], (err, results) => {
    if (err) {
      console.error("Database error:", err); // 데이터베이스 오류 로깅
      return res
        .status(500)
        .json({ success: false, message: "Database error occurred" });
    }
    res.json({ success: true });
  });
});

module.exports = router;
