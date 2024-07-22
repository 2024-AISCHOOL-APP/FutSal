// 5-1. mysql 모듈 가져오기
const mysql = require('mysql2');

// 5-2. DB 정보 저장
const conn = mysql.createConnection({
    'host' : 'project-db-stu3.smhrd.com',
    'user' : 'Insa5_App_hacksim_2',
    'password' : 'aischool2',
    'port': '3307',
    'database' : 'Insa5_App_hacksim_2'
});

// 5-3. DB 정보 연결 및 모듈 내보내기
conn.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
    });
module.exports = conn;