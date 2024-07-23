import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserInfo } from './UserInfo';
import { BoardInfo } from './BoardInfo';
import Header from './components/Header';
import SignIn from './components/SignIn';
import Home from './components/Home';
import SignUp from './components/SignUp';
import Board from './components/Board';
import Write from './components/Write';
import './App.css';


const Main = () => {
  const [userId, setUserId] = useState(null);
  const [userPw, setUserPw] = useState(null);
  const [teamId, setTeamId] = useState(null);
  const [userNickname, setUserNickname] = useState(null);
  const [userImg, setUserImg] = useState(null);
  const [userGender, setUserGender] = useState(null);
  const [userAge, setUserAge] = useState(null);
  const [userHeight, setUserHeight] = useState(null);
  const [userWeight, setUserWeight] = useState(null);
  const [userArea, setUserArea] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [userShooting, setUserShooting] = useState(null);
  const [userPassing, setUserPassing] = useState(null);
  const [userDribbling, setUserDribbling] = useState(null);
  const [userSpeed, setUserSpeed] = useState(null);
  const [userDefending, setUserDefending] = useState(null);
  const [userGoalkeeping, setUserGoalkeeping] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  const [boardId, setBoardId] = useState('');
  const [boardType, setBoardType] = useState('');
  const [boardTitle, setBoardTitle] = useState('');
  const [boardContent, setBoardContent] = useState('');
  const [boardDate, setBoardDate] = useState('');
  const [boardLike, setBoardLike] = useState('');
  
  return (
    <UserInfo.Provider value={{
      userId, setUserId,
      userPw, setUserPw,
      teamId, setTeamId,
      userNickname, setUserNickname,
      userImg, setUserImg,
      userGender, setUserGender,
      userAge, setUserAge,
      userHeight, setUserHeight,
      userWeight, setUserWeight,
      userArea, setUserArea,
      userPosition, setUserPosition,
      userShooting, setUserShooting,
      userPassing, setUserPassing,
      userDribbling, setUserDribbling,
      userSpeed, setUserSpeed,
      userDefending, setUserDefending,
      userGoalkeeping, setUserGoalkeeping,
      userEmail, setUserEmail
      }}>
        
      <BoardInfo.Provider value={{
        boardId, setBoardId,
        boardType, setBoardType,
        boardTitle, setBoardTitle,
        boardContent, setBoardContent,
        boardDate, setBoardDate,
        boardLike, setBoardLike
      }}>
        <Header/>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/signin' element={<SignIn/>}></Route>
          <Route path='/signup' element={<SignUp/>}></Route>
          <Route path='/board' element={<Board/>}></Route>
          <Route path='/write' element={<Write/>}></Route>
        </Routes>
      </BoardInfo.Provider>
    </UserInfo.Provider>
  );
}

export default Main;