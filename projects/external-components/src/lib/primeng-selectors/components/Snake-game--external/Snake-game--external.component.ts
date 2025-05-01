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
      <div class="controls">
        <button aria-label="Up" (click)="changeDirection('up')" [disabled]="direction==='down'">&#8593;</button>
        <div>
          <button aria-label="Left" (click)="changeDirection('left')" [disabled]="direction==='right'">&#8592;</button>
          <button aria-label="Down" (click)="changeDirection('down')" [disabled]="direction==='up'">&#8595;</button>
          <button aria-label="Right" (click)="changeDirection('right')" [disabled]="direction==='left'">&#8594;</button>
        </div>
      </div>
    </div>
    <audio #eatSound id="eatSound" src="https://cdn.pixabay.com/audio/2022/03/15/audio_115b9e3c2f.mp3"></audio>
    <audio #gameOverSound id="gameOverSound" src="https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa3c2a.mp3"></audio>
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
      margin: 4px;
      padding: 10px 18px;
      font-size: 1.2em;
      border-radius: 6px;
      border: none;
      background: #4caf50;
      color: white;
      cursor: pointer;
      min-width: 44px;
      min-height: 44px;
      transition: background 0.2s;
    }
    button[disabled] {
      background: #888 !important;
      cursor: not-allowed;
    }
    .controls {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 14px;
      gap: 2px;
      user-select: none;
    }
    .controls > div {
      display: flex;
      justify-content: center;
      gap: 2px;
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

  // Speed and sound
  speed: number = 120;
  readonly minSpeed: number = 60;
  readonly speedStep: number = 8;

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
    this.speed = 120;
    this.generateBoard();
    this.placeFood();
    clearInterval(this.gameInterval);
    this.setGameInterval();
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
    } while (this.snake.some((seg: {x: number, y: number}) => seg.x === newFood.x && seg.y === newFood.y));
    this.food = newFood;
  }

  setGameInterval(): void {
    clearInterval(this.gameInterval);
    this.gameInterval = setInterval(() => this.moveSnake(), this.speed);
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
      this.snake.some((seg: {x: number, y: number}) => seg.x === head.x && seg.y === head.y)
    ) {
      this.gameOver = true;
      clearInterval(this.gameInterval);
      this.playGameOverSound();
      return;
    }

    this.snake.unshift(head);

    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      this.placeFood();
      this.increaseSpeed();
      this.playEatSound();
    } else {
      this.snake.pop();
    }
  }

  increaseSpeed(): void {
    if (this.speed > this.minSpeed) {
      this.speed = Math.max(this.minSpeed, this.speed - this.speedStep);
      this.setGameInterval();
    }
  }

  isSnakeCell(x: number, y: number): boolean {
    return this.snake.some((seg: {x: number, y: number}) => seg.x === x && seg.y === y);
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

  changeDirection(dir: Direction): void {
    if (this.gameOver) return;
    // Prevent reversing into itself
    if (
      (dir === 'up' && this.direction !== 'down') ||
      (dir === 'down' && this.direction !== 'up') ||
      (dir === 'left' && this.direction !== 'right') ||
      (dir === 'right' && this.direction !== 'left')
    ) {
      this.nextDirection = dir;
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

  playEatSound(): void {
    const audioElem = document.getElementById('eatSound') as HTMLAudioElement | null;
    if (audioElem) {
      audioElem.currentTime = 0;
      audioElem.play().catch(() => {});
    }
  }

  playGameOverSound(): void {
    const audioElem = document.getElementById('gameOverSound') as HTMLAudioElement | null;
    if (audioElem) {
      audioElem.currentTime = 0;
      audioElem.play().catch(() => {});
    }
  }
}

/*
Features:
- Classic Snake game with swipe (mobile), keyboard (desktop), and on-screen direction button controls.
- Four buttons (up, down, left, right) for movement; buttons are disabled if the move would reverse the snake.
- Sound effects for eating food and game over using online files:
  - Eat: https://cdn.pixabay.com/audio/2022/03/15/audio_115b9e3c2f.mp3
  - Game over: https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa3c2a.mp3
- Score tracking and restart option.
- Snake speed increases each time food is eaten.
- No external libraries required.
*/