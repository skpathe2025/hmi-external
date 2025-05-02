import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

/*
  Features:
  - 3x3 Sudoku grid (single box)
  - Input validation: accepts digits 1-3 only
  - Highlights invalid entries (duplicates in row/column/box)
  - Reset button to clear the board
*/

@Component({
  selector: 'app-suduku',
  template: `
    <div class="sudoku-container">
      <h2>3x3 Sudoku</h2>
      <table>
        <tr *ngFor="let row of [0,1,2]; let i = index">
          <td *ngFor="let col of [0,1,2]; let j = index">
            <input
              type="text"
              maxlength="1"
              [ngClass]="{'invalid': isInvalid(i, j)}"
              [(ngModel)]="grid[i][j]"
              (input)="onInput(i, j)"
            />
          </td>
        </tr>
      </table>
      <button (click)="resetGrid()">Reset</button>
    </div>
  `,
  styles: [`
    .sudoku-container {
      display: inline-block;
      padding: 16px;
      border-radius: 8px;
      background: #f9f9f9;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
    }
    table {
      margin: 0 auto 12px auto;
      border-collapse: collapse;
    }
    td {
      border: 1px solid #ccc;
      width: 40px;
      height: 40px;
      padding: 0;
    }
    input[type="text"] {
      width: 100%;
      height: 100%;
      font-size: 1.5rem;
      text-align: center;
      border: none;
      outline: none;
      background: transparent;
    }
    input.invalid {
      background: #ffd6d6;
    }
    button {
      padding: 6px 18px;
      font-size: 1rem;
      border: none;
      background: #007bff;
      color: white;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background: #0056b3;
    }
  `]
})
export class SudukuComponent extends CommonExternalComponent {
  grid: string[][] = Array.from({length: 3}, () => Array(3).fill(''));

  onInput(row: number, col: number): void {
    const val: string = this.grid[row][col];
    if (!/^[1-3]$/.test(val)) {
      this.grid[row][col] = '';
    }
  }

  isInvalid(row: number, col: number): boolean {
    const val: string = this.grid[row][col];
    if (!val) return false;
    // Check row & column for duplicates
    for (let k = 0; k < 3; k++) {
      if (k !== col && this.grid[row][k] === val) return true;
      if (k !== row && this.grid[k][col] === val) return true;
    }
    return false;
  }

  resetGrid(): void {
    this.grid = Array.from({length: 3}, () => Array(3).fill(''));
  }
}