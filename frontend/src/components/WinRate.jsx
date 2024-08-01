import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axios'; // axios 인스턴스의 URL이 올바른지 확인
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import '../css/winrate.css';

// Chart.js 구성 요소 등록
ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
);

const WinRate = () => {
    const { teamId } = useParams(); // URL 파라미터에서 teamId를 가져옴
    const [selectedTeamScore, setSelectedTeamScore] = useState(null);
    const [userTeamScore, setUserTeamScore] = useState(null);
    const [userTeamId, setUserTeamId] = useState(null);
    const [dataSelectedTeam, setDataSelectedTeam] = useState(null);
    const [dataUserTeam, setDataUserTeam] = useState(null);
    const [winRate, setWinRate] = useState(null);

    useEffect(() => {
        const fetchUserAndTeamData = async () => {
            try {
                // 사용자 정보 가져오기
                const userResponse = await axios.get('/winrate/userInfo', {
                    headers: {
                        'x-session-id': sessionStorage.getItem('sessionId'),
                    },
                });

                if (userResponse.data.success) {
                    setUserTeamId(userResponse.data.data.teamId); // 사용자 팀 ID 저장

                    // 사용자 팀 스코어 가져오기
                    const userTeamResponse = await axios.get('/winrate/winrate', {
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
                const selectedTeamResponse = await axios.get('/winrate/winrate', {
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

    useEffect(() => {
        if (selectedTeamScore !== null && userTeamScore !== null) {
            // 승률 계산
            const totalScore = Number(selectedTeamScore) + Number(userTeamScore);
            let userWinRate = ((userTeamScore / totalScore) * 100).toFixed(2);
            setWinRate(userWinRate);

            // 선택된 팀 차트 데이터 설정
            const chartDataSelectedTeam = {
                labels: [''],
                datasets: [
                    {
                        label: '팀 스코어',
                        data: [selectedTeamScore],
                        backgroundColor: ['rgba(75, 192, 192, 0.5)'],
                        borderColor: ['rgba(75, 192, 192, 1)'],
                        borderWidth: 1,
                    },
                ],
            };

            // 가입한 팀 차트 데이터 설정
            const chartDataUserTeam = {
                labels: [''],
                datasets: [
                    {
                        label: '팀 스코어',
                        data: [userTeamScore],
                        backgroundColor: ['rgba(255, 99, 132, 0.5)'],
                        borderColor: ['rgba(255, 99, 132, 1)'],
                        borderWidth: 1,
                    },
                ],
            };

            setDataSelectedTeam(chartDataSelectedTeam);
            setDataUserTeam(chartDataUserTeam);
        }
    }, [selectedTeamScore, userTeamScore]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        maxBarThickness: 100,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => `${tooltipItem.raw}`, // 레이블 형식 설정
                },
            },
        },
        indexAxis: 'x', // 수직 바 차트 설정
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: false,
                    text: '팀 스코어',
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: false,
                    text: '팀 이름',
                },
            },
        },
    };

    return (
        <div className="winrate-containers">
            <div className="win-rate">
            {selectedTeamScore !== null && userTeamScore !== null ? (
                <div className="winrate-info">
                    <h2>승률 예측</h2>
                    <p>{`가입한 팀의 승률: ${winRate !== null ? winRate + '%' : '계산 중...'}`}</p>
                </div>
            ) : (
                <p>팀 스코어 데이터를 불러오는 중입니다...</p>
            )}
            </div>
            <div className="chart-container">
                <div className="chart">
                    {dataSelectedTeam && <Bar data={dataSelectedTeam} options={options} style={{width : '300px'}}/>}
                    <div className="team-info selected-team">
                        <h2 className="team-name">상대 팀 ID: {teamId}</h2>
                        <p>팀 스코어: {selectedTeamScore}</p>
                    </div>
                </div>
                <div className="chart">
                    {dataUserTeam && <Bar data={dataUserTeam} options={options} style={{width : '300px'}}/>}
                    <div className="team-info user-team">
                        <h2 className="team-name">사용자 팀 ID: {userTeamId}</h2>
                        <p>팀 스코어: {userTeamScore}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WinRate;
