import Hero from "./Hero";

// Класс, представляющий заклинание или снаряд
class Spell {
    x: number; // Позиция заклинания по оси X
    y: number; // Позиция заклинания по оси Y
    radius: number; // Радиус заклинания
    color: string; // Цвет заклинания
    speed: number; // Скорость перемещения заклинания
    direction: number; // Направление движения (1 - вправо, -1 - влево)

    constructor(heroX: number, heroY: number, vector: number, color: string, direction: number) {
        this.radius = 5; // Устанавливаем радиус заклинания
        this.color = color; // Устанавливаем цвет заклинания
        this.speed = 1; // Устанавливаем скорость заклинания
        this.direction = direction; // Направление движения заклинания

        // Устанавливаем начальную позицию заклинания, смещая его немного по оси X
        // относительно героя, чтобы избежать немедленного столкновения с ним
        this.x = heroX + (this.radius + 10) * direction;
        this.y = heroY; // Позиция по Y совпадает с положением героя
    }

    // Обновление позиции заклинания в соответствии с его скоростью и направлением
    update() {
        this.x += this.speed * this.direction;
    }

    // Отрисовка заклинания на canvas
    draw(context: CanvasRenderingContext2D) {
        context.beginPath(); // Начинаем новый путь для рисования
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2); // Рисуем круг (заклинание)
        context.fillStyle = this.color; // Задаем цвет заклинания
        context.fill(); // Заполняем круг цветом
        context.closePath(); // Закрываем путь рисования
    }

    // Проверка, вышло ли заклинание за границы canvas
    isOutOfBounds(canvasWidth: number) {
        return this.x < 0 || this.x > canvasWidth;
    }

    // Проверка столкновения заклинания с героем
    collidesWith(hero: Hero) {
        const dist = Math.sqrt((this.x - hero.x) ** 2 + (this.y - hero.y) ** 2); // Вычисляем расстояние между центрами заклинания и героя
        return dist < this.radius + hero.radius; // Проверяем, меньше ли это расстояние суммы радиусов (если да, то столкновение произошло)
    }
}

export default Spell;
