// src/pages/WinRate.js
import React from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axios'; // axios 인스턴스의 URL이 올바른지 확인
import { useState, useEffect } from 'react';
import '../css/winrate.css';

const WinRate = () => {
    const { teamId } = useParams(); // URL 파라미터에서 teamId를 가져옴
    const [selectedTeamScore, setSelectedTeamScore] = useState(null);
    const [userTeamScore, setUserTeamScore] = useState(null);
    const [userTeamId, setUserTeamId] = useState(null);

    useEffect(() => {
        const fetchUserAndTeamData = async () => {
            try {
                // 사용자 정보 가져오기
                const userResponse = await axios.get('/user/info', {
                    headers: {
                        'x-session-id': sessionStorage.getItem('sessionId'),
                    },
                });

                if (userResponse.data.success) {
                    setUserTeamId(userResponse.data.data.teamId); // 사용자 팀 ID 저장

                    // 사용자 팀 스코어 가져오기
                    const userTeamResponse = await axios.get('/team/winrate', {
                        headers: {
                            'x-session-id': sessionStorage.getItem('sessionId'),
                        },
                        params: {
                            teamId: userResponse.data.data.teamId,
                        },
                    });

                    if (userTeamResponse.data.success) {
                        setUserTeamScore(userTeamResponse.data.data.team_score);
                    } else {
                        console.error('Failed to fetch user team score:', userTeamResponse.data.message);
                    }
                } else {
                    console.error('Failed to fetch user info:', userResponse.data.message);
                }

                // 선택된 팀 스코어 가져오기
                const selectedTeamResponse = await axios.get('/team/winrate', {
                    headers: {
                        'x-session-id': sessionStorage.getItem('sessionId'),
                    },
                    params: {
                        teamId: teamId,
                    },
                });

                if (selectedTeamResponse.data.success) {
                    setSelectedTeamScore(selectedTeamResponse.data.data.team_score);
                } else {
                    console.error('Failed to fetch selected team score:', selectedTeamResponse.data.message);
                }
            } catch (error) {
                console.error('Failed to fetch team score data:', error);
            }
        };

        fetchUserAndTeamData();
    }, [teamId]);

    return (
        <div className="winrate-container">
            <h1>팀 스코어</h1>
            {selectedTeamScore !== null && userTeamScore !== null ? (
                <div className="winrate-info">
                    <div className="selected-team-score">
                        <h2>선택한 팀 ID: {teamId}</h2>
                        <p>팀 스코어: {selectedTeamScore}</p>
                    </div>
                    <div className="user-team-score">
                        <h2>가입한 팀 ID: {userTeamId}</h2>
                        <p>팀 스코어: {userTeamScore}</p>
                    </div>
                </div>
            ) : (
                <p>팀 스코어 데이터를 불러오는 중입니다...</p>
            )}
        </div>
    );
};

export default WinRate;
