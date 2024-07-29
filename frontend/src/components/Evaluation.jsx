import React, { useState, useEffect } from 'react';
import '../css/evaluation.css';
import axios from '../axios';
import { Button } from 'react-bootstrap';

const Evaluation = () => {
    const [evaluation, setEvaluation] = useState({
        matchNum: '',
        teamId: '',
        matchDate: '',
        matchPlace: '',
        matchResult: 'win',
        matchShooting: 1,
        matchPassing: 1,
        matchDribbling: 1,
        matchSpeed: 1,
        matchDefense: 1,
        matchGoalkeeper: 1,
    });

    const [matches, setMatches] = useState([]);

    useEffect(() => {
        const fetchMatchInfo = async () => {
            try {
                const response = await axios.get('/evaluation/matchInfo');
                setMatches(response.data);
            } catch (error) {
                console.error('Error fetching match info:', error);
            }
        };

        fetchMatchInfo();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvaluation({
            ...evaluation,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/evaluation/postEvaluation', evaluation);
            console.log(response);
            alert('데이터가 성공적으로 저장되었습니다!');
        } catch (error) {
            console.error('데이터 전송 중 오류 발생:', error);
            alert('데이터 저장 중 오류가 발생했습니다.');
        }
    };

    const handleMatchChange = (e) => {
        const matchNum = e.target.value;
        const match = matches.find(match => match.matchNum === matchNum);
        if (match) {
            setEvaluation(prevState => ({
                ...prevState,
                matchNum,
                matchDate: match.matchDate,
                matchPlace: match.matchPlace
            }));
        }
    };

    return (
        <div className="evaluation-container">
            <h1>경기 평가</h1>
            <form onSubmit={handleSubmit}>
                {/* <div className="form-group">
                    <label htmlFor="matchNum">경기 번호:</label>
                    <select id="matchNum" name="matchNum" value={evaluation.matchNum} onChange={handleMatchChange}>
                        <option value="">경기 번호 선택</option>
                        {matches.map(match => (
                            <option key={match.matchNum} value={match.matchNum}>
                                {match.matchNum}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="teamId">팀 ID:</label>
                    <input type="number" id="teamId" name="teamId" value={evaluation.teamId} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="matchDate">경기 날짜:</label>
                    <input type="date" id="matchDate" name="matchDate" value={evaluation.matchDate} readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="matchPlace">경기 장소:</label>
                    <input type="text" id="matchPlace" name="matchPlace" value={evaluation.matchPlace} readOnly />
                </div> */}
                <div className="form-group">
                    <label htmlFor="matchResult">결과:</label>
                    <select id="matchResult" name="matchResult" value={evaluation.matchResult} onChange={handleChange}>
                        <option value="win">승리</option>
                        <option value="lose">패배</option>
                        <option value="draw">무승부</option>
                    </select>
                </div>
                {['shooting', 'passing', 'dribbling', 'speed', 'defense', 'goalkeeper'].map((category) => (
                    <div className="form-group" key={category}>
                        <label>{category.charAt(0).toUpperCase() + category.slice(1)}</label>
                        <div className="radio-group">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <label key={value} className="radio-label">
                                    <input
                                        type="radio"
                                        name={`match${category.charAt(0).toUpperCase() + category.slice(1)}`}
                                        value={value}
                                        checked={evaluation[`match${category.charAt(0).toUpperCase() + category.slice(1)}`] == value}
                                        onChange={handleChange}
                                    />
                                    <span className="radio-text">레벨 {value}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
                <Button type="submit">저장</Button>
            </form>
        </div>
    );
};

export default Evaluation;
