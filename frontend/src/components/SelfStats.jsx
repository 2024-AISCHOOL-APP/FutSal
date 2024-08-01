import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "../axios";
import { UserInfo } from "../UserInfo";
import { useNavigate } from "react-router-dom";

const SelfStats = () => {
  const {
    userId,
    setUserId,
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
    userScore,
    setUserScore,
    userAge,
    setUserAge,
    userHeight,
    setUserHeight,
    userWeight,
    setUserWeight,
  } = useContext(UserInfo);

  const [selectedShooting, setSelectedShooting] = useState(userShooting);
  const [selectedPassing, setSelectedPassing] = useState(userPassing);
  const [selectedDribbling, setSelectedDribbling] = useState(userDribbling);
  const [selectedSpeed, setSelectedSpeed] = useState(userSpeed);
  const [selectedDefending, setSelectedDefending] = useState(userDefending);
  const [selectedGoalkeeping, setSelectedGoalkeeping] = useState(userGoalkeeping);
  const [selectedPosition, setSelectedPosition] = useState(userPosition || ""); 

  const nav = useNavigate();

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await axios.get("/api/get-session", {
          headers: {
            "x-session-id": sessionStorage.getItem("sessionId"),
          },
        });
        setUserId(response.data.userId);
        sessionStorage.setItem("userId", response.data.userId); // 세션에 userId 저장
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
        alert("로그인 하셔야 스탯 등록이 가능합니다");
        nav("/home");
      }
    };
    fetchSessionData();
  }, [nav]);

  // 레벨에 따른 값을 매핑
  const levelValues = {
    1: 40,
    2: 48,
    3: 55,
    4: 63,
    5: 70,
  };

  const handleButtonClick = (stat, level) => {
    const value = levelValues[level];
    switch (stat) {
      case 'Shooting':
        setSelectedShooting(value);
        setUserShooting(value);
        break;
      case 'Passing':
        setSelectedPassing(value);
        setUserPassing(value);
        break;
      case 'Dribbling':
        setSelectedDribbling(value);
        setUserDribbling(value);
        break;
      case 'Speed':
        setSelectedSpeed(value);
        setUserSpeed(value);
        break;
      case 'Defending':
        setSelectedDefending(value);
        setUserDefending(value);
        break;
      case 'Goalkeeping':
        setSelectedGoalkeeping(value);
        setUserGoalkeeping(value);
        break;
      default:
        break;
    }
  };


  const sendData = async (e) => {
    e.preventDefault();

    try {
      // 서버에 능력치 저장 요청
      const response = await axios.post(
        "/user/SelfStats",
        {
          userPosition: selectedPosition,
          userShooting: selectedShooting,
          userPassing: selectedPassing,
          userDribbling: selectedDribbling,
          userSpeed: selectedSpeed,
          userDefending: selectedDefending,
          userGoalkeeping: selectedGoalkeeping,
          userId,
        },
        {
          headers: {
            "x-session-id": sessionStorage.getItem("sessionId"),
          },
        }
      );

      if (response.data.success) {
        // SelfStats 저장 성공 후 사용자 데이터 갱신
        const getResponse = await axios.post('/user/data',{
          userId: userId,
        },{
          headers: {
            "x-session-id": sessionStorage.getItem("sessionId"),
          },
        });

        if (getResponse.data.success) {
          const datafromData = getResponse.data.data;
          console.log("User data success:", datafromData);
          setUserAge(datafromData.user_age);
          setUserHeight(datafromData.user_height);
          setUserWeight(datafromData.user_weight);
          console.log("Updated userId:", datafromData.user_id);

          // Flask 서버에 데이터 전송
          const response2flask = await axios.post(
            `http://localhost:5000/predict_at`,    
            {
              userAge: datafromData.user_age,
              userHeight: datafromData.user_height,
              userWeight: datafromData.user_weight,
              userPosition: userPosition,
              userShooting: userShooting,
              userPassing: userPassing,
              userDribbling: userDribbling,
              userSpeed: userSpeed,
              userDefending: userDefending,
              userGoalkeeping: userGoalkeeping,
              userId: userId,
            },
            {
              headers: {
                "x-session-id": sessionStorage.getItem("sessionId"),
              },
            },
          );

          if (response2flask.status === 200) {
            alert("등록이 완료되었습니다.");
            nav("/mypage");
          } else {
            console.error("Failed to get prediction from Flask server:", response2flask.data.message);
            alert("데이터 저장에 실패했습니다.");
          }
        } else {
          console.error("Failed to fetch user data:", getResponse.data.message);
          alert("데이터 저장에 실패했습니다.");
        }
      } else {
        console.error("Failed to save data:", response.data.message);
        alert("데이터 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("서버와의 통신 중 오류가 발생했습니다.", error);
      alert("서버와의 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <h1>능력치 등록</h1>
      <Form onSubmit={sendData}>
        <Form.Group className="mb-3">
          <Form.Label>주 포지션</Form.Label>
          <Form.Control
            as="select"
            value={selectedPosition}
            onChange={(e) => {
              setSelectedPosition(e.target.value);
              setUserPosition(e.target.value);
            }}
          >
            <option value="">포지션을 선택해주세요</option>
            <option value="Attacker">공격수</option>
            <option value="Defender">수비수</option>
          </Form.Control>
        </Form.Group>

        {['Shooting', 'Passing', 'Dribbling', 'Speed', 'Defending', 'Goalkeeping'].map((stat) => (
          <Form.Group key={stat} className="mb-3">
            <Form.Label>{stat}</Form.Label>
            <div>
              {[1, 2, 3, 4, 5].map((level) => (
                <Button
                  key={level}
                  variant={eval(`selected${stat}`) === levelValues[level] ? 'primary' : 'secondary'}
                  onClick={() => handleButtonClick(stat, level)}
                  className="me-2 mb-2"
                >
                  Level {level}
                </Button>
              ))}
            </div>
          </Form.Group>
        ))}

        <Button variant="primary" type="submit">
          능력치 설정
        </Button>
      </Form>
    </div>
  );
};

export default SelfStats;
