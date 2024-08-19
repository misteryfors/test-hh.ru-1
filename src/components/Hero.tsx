class Hero {
    x: number; // Позиция героя по оси X
    y: number; // Позиция героя по оси Y
    color: string; // Цвет героя
    radius: number; // Радиус героя (размер)
    speed: number; // Скорость перемещения героя
    fireRate: number; // Скорость стрельбы героя (высчитывается в снарядах в секунду)
    direction: number; // Направление движения героя по оси Y (1 - вниз, -1 - вверх)

    constructor(x: number, y: number, color: string, speed: number, fireRate: number) {
        this.x = x; // Устанавливаем начальную позицию по X
        this.y = y; // Устанавливаем начальную позицию по Y
        this.color = color; // Устанавливаем цвет героя
        this.radius = 20; // Устанавливаем радиус героя (размер)
        this.speed = speed; // Устанавливаем скорость перемещения героя
        this.fireRate = fireRate; // Устанавливаем скорость стрельбы героя
        this.direction = 1;  // Изначально герой движется вниз по оси Y
    }

    // Обновление положения героя с учетом границ холста
    update(canvasHeight: number) {
        // Проверяем, находится ли герой в пределах холста после перемещения
        if (this.y + this.direction * this.speed > this.radius &&
            this.y + this.direction * this.speed < canvasHeight - this.radius) {
            this.y += this.direction * this.speed; // Перемещаем героя
        } else {
            this.direction = -this.direction;  // Меняем направление движения, если герой достигает верхней или нижней границы холста
        }
    }

    // Отрисовка героя на холсте
    draw(context: CanvasRenderingContext2D) {
        context.beginPath(); // Начинаем новый путь для рисования
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI); // Рисуем круг, представляющий героя
        context.fillStyle = this.color; // Задаем цвет героя
        context.fill(); // Заполняем круг цветом
        context.stroke(); // Рисуем контур круга
    }
}

export default Hero;
