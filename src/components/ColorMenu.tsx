import React from "react";

interface ColorMenuProps {
    onSelectColor: (color: string) => void;
}

const ColorMenu: React.FC<ColorMenuProps> = ({ onSelectColor }) => {
    return (
        // Абсолютное позиционирование меню выбора цвета в верхней части экрана
        <div style={{ position: "absolute", top: "10px", left: "50%", transform: "translateX(-50%)" }}>
            <p>Select Spell Color:</p>
            {/* Кнопки для выбора цвета заклинания */}
            <button onClick={() => onSelectColor("red")}>Red</button>
            <button onClick={() => onSelectColor("blue")}>Blue</button>
            <button onClick={() => onSelectColor("green")}>Green</button>
        </div>
    );
};

export default ColorMenu;
