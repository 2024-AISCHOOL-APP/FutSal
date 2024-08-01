import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/winrate.css';

const WinRate = () => {
    const exampleTeamData = [
        {
            name: '팀 A',
            winRate: '45%',
            icon: 'https://via.placeholder.com/100',
            stats: {
                attack: 70,
                defense: 60,
                shooting: 80,
                passing: 75,
            },
        },
        {
            name: '팀 B',
            winRate: '55%',
            icon: 'https://via.placeholder.com/100',
            stats: {
                attack: 65,
                defense: 70,
                shooting: 85,
                passing: 80,
            },
        },
    ];

    return (
        <Container>
            <Row className="my-4 justify-content-center">
                <Col md={5} className="text-start">
                    <div className="team-name">
                        <h2>팀 A</h2>
                    </div>
                    <div className="win-rate my-2">
                        <h4>승률</h4>
                        <h1>45%</h1>
                    </div>
                    {/* <div className="team-icon my-2">
                        <img
                            src="https://via.placeholder.com/100"
                            alt="팀 A"
                            style={{ width: '100px', height: '100px' }}
                        />
                    </div> */}
                    <div className="stats my-2">
                        <div className="stat">
                            <span>공격</span>
                            <div className="bar-container">
                                <div className="bar" style={{ width: '70%' }}></div>
                                <span className="wr-left-percentage">70%</span>
                            </div>
                        </div>
                        <div className="stat">
                            <span>수비</span>
                            <div className="bar-container">
                                <div className="bar" style={{ width: '60%' }}></div>
                                <span className="wr-left-percentage">60%</span>
                            </div>
                        </div>
                        <div className="stat">
                            <span>슈팅</span>
                            <div className="bar-container">
                                <div className="bar" style={{ width: '80%' }}></div>
                                <span className="wr-left-percentage">80%</span>
                            </div>
                        </div>
                        <div className="stat">
                            <span>패스</span>
                            <div className="bar-container">
                                <div className="bar" style={{ width: '75%' }}></div>
                                <span className="wr-left-percentage">75%</span>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col md={1} className="divider">
                    <div className="vertical-divider"></div>
                </Col>
                <Col md={5} className="text-end stats reverse">
                    <div className="team-name">
                        <h2>팀 B</h2>
                    </div>
                    <div className="win-rate my-2">
                        <h4>승률</h4>
                        <h1>55%</h1>
                    </div>
                    {/* <div className="team-icon my-2">
                        <img
                            src="https://via.placeholder.com/100"
                            alt="팀 B"
                            style={{ width: '100px', height: '100px' }}
                        />
                    </div> */}
                    <div className="stats my-2">
                        <div className="stat">
                            <span>공격</span>
                            <div className="bar-container">
                                <div className="bar" style={{ width: '65%'}}></div>
                                <span className="wr-right-percentage">65%</span>
                            </div> 
                        </div>
                        <div className="stat">
                            <span>수비</span>
                            <div className="bar-container">
                                <div className="bar" style={{ width: '70%' }}></div>
                                <span className="wr-right-percentage">70%</span>
                            </div>
                        </div>
                        <div className="stat">
                            <span>슈팅</span>
                            <div className="bar-container">
                                <div className="bar" style={{ width: '85%' }}></div>
                                <span className="wr-right-percentage">85%</span>
                            </div>
                        </div>
                        <div className="stat">
                            <span>패스</span>
                            <div className="bar-container">
                                <div className="bar" style={{ width: '80%' }}></div>
                                <span className="wr-right-percentage">80%</span>
                            </div>
                        </div>
                    </div>
                </Col>

            </Row>
        </Container>

    );
};

export default WinRate;