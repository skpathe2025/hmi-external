import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonExternalComponent } from '../common-external/common-external.component';

@Component({
  selector: 'app-track-baby-vaccination',
  template: `
    <div class="container">
      <h2>Track Baby Vaccination</h2>
      <form [formGroup]="babyForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Baby Name:</label>
          <input formControlName="name" type="text" class="form-control" placeholder="Enter baby name">
          <div *ngIf="babyForm.get('name')?.invalid && babyForm.get('name')?.touched" class="error">
            Name is required.
          </div>
        </div>
        <div class="form-group">
          <label>Date of Birth:</label>
          <input formControlName="dob" type="date" class="form-control">
          <div *ngIf="babyForm.get('dob')?.invalid && babyForm.get('dob')?.touched" class="error">
            Date of birth is required.
          </div>
        </div>
        <div formArrayName="vaccinations">
          <h3>Vaccinations</h3>
          <div *ngFor="let vaccination of vaccinations.controls; let i = index" [formGroupName]="i" class="vaccine-row">
            <input formControlName="vaccineName" placeholder="Vaccine Name" class="form-control vaccine-name">
            <input formControlName="date" type="date" class="form-control vaccine-date">
            <select formControlName="status" class="form-control vaccine-status">
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <button type="button" class="remove-btn" (click)="removeVaccination(i)">&#10006;</button>
          </div>
          <button type="button" class="add-btn" (click)="addVaccination()">+ Add Vaccine</button>
        </div>
        <button type="submit" [disabled]="babyForm.invalid" class="submit-btn">Save Record</button>
      </form>

      <div *ngIf="records.length > 0" class="records-section">
        <h3>Vaccination Records</h3>
        <table>
          <thead>
            <tr>
              <th>Baby Name</th>
              <th>DOB</th>
              <th>Vaccine</th>
              <th>Date</th>
              <th>Status</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let record of records; let idx=index">
              <td>{{record.name}}</td>
              <td>{{record.dob | date:'yyyy-MM-dd'}}</td>
              <td>
                <ul>
                  <li *ngFor="let v of record.vaccinations">{{v.vaccineName}}</li>
                </ul>
              </td>
              <td>
                <ul>
                  <li *ngFor="let v of record.vaccinations">{{v.date}}</li>
                </ul>
              </td>
              <td>
                <ul>
                  <li *ngFor="let v of record.vaccinations">{{v.status}}</li>
                </ul>
              </td>
              <td>
                <button class="delete-btn" (click)="removeRecord(idx)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 700px;
      margin: 30px auto;
      background: #f8f9fa;
      border-radius: 12px;
      padding: 28px 32px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.09);
      font-family: Arial, sans-serif;
    }
    h2, h3 { color: #1a237e; }
    .form-group { margin-bottom: 16px; }
    .form-control {
      width: 100%;
      padding: 7px 10px;
      margin: 5px 0 0 0;
      border: 1px solid #bdbdbd;
      border-radius: 4px;
      font-size: 15px;
    }
    .vaccine-row {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 8px;
    }
    .vaccine-name { flex: 2; }
    .vaccine-date, .vaccine-status { flex: 1; }
    .remove-btn {
      background: #e57373;
      border: none;
      color: #fff;
      font-weight: bold;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      cursor: pointer;
      font-size: 18px;
      line-height: 24px;
    }
    .add-btn {
      margin-top: 8px;
      background: #64b5f6;
      color: #fff;
      border: none;
      border-radius: 4px;
      padding: 5px 14px;
      cursor: pointer;
    }
    .submit-btn {
      margin-top: 20px;
      background: #388e3c;
      color: #fff;
      border: none;
      border-radius: 4px;
      padding: 8px 18px;
      font-size: 16px;
      cursor: pointer;
    }
    .submit-btn[disabled] {
      background: #bdbdbd;
      cursor: not-allowed;
    }
    .error {
      color: #d32f2f;
      font-size: 13px;
    }
    .records-section {
      margin-top: 40px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    th, td {
      border: 1px solid #bdbdbd;
      padding: 7px 10px;
      text-align: left;
    }
    th {
      background: #e3f2fd;
    }
    ul {
      list-style: none;
      padding-left: 0;
      margin: 0;
    }
    .delete-btn {
      background: #d32f2f;
      color: #fff;
      border: none;
      border-radius: 4px;
      padding: 4px 10px;
      cursor: pointer;
    }
  `]
})
export class TrackBabyVaccinationComponent extends CommonExternalComponent {
  babyForm: FormGroup;
  records: any[] = [];

  constructor(private fb: FormBuilder) {
    super();
    this.babyForm = this.fb.group({
      name: ['', Validators.required],
      dob: ['', Validators.required],
      vaccinations: this.fb.array([
        this.createVaccinationGroup()
      ])
    });
  }

  get vaccinations(): FormArray {
    return this.babyForm.get('vaccinations') as FormArray;
  }

  createVaccinationGroup(): FormGroup {
    return this.fb.group({
      vaccineName: ['', Validators.required],
      date: ['', Validators.required],
      status: ['pending', Validators.required]
    });
  }

  addVaccination() {
    this.vaccinations.push(this.createVaccinationGroup());
  }

  removeVaccination(index: number) {
    if (this.vaccinations.length > 1) {
      this.vaccinations.removeAt(index);
    }
  }

  onSubmit() {
    if (this.babyForm.valid) {
      this.records.push({...this.babyForm.value});
      this.babyForm.reset();
      // Reset vaccinations to one empty row after submit
      this.vaccinations.clear();
      this.addVaccination();
    }
  }

  removeRecord(index: number) {
    this.records.splice(index, 1);
  }
}