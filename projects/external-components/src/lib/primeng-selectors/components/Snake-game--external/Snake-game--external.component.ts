import { Component, HostListener } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

type Direction = 'up' | 'down' | 'left' | 'right';

@Component({
  selector: 'app-snake-game-',
  template: `
    <div class="snake-container" tabindex="0"
      (touchstart)="onTouchStart($event)" 
      (touchend)="onTouchEnd($event)">
      <div class="score">Score: {{ score }}</div>
      <div class="board">
        <div *ngFor="let row of board; let y = index" class="row">
          <div *ngFor="let cell of row; let x = index"
            [ngClass]="{
              'snake': isSnakeCell(x, y),
              'food': food.x === x && food.y === y
            }"
            class="cell"></div>
        </div>
      </div>
      <div *ngIf="gameOver" class="game-over">
        Game Over<br>
        <button (click)="resetGame()">Restart</button>
      </div>
    </div>
  `,
  styles: [`
    .snake-container {
      width: 100vw;
      max-width: 400px;
      margin: auto;
      outline: none;
      user-select: none;
    }
    .score {
      text-align: center;
      font-size: 1.2em;
      margin-bottom: 8px;
    }
    .board {
      display: flex;
      flex-direction: column;
      background: #222;
      border: 2px solid #444;
    }
    .row {
      display: flex;
    }
    .cell {
      width: 20px;
      height: 20px;
      background: #111;
      border: 1px solid #333;
    }
    .snake {
      background: #4caf50 !important;
    }
    .food {
      background: #ff5252 !important;
    }
    .game-over {
      text-align: center;
      color: #fff;
      font-size: 1.5em;
      background: rgba(0,0,0,0.7);
      padding: 16px;
      border-radius: 8px;
      margin-top: 12px;
    }
    button {
      margin-top: 10px;
      padding: 6px 16px;
      font-size: 1em;
      border-radius: 4px;
      border: none;
      background: #4caf50;
      color: white;
      cursor: pointer;
    }
  `]
})
export class SnakeGameComponent extends CommonExternalComponent {
  readonly boardSize: number = 15;
  board: number[][] = [];
  snake: {x: number, y: number}[] = [];
  direction: Direction = 'right';
  nextDirection: Direction = 'right';
  food: {x: number, y: number} = {x: 0, y: 0};
  gameInterval: any;
  score: number = 0;
  gameOver: boolean = false;

  // Touch tracking for swipe detection
  private touchStartX: number = 0;
  private touchStartY: number = 0;

  constructor() {
    super();
    this.resetGame();
  }

  ngOnDestroy(): void {
    clearInterval(this.gameInterval);
  }

  resetGame(): void {
    this.snake = [{x: 7, y: 7}];
    this.direction = 'right';
    this.nextDirection = 'right';
    this.score = 0;
    this.gameOver = false;
    this.generateBoard();
    this.placeFood();
    clearInterval(this.gameInterval);
    this.gameInterval = setInterval(() => this.moveSnake(), 120);
  }

  generateBoard(): void {
    this.board = Array.from({length: this.boardSize}, () =>
      Array(this.boardSize).fill(0)
    );
  }

  placeFood(): void {
    let newFood: {x: number, y: number};
    do {
      newFood = {
        x: Math.floor(Math.random() * this.boardSize),
        y: Math.floor(Math.random() * this.boardSize)
      };
    } while (this.snake.some(seg => seg.x === newFood.x && seg.y === newFood.y));
    this.food = newFood;
  }

  moveSnake(): void {
    if (this.gameOver) return;

    this.direction = this.nextDirection;
    const head = {...this.snake[0]};
    switch (this.direction) {
      case 'up': head.y -= 1; break;
      case 'down': head.y += 1; break;
      case 'left': head.x -= 1; break;
      case 'right': head.x += 1; break;
    }

    // Check collision
    if (
      head.x < 0 || head.x >= this.boardSize ||
      head.y < 0 || head.y >= this.boardSize ||
      this.snake.some(seg => seg.x === head.x && seg.y === head.y)
    ) {
      this.gameOver = true;
      clearInterval(this.gameInterval);
      return;
    }

    this.snake.unshift(head);

    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      this.placeFood();
    } else {
      this.snake.pop();
    }
  }

  isSnakeCell(x: number, y: number): boolean {
    return this.snake.some(seg => seg.x === x && seg.y === y);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (this.gameOver) return;
    switch (event.key) {
      case 'ArrowUp':
        if (this.direction !== 'down') this.nextDirection = 'up';
        break;
      case 'ArrowDown':
        if (this.direction !== 'up') this.nextDirection = 'down';
        break;
      case 'ArrowLeft':
        if (this.direction !== 'right') this.nextDirection = 'left';
        break;
      case 'ArrowRight':
        if (this.direction !== 'left') this.nextDirection = 'right';
        break;
    }
  }

  onTouchStart(event: TouchEvent): void {
    const touch: Touch = event.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
  }

  onTouchEnd(event: TouchEvent): void {
    if (!event.changedTouches.length) return;
    const touch: Touch = event.changedTouches[0];
    const dx: number = touch.clientX - this.touchStartX;
    const dy: number = touch.clientY - this.touchStartY;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 30 && this.direction !== 'left') this.nextDirection = 'right';
      else if (dx < -30 && this.direction !== 'right') this.nextDirection = 'left';
    } else {
      if (dy > 30 && this.direction !== 'up') this.nextDirection = 'down';
      else if (dy < -30 && this.direction !== 'down') this.nextDirection = 'up';
    }
  }
}

/*
Features:
- Classic Snake game playable with swipe gestures (mobile) and arrow keys (desktop).
- Responsive board and touch controls.
- Score tracking and restart option after game over.
- No external libraries required.
*/