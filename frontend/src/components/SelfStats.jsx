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
    setUserGoalkeeping
  } = useContext(UserInfo);

  const [selectedShooting, setSelectedShooting] = useState(userShooting);
  const [selectedPassing, setSelectedPassing] = useState(userPassing);
  const [selectedDribbling, setSelectedDribbling] = useState(userDribbling);
  const [selectedSpeed, setSelectedSpeed] = useState(userSpeed);
  const [selectedDefending, setSelectedDefending] = useState(userDefending);
  const [selectedGoalkeeping, setSelectedGoalkeeping] = useState(userGoalkeeping);
  const [selectedPosition, setSelectedPosition] = useState(userPosition || ""); // 빈 문자열로 초기화

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
        break;
      case 'Passing':
        setSelectedPassing(value);
        break;
      case 'Dribbling':
        setSelectedDribbling(value);
        break;
      case 'Speed':
        setSelectedSpeed(value);
        break;
      case 'Defending':
        setSelectedDefending(value);
        break;
      case 'Goalkeeping':
        setSelectedGoalkeeping(value);
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

      // 데이터 저장 후 응답 처리
      if (response.data.success) {
        // 성공적으로 저장되었을 때의 로직
        console.log("Data successfully saved");
        alert("등록이 완료되었습니다.");

        // 상태 업데이트
        setUserShooting(selectedShooting);
        setUserPassing(selectedPassing);
        setUserDribbling(selectedDribbling);
        setUserSpeed(selectedSpeed);
        setUserDefending(selectedDefending);
        setUserGoalkeeping(selectedGoalkeeping);
        setUserPosition(selectedPosition);

        // 성공 후 마이페이지로 리다이렉트
        nav("/mypage");
      } else {
        // 저장 실패 시
        console.error("Failed to save data:", response.data.message);
        alert("데이터 저장에 실패했습니다.");
      }
    } catch (error) {
      console.log(error);
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