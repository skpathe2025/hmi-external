import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonExternalComponent } from '../common-external/common-external.component';

@Component({
  selector: 'app-recipe-saver',
  template: `
    <div class="recipe-saver-container">
      <h2>Recipe Saver</h2>
      <form [formGroup]="recipeForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">Recipe Name</label>
          <input id="name" formControlName="name" type="text" required />
          <div *ngIf="recipeForm.get('name')?.invalid && recipeForm.get('name')?.touched" class="error">
            Recipe name is required.
          </div>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" formControlName="description" rows="3"></textarea>
        </div>

        <div formArrayName="ingredients" class="form-group">
          <label>Ingredients</label>
          <div *ngFor="let ingredient of ingredients.controls; let i = index" [formGroupName]="i" class="ingredient-row">
            <input formControlName="ingredient" placeholder="Ingredient" required />
            <button type="button" (click)="removeIngredient(i)" class="remove-btn" *ngIf="ingredients.length > 1">×</button>
          </div>
          <button type="button" (click)="addIngredient()" class="add-btn">+ Add Ingredient</button>
        </div>

        <div formArrayName="steps" class="form-group">
          <label>Steps</label>
          <div *ngFor="let step of steps.controls; let j = index" [formGroupName]="j" class="step-row">
            <input formControlName="step" placeholder="Step description" required />
            <button type="button" (click)="removeStep(j)" class="remove-btn" *ngIf="steps.length > 1">×</button>
          </div>
          <button type="button" (click)="addStep()" class="add-btn">+ Add Step</button>
        </div>

        <button type="submit" [disabled]="recipeForm.invalid" class="save-btn">Save Recipe</button>
      </form>

      <div *ngIf="savedRecipes.length > 0" class="saved-recipes">
        <h3>Saved Recipes</h3>
        <div *ngFor="let recipe of savedRecipes" class="recipe-card">
          <h4>{{ recipe.name }}</h4>
          <p>{{ recipe.description }}</p>
          <strong>Ingredients:</strong>
          <ul>
            <li *ngFor="let ing of recipe.ingredients">{{ ing.ingredient }}</li>
          </ul>
          <strong>Steps:</strong>
          <ol>
            <li *ngFor="let st of recipe.steps">{{ st.step }}</li>
          </ol>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .recipe-saver-container {
      max-width: 500px;
      margin: 30px auto;
      background: #fff;
      padding: 24px 28px;
      border-radius: 10px;
      box-shadow: 0 2px 16px rgba(0,0,0,0.08);
      font-family: Arial, sans-serif;
    }
    h2, h3 {
      text-align: center;
      color: #5b2e10;
    }
    .form-group {
      margin-bottom: 18px;
    }
    label {
      display: block;
      margin-bottom: 6px;
      font-weight: 600;
      color: #333;
    }
    input[type="text"], textarea {
      width: 100%;
      padding: 7px 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 15px;
      margin-bottom: 4px;
    }
    .ingredient-row, .step-row {
      display: flex;
      align-items: center;
      margin-bottom: 6px;
    }
    .ingredient-row input, .step-row input {
      flex: 1;
    }
    .remove-btn {
      background: #ff5252;
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 26px;
      height: 26px;
      margin-left: 8px;
      cursor: pointer;
      font-size: 18px;
      line-height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .add-btn {
      background: #6d4c23;
      color: #fff;
      border: none;
      border-radius: 4px;
      padding: 4px 14px;
      cursor: pointer;
      margin-top: 4px;
      font-size: 13px;
    }
    .save-btn {
      width: 100%;
      background: #3d7a33;
      color: #fff;
      border: none;
      border-radius: 5px;
      padding: 9px;
      font-size: 17px;
      font-weight: bold;
      cursor: pointer;
      margin-top: 12px;
      transition: background 0.2s;
    }
    .save-btn[disabled] {
      background: #bdbdbd;
      cursor: not-allowed;
    }
    .error {
      color: #c00;
      font-size: 12px;
    }
    .saved-recipes {
      margin-top: 36px;
    }
    .recipe-card {
      background: #f8f4ec;
      border-radius: 7px;
      padding: 16px 20px;
      margin-bottom: 18px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.03);
    }
    .recipe-card h4 {
      margin-top: 0;
      color: #6d4c23;
    }
    ul, ol {
      margin: 0 0 8px 18px;
    }
  `]
})
export class RecipeSaverComponent extends CommonExternalComponent {
  recipeForm: FormGroup;
  savedRecipes: any[] = [];

  constructor(private fb: FormBuilder) {
    super();
    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      ingredients: this.fb.array([this.createIngredient()]),
      steps: this.fb.array([this.createStep()])
    });
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get steps(): FormArray {
    return this.recipeForm.get('steps') as FormArray;
  }

  createIngredient(): FormGroup {
    return this.fb.group({
      ingredient: ['', Validators.required]
    });
  }

  addIngredient() {
    this.ingredients.push(this.createIngredient());
  }

  removeIngredient(index: number) {
    if (this.ingredients.length > 1) {
      this.ingredients.removeAt(index);
    }
  }

  createStep(): FormGroup {
    return this.fb.group({
      step: ['', Validators.required]
    });
  }

  addStep() {
    this.steps.push(this.createStep());
  }

  removeStep(index: number) {
    if (this.steps.length > 1) {
      this.steps.removeAt(index);
    }
  }

  onSubmit() {
    if (this.recipeForm.valid) {
      this.savedRecipes.unshift(this.recipeForm.value);
      this.recipeForm.reset();
      // Reset arrays to have one empty row each
      while (this.ingredients.length > 1) this.ingredients.removeAt(0);
      while (this.steps.length > 1) this.steps.removeAt(0);
      this.ingredients.at(0).reset();
      this.steps.at(0).reset();
    }
  }
}