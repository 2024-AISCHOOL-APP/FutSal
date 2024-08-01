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
const apiRouter = require("./routes/api");
const commentRouter = require("./routes/comment");
const winrateRouter = require("./routes/winrate")
const evaluationRouter = require('./routes/evaluation'); 
const selfstatsRouter = require("./routes/SelfStats"); 

// 6-1. 리액트 프로젝트 경로 설정
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

// 4-3. 경로 설정
app.use("/", indexRouter);
app.use("/api", apiRouter);
app.use("/user", userRouter);
app.use("/board", boardRoutes);
app.use("/team", teamRouter);
app.use("/coment", commentRouter);
app.use("/winrate", winrateRouter)
app.use('/evaluation', evaluationRouter);
app.use("/selfstats", selfstatsRouter); 

app.use(express.static(path.join(__dirname, "..", "frontend", "build")));

// 3-2. 포트 설정
app.set("port", process.env.PORT || 8000);
app.listen(app.get("port"), () => {
  console.log(`Server is running on ${app.get("port")}`);
});
