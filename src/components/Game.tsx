import React, { useState, useRef, useEffect } from "react";
import ControlPanel from "./ControlPanel";
import Hero from "./Hero";
import Spell from "./Spell";
import ColorMenu from "./ColorMenu";

const Game: React.FC = () => {
    // Ссылки на canvas и массив заклинаний
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const spellsRef = useRef<Spell[]>([]);

    // Состояния для отслеживания очков и характеристик героев
    const [scoreLeft, setScoreLeft] = useState(0);
    const [scoreRight, setScoreRight] = useState(0);

    const [fireRateLeft, setFireRateLeft] = useState(1);
    const [speedLeft, setSpeedLeft] = useState(2);
    const [fireRateRight, setFireRateRight] = useState(1);
    const [speedRight, setSpeedRight] = useState(2);

    // Ссылки на героев и текущую позицию мыши
    const heroLeftRef = useRef<Hero | null>(null);
    const heroRightRef = useRef<Hero | null>(null);
    const mousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    // Ссылки на интервалы стрельбы для каждого героя
    const leftShootingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const rightShootingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Состояние для выбранного героя и видимости меню выбора цвета
    const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    // Запуск стрельбы для левого героя
    const startLeftShooting = () => {
        if (leftShootingIntervalRef.current) clearInterval(leftShootingIntervalRef.current);
        leftShootingIntervalRef.current = setInterval(() => {
            shootSpell(heroLeftRef.current!, 1);
        }, 1000 / fireRateLeft);
    };

    // Запуск стрельбы для правого героя
    const startRightShooting = () => {
        if (rightShootingIntervalRef.current) clearInterval(rightShootingIntervalRef.current);
        rightShootingIntervalRef.current = setInterval(() => {
            shootSpell(heroRightRef.current!, -1);
        }, 1000 / fireRateRight);
    };

    // Создание нового заклинания и добавление его в массив
    const shootSpell = (hero: Hero, vector: number) => {
        const newSpell = new Spell(hero.x, hero.y, vector, hero.color, vector);
        spellsRef.current.push(newSpell);
    };

    // Основной эффект, запускающийся при монтировании компонента
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");

        if (!canvas || !context) return;

        // Инициализация героев
        heroLeftRef.current = new Hero(50, canvas.height / 2, "blue", speedLeft, fireRateLeft);
        heroRightRef.current = new Hero(canvas.width - 50, canvas.height / 2, "red", speedRight, fireRateRight);

        const animate = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);

            const heroLeft = heroLeftRef.current!;
            const heroRight = heroRightRef.current!;

            // Ограничение движения героев по оси Y в зависимости от положения мыши
            if (Math.abs(mousePositionRef.current.x - heroLeft.x) < heroLeft.radius &&
                Math.abs(mousePositionRef.current.y - heroLeft.y) < heroLeft.radius) {
                heroLeft.direction = -heroLeft.direction;
                if (
                    heroLeft.y + heroLeft.direction - heroLeft.radius * 2 > 1 &&
                    heroLeft.y + heroLeft.direction + heroLeft.radius * 2 < canvas.height + 1
                )
                    heroLeft.y += heroLeft.direction;
            }

            if (Math.abs(mousePositionRef.current.x - heroRight.x)-5 < heroRight.radius &&
                Math.abs(mousePositionRef.current.y - heroRight.y)-5 < heroRight.radius) {
                heroRight.direction = -heroRight.direction;
                if (
                    heroRight.y + heroRight.direction - heroRight.radius * 2 > 1 &&
                    heroRight.y + heroRight.direction + heroRight.radius * 2 < canvas.height + 1
                )
                    heroRight.y += heroRight.direction;
            }

            // Обновление и отрисовка героев
            heroLeft.update(canvas.height);
            heroRight.update(canvas.height);
            heroLeft.draw(context);
            heroRight.draw(context);

            // Обработка заклинаний: удаление вышедших за границы и обработка столкновений
            spellsRef.current = spellsRef.current.filter((spell) => !spell.isOutOfBounds(canvas.width));
            spellsRef.current.forEach((spell) => {
                spell.update();
                spell.draw(context);

                // Проверка столкновения заклинаний с героями и обновление очков
                if (spell.collidesWith(heroLeft) && spell.direction !== 1) {
                    setScoreLeft((prevScore) => prevScore + 1);
                    spellsRef.current = spellsRef.current.filter((s) => s !== spell);
                }
                if (spell.collidesWith(heroRight) && spell.direction !== -1) {
                    setScoreRight((prevScore) => prevScore + 1);
                    spellsRef.current = spellsRef.current.filter((s) => s !== spell);
                }
            });

            // Запрос следующего кадра анимации
            requestAnimationFrame(animate);
        };

        // Запуск стрельбы и анимации
        startLeftShooting();
        startRightShooting();
        animate();

        // Очистка интервалов при размонтировании компонента
        return () => {
            if (leftShootingIntervalRef.current) clearInterval(leftShootingIntervalRef.current);
            if (rightShootingIntervalRef.current) clearInterval(rightShootingIntervalRef.current);
        };
    }, []);

    // Обработка движения мыши
    const handleMouseMove = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        mousePositionRef.current = { x: mouseX, y: mouseY };
    };

    // Обработка кликов для выбора героя
    const handleClick = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const heroLeft = heroLeftRef.current!;
        const heroRight = heroRightRef.current!;

        // Определение, был ли выбран один из героев, и открытие меню
        if (Math.abs(mouseX - heroLeft.x) < heroLeft.radius && Math.abs(mouseY - heroLeft.y) < heroLeft.radius) {
            setSelectedHero(heroLeft);
            setIsMenuVisible(true);
        } else if (Math.abs(mouseX - heroRight.x) < heroRight.radius && Math.abs(mouseY - heroRight.y) < heroRight.radius) {
            setSelectedHero(heroRight);
            setIsMenuVisible(true);
        } else {
            setIsMenuVisible(false);
        }
    };

    // Обработка изменения цвета выбранного героя
    const handleColorChange = (color: string) => {
        if (selectedHero) {
            selectedHero.color = color;
        }
        setIsMenuVisible(false);
    };

    // Обработка изменения скорости стрельбы и движения для левого героя
    const handleFireRateChangeLeft = (rate: number) => {
        setFireRateLeft(rate);
        clearInterval(leftShootingIntervalRef.current!);
        startLeftShooting();
    };

    const handleSpeedChangeLeft = (speed: number) => {
        setSpeedLeft(speed);
        heroLeftRef.current!.speed = speed;
    };

    // Обработка изменения скорости стрельбы и движения для правого героя
    const handleFireRateChangeRight = (rate: number) => {
        setFireRateRight(rate);
        clearInterval(rightShootingIntervalRef.current!);
        startRightShooting();
    };

    const handleSpeedChangeRight = (speed: number) => {
        setSpeedRight(speed);
        heroRightRef.current!.speed = speed;
    };

    // Рендер компонента
    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <canvas
                ref={canvasRef}
                width={1600}
                height={600}
                style={{border: "1px solid black "}}
                onMouseMove={handleMouseMove}
                onClick={handleClick}
            />
            <div className="scoreboard" style={{textAlign: "center", marginBottom: "10px"}}>
                <p>Left Hero Score: {scoreLeft}</p>
                <p>Right Hero Score: {scoreRight}</p>
            </div>
            <div style={{display: "flex", justifyContent: "space between"}}>
                <ControlPanel
                    hero="Left"
                    fireRate={fireRateLeft}
                    speed={speedLeft}
                    onFireRateChange={handleFireRateChangeLeft}
                    onSpeedChange={handleSpeedChangeLeft}
                />
                <ControlPanel
                    hero="Right"
                    fireRate={fireRateRight}
                    speed={speedRight}
                    onFireRateChange={handleFireRateChangeRight}
                    onSpeedChange={handleSpeedChangeRight}
                />
            </div>
            {isMenuVisible && selectedHero && (
                <ColorMenu onSelectColor={handleColorChange}/>
            )}
        </div>
    );
};

export default Game;
