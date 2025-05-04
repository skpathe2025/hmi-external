import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

/*
  Features:
  - 3x3 Sudoku grid (single box)
  - Some cells are prefilled with numbers and disabled for editing
  - Input validation: accepts digits 1-3 only in editable cells
  - Highlights invalid entries (duplicates in row/column/box)
  - Reset button to clear the board (restores prefilled numbers)
  - Button uses blue color scheme
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
              [value]="grid[i][j]"
              [disabled]="isPrefilled(i, j)"
              [ngClass]="{'invalid': isInvalid(i, j)}"
              (input)="onInput(i, j, $event.target.value)"
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
    input[disabled] {
      background: #e3f0ff !important;
      color: #1565c0;
      font-weight: bold;
      cursor: not-allowed;
    }
    button {
      padding: 6px 18px;
      font-size: 1rem;
      border: none;
      background: #1976d2;
      color: white;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:hover {
      background: #115293;
    }
  `]
})
export class SudukuComponent extends CommonExternalComponent {
  // Prefill positions: [row, col]: value
  private readonly prefilled: {[key: string]: string} = {
    '0,0': '1',
    '1,1': '2',
    '2,2': '3'
  };

  grid: string[][] = this.getInitialGrid();

  private getInitialGrid(): string[][] {
    const initial: string[][] = Array.from({length: 3}, () => Array(3).fill(''));
    for (const key in this.prefilled) {
      const [row, col]: number[] = key.split(',').map(Number);
      initial[row][col] = this.prefilled[key];
    }
    return initial;
  }

  isPrefilled(row: number, col: number): boolean {
    return !!this.prefilled[`${row},${col}`];
  }

  onInput(row: number, col: number, val: string): void {
    if (this.isPrefilled(row, col)) return;
    if (!/^[1-3]$/.test(val)) {
      this.grid[row][col] = '';
    } else {
      this.grid[row][col] = val;
    }
  }

  isInvalid(row: number, col: number): boolean {
    const val: string = this.grid[row][col];
    if (!val || this.isPrefilled(row, col)) return false;
    for (let k = 0; k < 3; k++) {
      if (k !== col && this.grid[row][k] === val) return true;
      if (k !== row && this.grid[k][col] === val) return true;
    }
    return false;
  }

  resetGrid(): void {
    this.grid = this.getInitialGrid();
  }
}