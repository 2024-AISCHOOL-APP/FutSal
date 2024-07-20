import React, { useState } from 'react'
import Header from './components/Header'
import SignIn from './components/SignIn'
import Home from './components/Home'
import SignUp from './components/SignUp'
import { Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserInfo } from './UserInfo'

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
        <Header/>
        <Routes>
            <Route path='/' element={<Home/>}></Route>
            <Route path='/signin' element={<SignIn/>}></Route>
            <Route path='/signup' element={<SignUp/>}></Route>
        </Routes>
    </UserInfo.Provider>
  )
}

export default Main