// 4-3. User페이지 경로 설정
// 프론트에서 입력한 데이터를 가져와 출력
const express = require("express");
const router = express.Router();
const conn = require("../config/database");
const sessionStore = require("../sessionStore"); // 세션 스토어 불러오기
const bcrypt = require("bcrypt");

router.post("/handleSignIn", (req, res) => {
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
        res.json({
          success: true,
          sessionId,
        });
      } else {
        console.log("로그인 실패: 비밀번호 불일치");
        res.json({
          success: false,
          message: "Invalid credentials",
        });
      }
    } else {
      console.log("로그인 실패: 사용자 없음");
      res.json({
        success: false,
        message: "User not found",
      });
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
    res.status(500).json({
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

router.post("/handleUpdate", (req, res) => {
  console.log(req.body);
  const {
    userId,
    userPw,
    userNickname,
    userImg,
    userAge,
    userHeight,
    userWeight,
    userArea,
    userEmail,
  } = req.body;

  const sql = `
      UPDATE userInfo 
      SET user_pw=?, user_nickname=?, user_img=?, user_age=?, user_height=?, user_weight=?, user_area=?, user_email=?
      WHERE user_id=?
    `;

  conn.query(
    sql,
    [
      userPw,
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

module.exports = router;
