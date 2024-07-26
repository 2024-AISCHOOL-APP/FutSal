import React, { useState } from "react";
import Header from "./components/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserInfo } from "./UserInfo";
import { TeamInfo } from "./TeamInfo";
import { MatchInfo } from "./MatchInfo";
import { JoinInfo } from "./JoinInfo";
import { CommentInfo } from "./CommentInfo";
import { BoardInfo } from "./BoardInfo";
import Home from "./components/Home";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Board from "./components/Board";
import Write from "./components/Write";
import CreateTeam from "./components/CreateTeam";
import Team from "./components/Team";
import "./App.css";
import TeamApply from "./components/TeamApply";
import BoardDetail from "./components/BoardDetail";
import MyPage from "./components/MyPage";
import Comment from "./components/Comment";
import TeamList from "./components/TeamList";
import NavbarUnLog from "./components/NavbarUnLog";
import NavbarLog from "./components/NavbarLog";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // TeamInfo
  const [teamName, setTeamName] = useState(null);
  const [teamIcon, setTeamIcon] = useState(null);
  const [teamScore, setTeamScore] = useState(null);
  const [teamRecord, setTeamRecord] = useState(null);
  const [teamArea, setTeamArea] = useState(null);
  const [teamManager, setTeamManager] = useState(null);
  const [teamImg1, setTeamImg1] = useState(null);
  const [teamImg2, setTeamImg2] = useState(null);
  const [teamText, setTeamText] = useState(null);
  // MatchInfo
  const [matchId, setMatchId] = useState(null);
  const [matchDate, setMatchDate] = useState(null);
  const [matchPlace, setMatchPlace] = useState(null);
  // JoinInfo
  const [joinId, setJoinId] = useState(null);
  const [joinDate, setJoinDate] = useState(null);
  const [joinWaiting, setJoinWaiting] = useState(null);
  // CommentInfo
  const [commentId, setCommentId] = useState(null);
  const [commentContent, setCommentContent] = useState(null);
  const [commentDate, setCommentDate] = useState(null);
  const [commentLike, setCommentLike] = useState(null);
  const [comentLikeCount, setComentLikeCount] = useState(null);
  // BoardInfo
  const [boardId, setBoardId] = useState(null);
  const [boardType, setBoardType] = useState(null);
  const [boardTitle, setBoardTitle] = useState(null);
  const [boardContent, setBoardContent] = useState(null);
  const [boardDate, setBoardDate] = useState(null);
  const [boardLike, setBoardLike] = useState(null);
  const [boardLikeCount, setBoardLikeCount] = useState(null);

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
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      <TeamInfo.Provider
        value={{
          teamId,
          setTeamId,
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
          teamImg1,
          setTeamImg1,
          teamImg2,
          setTeamImg2,
          teamText,
          setTeamText,
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
              joinWaiting,
              setJoinWaiting,
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
                comentLikeCount,
                setComentLikeCount,
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
                  boardLikeCount,
                  setBoardLikeCount,
                }}
              >
                <Header />
                {isLoggedIn ? <NavbarLog /> : <NavbarUnLog />}
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/createteam" element={<CreateTeam />} />
                  <Route path="/board" element={<Board />} />
                  <Route path="/posts/:id" element={<BoardDetail />} />
                  <Route path="/write" element={<Write />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/teamlist" element={<TeamList />} />
                  <Route path="/teamapply" element={<TeamApply />} />
                  <Route path="/mypage" element={<MyPage />}></Route>
                  <Route path="/comment/:boardId" element={<Comment />} />
                </Routes>
                {/* <MainContent /> */}
              </BoardInfo.Provider>
            </CommentInfo.Provider>
          </JoinInfo.Provider>
        </MatchInfo.Provider>
      </TeamInfo.Provider>
    </UserInfo.Provider>
  );
};

export default Main;
