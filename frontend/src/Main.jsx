import React, { useState } from "react";
import Header from "./components/Header";
import SignIn from "./components/SignIn";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserInfo } from "./UserInfo";
import { TeamInfo } from "./TeamInfo";
import { MatchInfo } from "./MatchInfo";
import { JoinInfo } from "./JoinInfo";
import { CommentInfo } from "./CommentInfo";
import { BoardInfo } from "./BoardInfo";

const Main = () => {
  // UserInfo
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
  // TeamInfo
  const [teamName, setTeamName] = useState(null);
  const [teamIcon, setTeamIcon] = useState(null);
  const [teamScore, setTeamScore] = useState(null);
  const [teamRecord, setTeamRecord] = useState(null);
  const [teamArea, setTeamArea] = useState(null);
  const [teamManager, setTeamManager] = useState(null);
  // MatchInfo
  const [matchId, setMatchId] = useState(null);
  const [matchDate, setMatchDate] = useState(null);
  const [matchPlace, setMatchPlace] = useState(null);
  // JoinInfo
  const [joinId, setJoinId] = useState(null);
  const [joinDate, setJoinDate] = useState(null);
  // CommentInfo
  const [commentId, setCommentId] = useState(null);
  const [commentContent, setCommentContent] = useState(null);
  const [commentDate, setCommentDate] = useState(null);
  const [commentLike, setCommentLike] = useState(null);
  // BoardInfo
  const [boardId, setBoardId] = useState(null);
  const [boardType, setBoardType] = useState(null);
  const [boardTitle, setBoardTitle] = useState(null);
  const [boardContent, setBoardContent] = useState(null);
  const [boardDate, setBoardDate] = useState(null);
  const [boardLike, setBoardLike] = useState(null);

  return (
    <UserInfo.Provider
      value={{
        userId,
        setUserId,
        userPw,
        setUserPw,
        teamId,
        setTeamId,
        userNickname,
        setUserNickname,
        userImg,
        setUserImg,
        userGender,
        setUserGender,
        userAge,
        setUserAge,
        userHeight,
        setUserHeight,
        userWeight,
        setUserWeight,
        userArea,
        setUserArea,
        userPosition,
        setUserPosition,
        userShooting,
        setUserShooting,
        userPassing,
        setUserPassing,
        userDribbling,
        setUserDribbling,
        userSpeed,
        setUserSpeed,
        userDefending,
        setUserDefending,
        userGoalkeeping,
        setUserGoalkeeping,
        userEmail,
        setUserEmail,
      }}
    >
      <TeamInfo.Provider
        value={{
          teamName,
          setTeamName,
          teamIcon,
          setTeamIcon,
          teamScore,
          setTeamScore,
          teamRecord,
          setTeamRecord,
          teamArea,
          setTeamArea,
          teamManager,
          setTeamManager,
        }}
      >
        <MatchInfo.Provider
          value={{
            matchId,
            setMatchId,
            matchDate,
            setMatchDate,
            matchPlace,
            setMatchPlace,
          }}
        >
          <JoinInfo.Provider
            value={{
              joinId,
              setJoinId,
              joinDate,
              setJoinDate,
            }}
          >
            <CommentInfo.Provider
              value={{
                commentId,
                setCommentId,
                commentContent,
                setCommentContent,
                commentDate,
                setCommentDate,
                commentLike,
                setCommentLike,
              }}
            >
              <BoardInfo.Provider
                value={{
                  boardId,
                  setBoardId,
                  boardType,
                  setBoardType,
                  boardTitle,
                  setBoardTitle,
                  boardContent,
                  setBoardContent,
                  boardDate,
                  setBoardDate,
                  boardLike,
                  setBoardLike,
                }}
              >
                <Header />
                <Routes>
                  <Route path="/" element={<Home />}></Route>
                  <Route path="/signin" element={<SignIn />}></Route>
                  <Route path="/signup" element={<SignUp />}></Route>
                </Routes>
              </BoardInfo.Provider>
            </CommentInfo.Provider>
          </JoinInfo.Provider>
        </MatchInfo.Provider>
      </TeamInfo.Provider>
    </UserInfo.Provider>
  );
};

export default Main;
