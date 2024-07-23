// 3-1. 기본 모듈 가져오기
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const sessionStore = require("./sessionStore"); // 세션 스토어 불러오기
const indexRouter = require("./routes");
const userRouter = require("./routes/user");
const boardRoutes = require("./routes/board");
const teamRouter = require("./routes/team");

// 6-1. 리액트 프로젝트 경로 설정
app.use(express.static(path.join(__dirname, "..", "frontend", "build")));
app.use(express.json());

// 9. CORS 모듈 가져오기
app.use(cors());

// 세션 설정을 직접 핸들링
app.use((req, res, next) => {
  const sessionId = req.headers["x-session-id"];
  if (sessionId && sessionStore[sessionId]) {
    req.session = sessionStore[sessionId];
  } else {
    req.session = {};
  }
  next();
});

app.post("/api/login", (req, res) => {
  const { userId } = req.body;
  if (userId) {
    const sessionId = new Date().getTime().toString(); // 간단한 세션 ID 생성
    sessionStore[sessionId] = { user: { user_id: userId } };
    res.json({ sessionId });
  } else {
    res.status(400).json({ error: "Invalid userId" });
  }
});

app.get("/api/get-session", (req, res) => {
  const sessionId = req.headers["x-session-id"];
  if (sessionId && sessionStore[sessionId]) {
    res.json({ userId: sessionStore[sessionId].user.user_id });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// 4-3. 경로 설정

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/board", boardRoutes);
app.use("/team", teamRouter);

// 3-2. 포트 설정
app.set("port", process.env.PORT || 8000);
app.listen(app.get("port"), () => {
  console.log(`Server is running on ${app.get("port")}`);
});
