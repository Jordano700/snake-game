class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 400;
        this.canvas.height = 400;
        this.gridSize = 20;
        this.snake = [];
        this.food = {};
        this.direction = 'right';
        this.score = 0;
        this.gameLoop = null;
        this.startBtn = document.getElementById('startBtn');
        this.scoreDisplay = document.getElementById('score');

        this.startBtn.addEventListener('click', () => this.startGame());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    startGame() {
        // Reset game state
        this.snake = [
            { x: 5, y: 5 },
            { x: 4, y: 5 },
            { x: 3, y: 5 }
        ];
        this.direction = 'right';
        this.score = 0;
        this.scoreDisplay.textContent = this.score;
        this.generateFood();
        this.startBtn.textContent = 'Restart Game';

        // Clear previous game loop if exists
        if (this.gameLoop) clearInterval(this.gameLoop);

        // Start game loop
        this.gameLoop = setInterval(() => this.update(), 150);
    }

    generateFood() {
        this.food = {
            x: Math.floor(Math.random() * (this.canvas.width / this.gridSize)),
            y: Math.floor(Math.random() * (this.canvas.height / this.gridSize))
        };

        // Check if food spawned on snake
        const foodOnSnake = this.snake.some(segment => 
            segment.x === this.food.x && segment.y === this.food.y
        );

        if (foodOnSnake) this.generateFood();
    }

    update() {
        const head = { ...this.snake[0] };

        // Update head position based on direction
        switch (this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // Check for collisions
        if (this.checkCollision(head)) {
            this.endGame();
            return;
        }

        // Add new head
        this.snake.unshift(head);

        // Check if snake ate food
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.scoreDisplay.textContent = this.score;
            this.generateFood();
        } else {
            // Remove tail if no food eaten
            this.snake.pop();
        }

        this.draw();
    }

    checkCollision(head) {
        // Wall collision
        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize) {
            return true;
        }

        // Self collision
        return this.snake.some(segment => segment.x === head.x && segment.y === head.y);
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake
        this.snake.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 ? '#e74c3c' : '#27ae60';
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 1,
                this.gridSize - 1
            );
        });

        // Draw food
        this.ctx.fillStyle = '#f1c40f';
        this.ctx.fillRect(
            this.food.x * this.gridSize,
            this.food.y * this.gridSize,
            this.gridSize - 1,
            this.gridSize - 1
        );
    }

    handleKeyPress(e) {
        const newDirection = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right'
        }[e.key];

        if (!newDirection) return;

        // Prevent 180-degree turns
        const opposites = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };

        if (opposites[newDirection] !== this.direction) {
            this.direction = newDirection;
        }
    }

    endGame() {
        clearInterval(this.gameLoop);
        this.gameLoop = null;
        alert(`Game Over! Score: ${this.score}`);
        this.startBtn.textContent = 'Start Game';
    }
}

// Initialize game when window loads
window.onload = () => {
    new SnakeGame();
};