const express = require("express");
const router = express.Router();
const conn = require("../config/database");
const sessionStore = require("../sessionStore"); // 세션 스토어 불러오기

// 팀 생성
router.post("/handleCreateTeam", (req, res) => {
  console.log("handleCreateTeam", req.body);
  const { userId, teamName, teamIcon, teamArea } = req.body;

  const sql = `
    INSERT INTO teamInfo (user_id, team_name, team_icon, team_area)
    VALUES (?, ?, ?, ?)
  `;
  conn.query(sql, [userId, teamName, teamIcon, teamArea], (err) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error occurred" });
    }
    res.json({ success: true });
  });
});

// 팀 정보 가져오기
router.get("/teamInfo", (req, res) => {
  try {
    // team_id와 teamId를 모두 확인
    const teamId = req.query.teamId || req.query.team_id;
    console.log(teamId);

    if (!teamId) {
      return res.status(400).json({ success: false, message: "팀 ID가 제공되지 않았습니다." });
    }

    const sql = `
      SELECT * FROM teamInfo WHERE team_id = ?
    `;
    conn.query(sql, [teamId], (err, results) => {
      if (err) {
        console.error("Database error:", err);
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

// 팀 가입 신청
router.post("/teamJoin", (req, res) => {
  const { teamId, userId } = req.body;

  if (!teamId || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Team ID and User ID are required" });
  }

  const checkSql = "SELECT * FROM joinInfo WHERE team_id = ? AND user_id = ?";
  conn.query(checkSql, [teamId, userId], (checkErr, checkResults) => {
    if (checkErr) {
      console.error("중복 확인 실패:", checkErr);
      return res
        .status(500)
        .json({ success: false, message: "데이터베이스 오류가 발생했습니다." });
    }

    if (checkResults.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "이미 가입 신청 하셨습니다." });
    }

    const sql =
      "INSERT INTO joinInfo (team_id, user_id, join_date) VALUES (?, ?, NOW())";
    conn.query(sql, [teamId, userId], (err) => {
      if (err) {
        console.error("팀 가입 실패:", err);
        return res
          .status(500)
          .json({ success: false, message: "서버 내부 오류가 발생했습니다." });
      }
      res
        .status(200)
        .json({ success: true, message: "팀에 성공적으로 가입되었습니다." });
    });
  });
});

// 가입 신청 목록 가져오기
router.get("/getApplys", (req, res) => {
  try {
    const team_id = req.query.teamId;

    const sql =
      "SELECT * FROM joinInfo WHERE team_id = ? AND join_waiting = 'N'";

    conn.query(sql, [team_id], (err, results) => {
      if (err) {
        console.error("Database error:", err);
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

// 가입 신청 수락
router.post("/applyAccept", (req, res) => {
  const { user_id } = req.body;
  const team_id = req.query.teamId;

  const updateSql = "UPDATE userInfo SET team_id = ? WHERE user_id = ?";
  conn.query(updateSql, [team_id, user_id], (err) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error occurred" });
    }
    const deleteSql = "DELETE FROM joinInfo WHERE team_id = ? AND user_id = ?";
    conn.query(deleteSql, [team_id, user_id], (err) => {
      if (err) {
        console.error("Database error during delete:", err);
        return res
          .status(500)
          .json({
            success: false,
            message: "Database error occurred during delete",
          });
      }
      res.json({ success: true });
    });
  });
});

// 가입 신청 거부
router.post("/applyRefuse", (req, res) => {
  const { user_id } = req.body;
  const team_id = req.query.teamId;

  const sql = "DELETE FROM joinInfo WHERE team_id = ? AND user_id = ?";
  conn.query(sql, [team_id, user_id], (err) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error occurred" });
    }
    res.json({ success: true });
  });
});

// 팀 목록 가져오기 (페이지네이션 및 검색 기능 포함)
router.get("/teamlist", (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const offset = (page - 1) * limit;

  const searchQuery = search ? "WHERE team_name LIKE ?" : "";
  const queryParams = search
    ? [`%${search}%`, parseInt(limit), parseInt(offset)]
    : [parseInt(limit), parseInt(offset)];

  const sql = `
    SELECT team_id AS id, team_name AS name, team_icon AS icon, team_area AS area, team_score AS score, team_img1 AS image_url, team_text AS description
    FROM teamInfo
    ${searchQuery}
    LIMIT ? OFFSET ?
  `;

  conn.query(sql, queryParams, (err, results) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ message: "Database error occurred" });
    }

    const countSql = `
      SELECT COUNT(*) as total FROM teamInfo
      ${searchQuery}
    `;

    conn.query(countSql, search ? [`%${search}%`] : [], (err, countResults) => {
      if (err) {
        console.error("SQL Error:", err);
        return res.status(500).json({ message: "Database error occurred" });
      }

      const totalTeams = countResults[0].total;
      const totalPages = Math.ceil(totalTeams / limit);

      res.json({
        teams: results,
        totalPages,
      });
    });
  });
});

// 팀 멤버 목록 가져오기
router.get("/members", (req, res) => {
  console.log("Request received at /team/members");
  const teamId = req.query.teamId;

  if (!teamId) {
    console.log("teamId is required");
    return res
      .status(400)
      .json({ success: false, message: "teamId is required" });
  }

  try {
    const sql = `
      SELECT
        user_nickName,
        user_age,
        user_height,
        user_weight,
        user_position,
        user_shooting,
        user_passing,
        user_dribbling,
        user_speed,
        user_defending,
        user_goalkeeping,
        user_score
      FROM userInfo
      WHERE team_id = ?
    `;
    conn.query(sql, [teamId], (err, results) => {
      if (err) {
        console.error("Failed to fetch team members:", err);
        return res
          .status(500)
          .json({ success: false, message: "Failed to fetch team members" });
      }
      res.json({ success: true, data: results });
    });
  } catch (error) {
    console.error("Failed to fetch team members:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch team members" });
  }
});

module.exports = router;
