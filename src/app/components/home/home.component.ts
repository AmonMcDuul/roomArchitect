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
  Math = Math
  gridX = 10;
  gridY = 10;
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

  savedConfigurations: any[] = [];
  newSaveName: string = "";

  showGridSize: boolean = false;
  showCreateObject: boolean = false;
  showPredefinedObjects: boolean = false;
  showAvailableObjects: boolean = false;
  showResize: boolean = false;
  showConfigurations: boolean = false;

  toggleViewObjects: boolean = false;

  isLoadedHack: boolean = false;

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
    this.loadSavedConfigurations();
  }

  toggleClear() {
    this.items.forEach(item => {
      this.removeObject(item);
    });
    this.isLoadedHack = false;
  }

  toggleGridSize() {
    this.showGridSize = !this.showGridSize;
    if (this.showGridSize) {
      this.resetOtherOptions('gridSize');
    }
  }
  
  toggleCreateObject() {
    this.showCreateObject = !this.showCreateObject;
    if (this.showCreateObject) {
      this.resetOtherOptions('createObject');
    }
  }
  
  togglePredefinedObjects() {
    this.showPredefinedObjects = !this.showPredefinedObjects;
    if (this.showPredefinedObjects) {
      this.resetOtherOptions('predefinedObjects');
    }
  }
  
  toggleAvailableObjects() {
    this.showAvailableObjects = !this.showAvailableObjects;
    if (this.showAvailableObjects) {
      this.resetOtherOptions('availableObjects');
    }
  }
  
  toggleResize() {
    this.showResize = !this.showResize;
    if (this.showResize) {
      this.resetOtherOptions('resize');
    }
  }
  
  toggleConfigurations() {
    this.showConfigurations = !this.showConfigurations;
    if (this.showConfigurations) {
      this.resetOtherOptions('configurations');
    }
  }
  
  resetOtherOptions(activeOption: string) {
    this.showGridSize = activeOption === 'gridSize';
    this.showCreateObject = activeOption === 'createObject';
    this.showPredefinedObjects = activeOption === 'predefinedObjects';
    this.showAvailableObjects = activeOption === 'availableObjects';
    this.showResize = activeOption === 'resize';
    this.showConfigurations = activeOption === 'configurations';
  }
  
  setViewObjects(){
    this.toggleViewObjects = !this.toggleViewObjects;
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

  rotateObjectFreely() {
    if (this.selectedItem) {
      const rotation = this.selectedItem.rotation % 360;
      this.selectedItem.rotation = rotation;
    }
  }

  removeObject(object: DrawableObject): void {
    this.objectService.removeObject(object.name, object.x);
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
        return true;
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
    item.firstLoadConfiguration = false;
    const { x, y } = event.source.getFreeDragPosition();
    item.x = x;
    item.y = y;
    if(!this.isLoadedHack){
      this.detectCollisions();
    }
  }

  saveConfiguration(configName: string): void {
    const configuration = {
      name: configName, 
      gridX: this.gridX,
      gridY: this.gridY,
      items: this.items.map(item => ({
        name: item.name,
        width: item.width,
        height: item.height,
        x: item.x,
        y: item.y,
        image: item.image,
        rotation: item.rotation,
        mustTouchWall: item.mustTouchWall,
      }))
    };
    const savedConfigs = JSON.parse(localStorage.getItem('savedConfigurations') || '[]');
    savedConfigs.push(configuration);
    localStorage.setItem('savedConfigurations', JSON.stringify(savedConfigs));
  }
  
  loadConfiguration(configName: string): void {
    const savedConfigs = JSON.parse(localStorage.getItem('savedConfigurations') || '[]');
    const configToLoad = savedConfigs.find((config: { name: string; }) => config.name === configName);
  
    if (configToLoad) {
      this.gridX = configToLoad.gridX;
      this.gridY = configToLoad.gridY;
  
      this.items = configToLoad.items.map((item: { name: string; width: number; height: number; x: number; y: number; image: string; rotation: number; mustTouchWall: boolean }) => ({
        name: item.name,
        width: item.width,
        height: item.height,
        x: item.x, 
        y: item.y, 
        image: item.image,
        rotation: item.rotation,
        mustTouchWall: item.mustTouchWall,
        firstLoadConfiguration: true
      }));
      
      this.items.forEach(item => {
        this.objectService.addObject(item.name, item.width / (this.gridCellSize / 10), item.height / (this.gridCellSize / 10), item.image, item.mustTouchWall, item.x, item.y, true);
      });
      this.items = this.objectService.getObjects();
      this.updateGrid();
      this.isLoadedHack = true;
    }
  }
  
  
  deleteConfiguration(configName: string): void {
    let savedConfigs = JSON.parse(localStorage.getItem('savedConfigurations') || '[]');
    savedConfigs = savedConfigs.filter((config: { name: string; }) => config.name !== configName);
    localStorage.setItem('savedConfigurations', JSON.stringify(savedConfigs));
    this.loadSavedConfigurations();
  }
  
  loadSavedConfigurations(): void {
    this.savedConfigurations = JSON.parse(localStorage.getItem('savedConfigurations') || '[]');
  }
}