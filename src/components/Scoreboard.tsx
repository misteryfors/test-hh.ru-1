import React from "react";

interface ScoreBoardProps {
    scoreLeft: number;  // Очки левого героя
    scoreRight: number;  // Очки правого героя
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ scoreLeft, scoreRight }) => {
    return (
        // Отображение очков в центре экрана
        <div style={{ textAlign: "center", marginTop: "10px" }}>
            <p>Left Hero: {scoreLeft} - Right Hero: {scoreRight}</p>
        </div>
    );
};

export default ScoreBoard;
