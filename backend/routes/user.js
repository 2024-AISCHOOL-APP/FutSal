// 4-3. User페이지 경로 설정
// 프론트에서 입력한 데이터를 가져와 출력
const express = require('express');
const router = express.Router();
const conn = require('../config/database')

router.post('/handleSignIn',(req, res)=>{
    console.log('handleSignIn', req.body);
    const {userId, userPw} = req.body;

    /*
    conn.query(sql, values, callback)
    */ 
    const sql = `
        SELECT user_id 
        FROM linkdb_member
        WHERE user_id=? 
        AND user_pw=?
    `
    conn.query(sql, [userId, userPw], (err, rows)=>{
        // console.log(rows);
        if(rows.length > 0){
            //console.log('로그인 성공');
            req.session.user = rows[0]
            res.json({
                success : true
            })
        }else{
            //console.log('로그인 실패');

            res.json({
                success : false
            })
        }
    })
})

router.post('/handleSignUp',(req,res)=>{
    console.log(req.body);
    const {userId, userPw, userNickname, userGender, userAge, userHeight, userWeight, userEmail} = req.body;
    const sql = `
        INSERT INTO usernfo 
        VALUES (?,?,?,?,?,?,?,?)
    `
    conn.query(sql, [userId, userPw, userNickname, userGender, userAge, userHeight, userWeight, userEmail], (err, rows)=>{
        console.log(rows);
        if(rows){
            res.json({success : true})
        }else{
            res.json({seccess : false})
        }
    })
})


module.exports = router;