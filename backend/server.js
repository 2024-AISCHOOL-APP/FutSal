// 3-1. 기본 모듈 가져오기
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const session = require('express-session')
const fileStore = require('session-file-store')(session);
const boardRoutes = require('./routes/board');

// 6-1. 리액트 프로젝트 경로 설정
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));
app.use(express.json());


// 9. CORS 모듈 가져오기
app.use(cors());

// 세션 설정 
app.use(session({
        store : new fileStore(), // 세션저장소
        secret : "secret", // 암호화 키
        resave : false, // 불필요한 세션 저장 방지
        saveUninitialized : false, // 초기화되지 않은 세션 저장 여부
        cookie : {
            maxAge : 1000 * 60 * 60 * 24, // 쿠키 만료시간 설정 (1일)
            httpOnly : true, // httpOnly관련 설정 
            secure : false // HTTPS 사용 여부 설정 
        }
})) 


// 4-3. 메인페이지 경로 설정
const indexRouter = require('./routes');
app.use('/', indexRouter);
// 4-3. User페이지 경로 설정
const userRouter = require('./routes/user')
app.use('/user', userRouter)

app.use('/board', boardRoutes);

// 3-2. 포트 설정
app.set('port', process.env.PORT || 8000);
app.listen(app.get('port'), ()=>{
    console.log(`Server is running on ${app.get('port')}`);
});