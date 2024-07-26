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

router.get("/teamInfo", (req, res) => {
  try {
    const sql = `
    SELECT * FROM teamInfo WHERE team_id = ?
    `;
    conn.query(sql, [1], (err, results) => {
      if (err) {
        console.error("Database error:", err); // 데이터베이스 오류 로깅
        return res
          .status(500)
          .json({ success: false, message: "Database error occurred" });
      }
      if (results.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Team not found" });
      }
      res.json({ success: true, data: results[0] });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

router.post("/teamJoin", async (req, res) => {
  const { teamId, userId } = req.body;

  if (!teamId || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Team ID and User ID are required" });
  }
  try {
    // 중복 확인 쿼리
    const checkSql = "SELECT * FROM joinInfo WHERE team_id = ? AND user_id = ?";
    conn.query(checkSql, [teamId, userId], (checkErr, checkResults) => {
      if (checkErr) {
        console.error("중복 확인 실패:", checkErr);
        return res.status(500).json({
          success: false,
          message: "데이터베이스 오류가 발생했습니다.",
        });
      }

      if (checkResults.length > 0) {
        // 이미 가입 신청된 경우
        return res
          .status(400)
          .json({ success: false, message: "이미 가입 신청 하셨습니다." });
      }

      // 중복이 아닌 경우, 가입 신청 처리
      const sql =
        "INSERT INTO joinInfo (team_id, user_id, join_date) VALUES (?, ?, NOW())";
      conn.query(sql, [teamId, userId], (err, results) => {
        if (err) {
          console.error("팀 가입 실패:", err);
          return res;
        }
        return res
          .status(200)
          .json({ success: true, message: "팀에 성공적으로 가입되었습니다." });
      });
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "서버 내부 오류가 발생했습니다." });
  }
});
router.get("/getApplys", (req, res) => {
  try {
    const sql =
      "SELECT * FROM joinInfo WHERE team_id = ? AND join_waiting = 'N'";
    const team_id = 1;

    conn.query(sql, [team_id], (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Database error occurred" });
      }
      res.json({ success: true, posts: results });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

router.post("/applyAccept", (req, res) => {
  const { user_id } = req.body;
  const team_id = 1;
  const updateSql = `UPDATE userInfo SET team_id = ? WHERE user_id = ?`;
  conn.query(updateSql, [team_id, user_id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error occurred" });
    }
    const deleteSql = `DELETE FROM joinInfo WHERE team_id = ? AND user_id = ?`;
    conn.query(deleteSql, [team_id, user_id], (err, deleteResults) => {
      if (err) {
        console.error("Database error during delete:", err);
        return res.status(500).json({
          success: false,
          message: "Database error occurred during delete",
        });
      }
      res.json({ success: true });
    });
  });
});
router.post("/applyRefuse", (req, res) => {
  const { user_id } = req.body;
  const team_id = 1;
  const sql = `DELETE FROM joinInfo WHERE team_id = ? AND user_id = ?`;
  conn.query(sql, [team_id, user_id], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Database error occurred" });
    }
    res.json({ success: true });
  });
});


// 팀 목록 가져오기
router.get("/teamlist", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const sql = `
    SELECT team_id AS id, team_name AS name, team_icon AS icon, team_area AS area, team_score AS score, team_img1 AS image_url, team_text AS description
    FROM teamInfo
    LIMIT ? OFFSET ?
  `;
  const countSql = `
    SELECT COUNT(*) AS total
    FROM teamInfo
  `;

  conn.query(countSql, (countErr, countResults) => {
    if (countErr) {
      console.error("Database error:", countErr);
      return res.status(500).json({ success: false, message: "Database error occurred" });
    }

    const totalTeams = countResults[0].total;
    const totalPages = Math.ceil(totalTeams / limit);

    conn.query(sql, [limit, offset], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Database error occurred" });
      }
      res.json({ success: true, teams: results, totalPages: totalPages });
    });
  });
});

module.exports = router;
