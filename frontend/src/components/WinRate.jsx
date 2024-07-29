import '../css/winrate.css';
const WinRate = () => {
    return (
        <div className="win-rate-container">
            <div className="team-info opponent-team">
                <h2>상대팀 정보</h2>
                <p>승률: 60%</p>
                {/* 상대팀의 추가 정보와 승률을 여기에 추가 */}
            </div>
            <div className="team-info our-team">
                <h2>우리팀 정보</h2>
                <p>승률: 75%</p>
                {/* 우리팀의 추가 정보와 승률을 여기에 추가 */}
            </div>
        </div>
    );
}

export default WinRate;