import { Component } from '@angular/core';
import { CdkDrag, CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DrawableObject } from '../../models/drawable-object.model';
import { ObjectService } from '../../services/object.service';
import { GridCell } from '../../models/gridCell.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CdkDrag, FormsModule, ReactiveFormsModule, DragDropModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  gridX = 5;
  gridY = 5;
  gridCellSize = 30;
  gridColumns: string = "";
  gridRows: string = "";
  gridCells: GridCell[] = [];
  boundaryWidth: number = 0;
  boundaryHeight: number = 0;
  resizing: boolean = false;
  currentItem: any = null;
  selectedItem: any = null;
  inputWidthCm: number = 0; 
  inputHeightCm: number = 0; 

  items: DrawableObject[] = [];
  predefinedItems: DrawableObject[] = [];

  objectForm: FormGroup;
  isMouseDown = false;

  constructor(private fb: FormBuilder, private objectService: ObjectService) {
    this.updateGridSize(20, 26);
    this.objectForm = this.fb.group({
      name: ["", [Validators.required]],
      width: [1, [Validators.required, Validators.min(1)]],
      height: [1, [Validators.required, Validators.min(1)]],
      image: [""],
      mustTouchWall: [false],
    });
  }

  ngOnInit() {
    this.objectService.initializeDefaultObjects();
    this.items = this.objectService.getObjects();
    this.predefinedItems = this.objectService.getPredefinedObjects();
  }

  addPredefinedItem(selectedPredefinedItem: DrawableObject) {
    if (selectedPredefinedItem) {
      const x = 0; 
      const y = 0;
      this.objectService.addObject(
        selectedPredefinedItem.name,
        selectedPredefinedItem.width / 3,
        selectedPredefinedItem.height / 3,
        selectedPredefinedItem.image,
        selectedPredefinedItem.mustTouchWall,
        x,
        y
      );
      this.items = this.objectService.getObjects();
    }
  }

  updateGrid() {
    this.boundaryWidth = this.gridX * this.gridCellSize;
    this.boundaryHeight = this.gridY * this.gridCellSize;
    this.gridCells = Array(this.gridX * this.gridY).fill(null).map((_, i) => {
      const row = Math.floor(i / this.gridX);
      const col = i % this.gridX;
      return {
        isClicked: false,
        x: col * this.gridCellSize,
        y: row * this.gridCellSize,
        width: this.gridCellSize,
        height: this.gridCellSize
      };
    });
  }

  updateGridSize(x: number, y: number) {
    this.gridX = x;
    this.gridY = y;
    this.updateGrid();
  }

  selectItem(item: DrawableObject) {
    this.selectedItem = item;
    this.inputWidthCm = item.width / (this.gridCellSize / 10);
    this.inputHeightCm = item.height / (this.gridCellSize / 10);
  }

  updateSizeInCm() {
    if (this.selectedItem) {
      this.selectedItem.width = this.inputWidthCm * (this.gridCellSize / 10);
      this.selectedItem.height = this.inputHeightCm * (this.gridCellSize / 10);
    }
  }

  rotateObject() {
    if (this.selectedItem) {
      var temp = this.selectedItem.width;
      this.selectedItem.width = this.selectedItem.height;
      this.selectedItem.height = temp;
      this.selectedItem.rotation = (this.selectedItem.rotation + 90) % 360;    
    }
  }

  removeObject(object: DrawableObject): void {
    this.objectService.removeObject(object.name);
    this.items = this.objectService.getObjects();
  }

  onSubmit(): void {
    if (this.objectForm.valid) {
      const { name, width, height, image, mustTouchWall } = this.objectForm.value;
      this.objectService.addObject(name, width, height, image, mustTouchWall);
      this.objectForm.reset({ width: 1, height: 1, mustTouchWall: false });
    }
  }

  onMouseDown(index: number): void {
    this.isMouseDown = true;
    this.toggleCellState(index);
  }

  onMouseUp(): void {
    this.isMouseDown = false;
  }

  onMouseOver(index: number): void {
    if (this.isMouseDown) {
      this.toggleCellState(index);
    }
  }

  toggleCellState(index: number): void {
    this.gridCells[index].isClicked = !this.gridCells[index].isClicked;
  }

  checkCollision(obj1: DrawableObject, obj2: DrawableObject): boolean {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
  }

  checkCollisionWithGridCells(obj: DrawableObject): boolean {
    for (let cell of this.gridCells) {
      if (cell.isClicked &&
          obj.x < cell.x + cell.width &&
          obj.x + obj.width > cell.x &&
          obj.y < cell.y + cell.height &&
          obj.y + obj.height > cell.y) {
        return true; // Collision detected
      }
    }
    return false;
  }

  detectCollisions() {
    for (let i = 0; i < this.items.length; i++) {
        const obj1 = this.items[i];
        obj1.isColliding = false; 
        
        for (let j = 0; j < this.items.length; j++) {
            if (i === j) continue; 
            
            const obj2 = this.items[j];
            if (this.checkCollision(obj1, obj2)) {
                obj1.isColliding = true;
                obj2.isColliding = true;
            }
        }
        if (this.checkCollisionWithGridCells(obj1)) {
          obj1.isColliding = true; 
        }
    }
  }
  
  onDrag(event: any, item: DrawableObject) {
    const { x, y } = event.source.getFreeDragPosition();
    item.x = x;
    item.y = y;
    this.detectCollisions();
  }
}