const express = require("express");
const router = express.Router();
const sessionStore = require("../sessionStore");

router.post("/login", (req, res) => {
  const { userId } = req.body;
  if (userId) {
    const sessionId = new Date().getTime().toString(); // 간단한 세션 ID 생성
    sessionStore[sessionId] = { user: { user_id: userId } };
    res.json({ sessionId });
  } else {
    res.status(400).json({ error: "Invalid userId" });
  }
});


router.get("/get-session", (req, res) => {
  const sessionId = req.headers["x-session-id"];
  
  if (!sessionId) {
    return res.status(400).json({ error: "Session ID is missing" });
  }

  sessionStore.get(sessionId, (err, session) => {
    if (err || !session) {
      console.error('Session error:', err);
      return res.status(500).json({ success: false, message: 'Session error occurred' });
    }

    if (session.user && session.user.user_id) {
      res.json({ userId: session.user.user_id });
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });
}); 

router.post("/logout", (req, res) => {
  const sessionId = req.headers["x-session-id"];

  if (sessionId && sessionStore[sessionId]) {
    delete sessionStore[sessionId];
    res.clearCookie("connect.sid");
    res.json({ success: true });
  } else {
    console.log("Invalid sessionId or session not found"); // 에러 로그 추가
    res.status(400).json({ error: "Invalid sessionId" });
  }
});

module.exports = router;
