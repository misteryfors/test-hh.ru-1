import React from "react";

interface ControlPanelProps {
    hero: "Left" | "Right";  // Определение, для какого героя панель управления
    fireRate: number;        // Текущая частота стрельбы героя
    speed: number;           // Текущая скорость движения героя
    onFireRateChange: (rate: number) => void;  // Обработчик изменения частоты стрельбы
    onSpeedChange: (speed: number) => void;    // Обработчик изменения скорости движения
}

const ControlPanel: React.FC<ControlPanelProps> = ({
                                                       hero,
                                                       fireRate,
                                                       speed,
                                                       onFireRateChange,
                                                       onSpeedChange,
                                                   }) => {
    return (
        // Контейнер для панели управления с вертикальной компоновкой элементов
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "10px" }}>
            <div style={{ marginBottom: "10px" }}>
                <label>{hero} Hero Fire Rate:</label>
                {/* Слайдер для изменения частоты стрельбы */}
                <input
                    type="range"
                    min="0.1"
                    max="5"
                    step="0.01"
                    value={fireRate}
                    onChange={(e) => onFireRateChange(Number(e.target.value))}
                    style={{ width: "100px", display: "block" }}
                />
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>{hero} Hero Speed:</label>
                {/* Слайдер для изменения скорости движения */}
                <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.01"
                    value={speed}
                    onChange={(e) => onSpeedChange(Number(e.target.value))}
                    style={{ width: "100px", display: "block" }}
                />
            </div>
        </div>
    );
};

export default ControlPanel;
