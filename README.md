# 📎 폼인풋살 (form input 살)


## 👀 서비스 소개
* 서비스명:  RandomForest모델을 활용한 승률 예측 기반 풋살 팀 매칭 & 커뮤니티서비스
* 서비스설명: AI 모델을 활용한 개인 & 팀 스코어 산정 후 팀 승률 예측 및 풋살 커뮤니티 구현
<br>

## 📅 프로젝트 기간
2024.07.02 ~ 2024.08.02 (4주)
<br>

## ⭐ 주요 기능
* 사용자 능력치 입력 & 스코어 산정 
* 사용자 능력치 기반 팀 스코어 산정
* 능력치 시각화 ( Chart.js)
* 팀 별 승률 예측
* 커뮤니티 기능 ( 게시글 작성, 댓글 )
* 팀 관리 ( 팀 생성 및 삭제 )  
<br>

## ⛏ 기술스택
<table>
    <tr>
        <th>구분</th>
        <th>내용</th>
    </tr>
    <tr>
        <td>사용언어</td>
        <td>
            <img src="https://img.shields.io/badge/Java-007396?style=flat-square&logo=java&logoColor=white"/>
            <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=HTML5&logoColor=white"/>
            <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=CSS3&logoColor=white"/>
            <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=white"/>
            <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=Python&logoColor=white"/>
        </td>
    </tr>
    <tr>
        <td>라이브러리</td>
        <td>
            <img src="https://img.shields.io/badge/BootStrap-7952B3?style=flat-square&logo=BootStrap&logoColor=white"/>
            <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black"/>
            <img src="https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=Axios&logoColor=white"/>
        </td>
    </tr>
    <tr>
        <td>개발도구</td>
        <td>
            <img src="https://img.shields.io/badge/VSCode-007ACC?style=flat-square&logo=VisualStudioCode&logoColor=white"/>
            <img src="https://img.shields.io/badge/Jupyter-F37626?style=flat-square&logo=Jupyter&logoColor=white"/>
        </td>
    </tr>
    <tr>
        <td>서버환경</td>
        <td>
            <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white"/>
            <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=Express&logoColor=white"/>
        </td>
    </tr>
    <tr>
        <td>데이터베이스</td>
        <td>
            <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=MySQL&logoColor=white"/>
        </td>
    </tr>
    <tr>
        <td>협업도구</td>
        <td>
            <img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=Git&logoColor=white"/>
            <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=GitHub&logoColor=white"/>
        </td>
    </tr>
</table>
<br>

## 📌 시스템 아키텍처
![image](https://github.com/user-attachments/assets/f9fee7dc-3166-40d9-97d6-aa5d4c0b07ae)
<br>

## 📌 SW유스케이스
![image](https://github.com/user-attachments/assets/62c1f357-e4d8-4bbd-baae-2f3a7a168087)
<br>

## 📌 ER다이어그램
![image](https://github.com/user-attachments/assets/eefe9cff-90e0-4cf7-9fe8-d476212a4a63)
<br>

## 👨‍👩‍👦‍👦 팀원 역할
![image](https://github.com/user-attachments/assets/8cc314b6-dd79-4e2e-96fd-3d57a2d266c9)
<br>
## 🤾‍♂️ 트러블슈팅
  
* 문제1<br>
문제 : 특정 axios 요청의 주소를 인식 못하는 오류 (대부분의 axios 요청은 문제없이 주소값을 찾았으나 특정 주소값만 인식하지 못함)

해결 : "proxy:http://localhost:8000" 클라이언트에서 보내주는 요청에 대한 주소값을 제대로 찾을 수 있도록 프록시 설정 
    
* 문제2<br>
Flask 서버 요청 시 오류 (Flask 서버 요청 시 cors 설정, Front에서 Flask로 요청을 통해 데이터가 넘어갈 때 set 타입으로 넘어가 json인식 불가)

해결 : Context - Type 헤더 지정, front에서 보내는 데이터 헤더 부분에 context-type을 json형식으로 반환하여 요청을 보내고 Flask에서 응답으로 데이터를 보낼 떄 key : value값을 설정하여 객체 타입으로 응답

