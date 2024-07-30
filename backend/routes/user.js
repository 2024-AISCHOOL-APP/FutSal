const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sessionStore = require("../sessionStore"); // 세션 스토어 불러오기
const bcrypt = require("bcrypt");
const conn = require("../config/database");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../../frontend/public/image/userImage"); // 경로 수정
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const basename = "user_img"; // 예시로 고정된 파일 이름 사용
    const ext = path.extname(file.originalname);
    const date = new Date().toISOString().replace(/[-T:.Z]/g, "");
    const filename = `${basename}${date}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

// 아이디 중복 확인
router.post("/checkId", (req, res) => {
  const { userId } = req.body;
  const sql = `SELECT COUNT(*) AS count FROM userInfo WHERE user_id = ?`;
  conn.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("SQL Error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error occurred" });
    }
    const isUnique = results[0].count === 0;
    res.json({ isUnique });
  });
});

// 닉네임 중복 확인
router.post("/checkNickname", (req, res) => {
  const { userNickname } = req.body;
  const sql = `SELECT COUNT(*) AS count FROM userInfo WHERE user_nickname = ?`;
  conn.query(sql, [userNickname], (err, results) => {
    if (err) {
      console.error("SQL Error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error occurred" });
    }
    const isUnique = results[0].count === 0;
    res.json({ isUnique });
  });
});

router.post("/handleSignIn", async (req, res) => {
  console.log("handleSignIn", req.body);
  const { userId, userPw } = req.body;

  const sql = `
        SELECT user_id, user_pw
        FROM userInfo
        WHERE user_id=?
    `;
  conn.query(sql, [userId], async (err, rows) => {
    if (err) {
      console.error("SQL Error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error occurred" });
    }
    if (rows.length > 0) {
      const user = rows[0];
      // 비밀번호 비교
      const match = await bcrypt.compare(userPw, user.user_pw);
      if (match) {
        console.log("로그인 성공");
        const sessionId = new Date().getTime().toString(); // 간단한 세션 ID 생성
        sessionStore[sessionId] = { user: rows[0] };
        res.json({ success: true, sessionId });
      } else {
        console.log("로그인 실패: 비밀번호 불일치");
        res.json({ success: false, message: "Invalid credentials" });
      }
    } else {
      console.log("로그인 실패: 사용자 없음");
      res.json({ success: false, message: "User not found" });
    }
  });
});

router.post("/handleSignUp", async (req, res) => {
  console.log(req.body);
  const {
    userId,
    userPw,
    userNickname,
    userGender,
    userAge,
    userHeight,
    userWeight,
    userEmail,
  } = req.body;

  try {
    const saltRounds = 10;
    const hashedPw = await bcrypt.hash(userPw, saltRounds);

    const sql = `
        INSERT INTO userInfo (user_id, user_pw, user_nickname, user_gender, user_age, user_height, user_weight, user_email)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

    conn.query(
      sql,
      [
        userId,
        hashedPw,
        userNickname,
        userGender,
        userAge,
        userHeight,
        userWeight,
        userEmail,
      ],
      (err, results) => {
        if (err) {
          console.error("SQL Error:", err);
          return res
            .status(500)
            .json({ success: false, message: "Database error occurred" });
        }
        console.log("SQL Results:", results);
        res.json({ success: true });
      }
    );
  } catch (err) {
    console.error("Error during password hashing:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Error occurred during sign-up process",
      });
  }
});

router.post("/SelfStats", (req, res) => {
  console.log(req.body);
  const {
    userId,
    userPosition,
    userShooting,
    userPassing,
    userDribbling,
    userSpeed,
    userDefending,
    userGoalkeeping,
  } = req.body;

  const sql = `
      UPDATE userInfo 
      SET user_position=?, user_shooting=?, user_passing=?, user_dribbling=?,
      user_speed=?, user_defending=?, user_goalkeeping=?
      WHERE user_id=?
  `;

  conn.query(
    sql,
    [
      userPosition,
      userShooting,
      userPassing,
      userDribbling,
      userSpeed,
      userDefending,
      userGoalkeeping,
      userId,
    ],
    (err) => {
      if (err) {
        console.error("SQL Error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error occurred" });
      }
      res.json({ success: true });
    }
  );
});

router.post("/handleUpdate", upload.single("userImg"), (req, res) => {
  console.log(req.body);
  const {
    userId,
    userPw,
    userNickname,
    userAge,
    userHeight,
    userWeight,
    userArea,
    userEmail,
  } = req.body;

  const userImg = req.file ? `/image/userImage/${req.file.filename}` : null;

  const saltRounds = 10;

  bcrypt.hash(userPw, saltRounds, (err, hashedPw) => {
    if (err) {
      console.error("Hashing error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Password hashing error occurred" });
    }

    const sql = `
      UPDATE userInfo 
      SET user_pw=?, user_nickname=?, user_img=?, user_age=?, user_height=?, user_weight=?, user_area=?, user_email=?
      WHERE user_id=?
    `;

    conn.query(
      sql,
      [
        hashedPw, // 해싱된 비밀번호를 사용합니다
        userNickname,
        userImg,
        userAge,
        userHeight,
        userWeight,
        userArea,
        userEmail,
        userId,
      ],
      (err, results) => {
        if (err) {
          console.error("SQL Error:", err);
          return res
            .status(500)
            .json({ success: false, message: "Database error occurred" });
        }
        res.json({ success: true });
      }
    );
  });
});

router.post("/userInfo", (req, res) => {
  const { userId } = req.body;

  try {
    const userSql = `SELECT * FROM userInfo WHERE user_id = ?`;
    conn.query(userSql, [userId], (err, userResults) => {
      if (err) {
        console.error("Database error:", err); // 데이터베이스 오류 로깅
        return res
          .status(500)
          .json({ success: false, message: "Database error occurred" });
      }

      if (userResults.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const userInfo = userResults[0];
      const teamId = userInfo.team_id;

      if (!teamId) {
        // 팀 ID가 없는 경우, 사용자 정보만 반환
        return res.json({ success: true, data: userInfo });
      }

      const teamSql = `SELECT team_name FROM teamInfo WHERE team_id = ?`;
      conn.query(teamSql, [teamId], (err, teamResults) => {
        if (err) {
          console.error("Database error:", err); // 데이터베이스 오류 로깅
          return res
            .status(500)
            .json({ success: false, message: "Database error occurred" });
        }

        if (teamResults.length === 0) {
          return res
            .status(404)
            .json({ success: false, message: "Team not found" });
        }

        userInfo.team_name = teamResults[0].team_name;

        res.json({ success: true, data: userInfo });
      });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

router.post("/data", (req, res) => {
  const { userId } = req.body;
  const sql = `
  SELECT user_age, user_height, user_weight
  FROM userInfo
  WHERE user_id = ?;
  `;
  conn.query(sql, [userId], (err, results) => {
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
});
// 비밀번호 재설정 요청
router.post("/password-reset-request", (req, res) => {
  const { userId, nickname } = req.body;

  const sql =
    "SELECT user_id, user_nickname FROM userInfo WHERE user_id = ? AND user_nickname = ?";

  conn.query(sql, [userId, nickname], (err, results) => {
    if (err) {
      console.error("SQL Error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error occurred" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true });
  });
});

// 비밀번호 재설정
router.post("/password-reset", (req, res) => {
  const { userId, newPassword } = req.body;

  const saltRounds = 10;

  bcrypt.hash(newPassword, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error("Hashing error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Hashing error occurred" });
    }

    const sql = "UPDATE userInfo SET user_pw = ? WHERE user_id = ?";

    conn.query(sql, [hashedPassword, userId], (err, results) => {
      if (err) {
        console.error("SQL Error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error occurred" });
      }

      res.json({ success: true });
    });
  });
});
module.exports = router;
