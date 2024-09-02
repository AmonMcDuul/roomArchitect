import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CellComponent } from '../cell/cell.component';
import { ObjectService } from '../../services/object.service';
import { DrawableObject } from '../../models/drawable-object.model';
import { ObjectFormComponent } from '../object-form/object-form.component';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CommonModule, CellComponent, ObjectFormComponent, DragDropModule],
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  gridWidth = 10;
  gridHeight = 14;
  grid: number[][] = [];
  objects: DrawableObject[] = [];
  selectedObject: DrawableObject | null = null;
  errorMessage: string = '';

  constructor(public objectService: ObjectService) {}

  ngOnInit(): void {
    this.generateGrid();
    this.objects = this.objectService.getObjects();
    this.updateGrid(); 
  }

  generateGrid(): void {
    this.grid = Array.from({ length: this.gridHeight }, () =>
      Array(this.gridWidth).fill(0)
    );
  }

  onCellClick(row: number, col: number): void {
    if (this.selectedObject) {
      if (this.canPlaceObject(this.selectedObject, row, col)) {
        this.objectService.updateObjectPosition(this.selectedObject.id, col, row);
        this.updateGrid();
        this.selectedObject = null;
        this.errorMessage = '';
      } else {
        this.errorMessage = 'Cannot place object here.';
      }
    } else {
      this.grid[row][col] = this.grid[row][col] === 0 ? 1 : 0; 
    }
  }

  selectObject(object: DrawableObject): void {
    this.selectedObject = object;
  }

  getObjectAt(row: number, col: number): DrawableObject | null {
    return this.objects.find(
      (obj) =>
        obj.x !== null &&
        obj.y !== null &&
        row >= obj.y &&
        row < obj.y + obj.height &&
        col >= obj.x &&
        col < obj.x + obj.width
    ) || null;
  }

  canPlaceObject(object: DrawableObject, row: number, col: number): boolean {
    console.log(`Checking if object can be placed at row: ${row}, col: ${col}`);
    console.log(`Object dimensions: width = ${object.width}, height = ${object.height}`);

    if (row + object.height > this.gridHeight || col + object.width > this.gridWidth) {
        console.log('Cannot place object: Out of bounds');
        return false;
    }

    // // Check for overlap
    // for (let y = row; y < row + object.height; y++) {
    //     for (let x = col; x < col + object.width; x++) {
    //         if (this.getObjectAt(y, x)) {
    //             console.log('Cannot place object: Overlap detected');
    //             return false;
    //         }
    //     }
    // }

    if (object.mustTouchWall) {
        if (row > 0 && col > 0 && row + object.height < this.gridHeight && col + object.width < this.gridWidth) {
            console.log('Cannot place object: Must touch wall condition failed');
            return false;
        }
    }

    console.log('Object can be placed');
    return true;
}


  removeObject(object: DrawableObject): void {
    this.objectService.removeObject(object.id);
    this.objects = this.objectService.getObjects();
    this.updateGrid();
  }

  onDrop(event: CdkDragDrop<DrawableObject[]>): void {
    const prevIndex = this.objects.findIndex((d) => d === event.item.data);

    const dropPoint = event.event as MouseEvent;
    const dropX = dropPoint.clientX;
    const dropY = dropPoint.clientY;

    const gridElement = event.container.element.nativeElement;
    const gridRect = gridElement.getBoundingClientRect();

    const relativeX = dropX - gridRect.left;
    const relativeY = dropY - gridRect.top;

    const colIndex = Math.floor(relativeX / (gridRect.width / this.gridWidth));
    const rowIndex = Math.floor(relativeY / (gridRect.height / this.gridHeight));

    console.log(`Calculated cell row: ${rowIndex}, col: ${colIndex}`);

    if (this.canPlaceObject(event.item.data, rowIndex, colIndex)) {
        console.log('Placing object');
        this.objects[prevIndex].x = colIndex;
        this.objects[prevIndex].y = rowIndex;
        this.updateGrid();
        this.errorMessage = '';
    } else {
        this.errorMessage = 'Cannot place object here.';
        console.log(this.errorMessage);
    }
}


  updateGrid(): void {
    this.generateGrid(); 
    this.objects.forEach((obj) => {
      for (let y = obj.y; y < obj.y + obj.height; y++) {
        for (let x = obj.x; x < obj.x + obj.width; x++) {
          this.grid[y][x] = 1; 
        }
      }
    });
  }
}
