import { Component, viewChild } from '@angular/core';
import { CdkDrag, CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DrawableObject } from '../../models/drawable-object.model';
import { ObjectService } from '../../services/object.service';
import { GridCell } from '../../models/gridCell.model';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';

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
  showNothing: boolean = false;

  toggleViewObjects: boolean = false;
  viewObjects = true;
  isLoadedHack: boolean = false;

  objectForm: FormGroup;
  isMouseDown = false;

  constructor(private fb: FormBuilder, private objectService: ObjectService) {
    this.updateGridSize(20, 26);
    this.objectForm = this.fb.group({
      name: ["", [Validators.required]],
      width: [50, [Validators.required, Validators.min(1)]],
      height: [50, [Validators.required, Validators.min(1)]],
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
    this.gridCells.forEach(cell => {
      cell.isClicked = false;
    })
    this.resetOtherOptions('clear');
    this.selectedItem = null;
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
    this.showNothing = activeOption === 'clear';
    this.showGridSize = activeOption === 'gridSize';
    this.showCreateObject = activeOption === 'createObject';
    this.showPredefinedObjects = activeOption === 'predefinedObjects';
    this.showAvailableObjects = activeOption === 'availableObjects';
    this.showResize = activeOption === 'resize';
    this.showConfigurations = activeOption === 'configurations';
  }
  
  setViewObjects(){
    this.toggleViewObjects = !this.toggleViewObjects;
    this.viewObjects = !this.viewObjects;
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
      this.selectedItem.rotated = !this.selectedItem.rotated;
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

  unlockObject() {
    if (this.selectedItem) {
      if(this.selectedItem.rotated){
        this.selectedItem.rotated = false;
        var temp = this.selectedItem.width;
        this.selectedItem.width = this.selectedItem.height;
        this.selectedItem.height = temp;
      }
      this.selectedItem.rotation = 0;  
      this.selectedItem.unlocked = !this.selectedItem.unlocked;
    }
  }

  removeObject(object: DrawableObject): void {
    this.objectService.removeObject(object.name, object.x);
    this.items = this.objectService.getObjects();
    if (this.selectedItem == object){
      this.selectedItem = null;
    }
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

  onDrag(event: any, item: DrawableObject) {
    const { x, y } = event.source.getFreeDragPosition();
    item.x = x;
    item.y = y;
    item.firstLoadConfiguration = false;
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
        unlocked: item.unlocked,
      }))
    };
    const savedConfigs = JSON.parse(localStorage.getItem('savedConfigurations') || '[]');
    savedConfigs.push(configuration);
    localStorage.setItem('savedConfigurations', JSON.stringify(savedConfigs));
    this.loadSavedConfigurations();
  }
  
  loadConfiguration(configName: string): void {
    this.toggleClear();
    const savedConfigs = JSON.parse(localStorage.getItem('savedConfigurations') || '[]');
    const configToLoad = savedConfigs.find((config: { name: string; }) => config.name === configName);
  
    if (configToLoad) {
      this.gridX = configToLoad.gridX;
      this.gridY = configToLoad.gridY;
  
      const itemsToLoad = configToLoad.items.map((item: { name: string; width: number; height: number; x: number; y: number; image: string; rotation: number; mustTouchWall: boolean, unlocked: boolean }) => ({
        name: item.name,
        width: item.width,
        height: item.height,
        x: item.x, 
        y: item.y, 
        image: item.image,
        rotation: item.rotation,
        mustTouchWall: item.mustTouchWall,
        firstLoadConfiguration: true,
        unlocked: item.unlocked,
      }));
      
      itemsToLoad.forEach((item: { name: string; width: number; height: number; image: string; mustTouchWall: boolean; rotation: number | undefined; x: number | undefined; y: number | undefined; unlocked: boolean | undefined; }) => {
        this.objectService.addObject(item.name, item.width / (this.gridCellSize / 10), item.height / (this.gridCellSize / 10), item.image, item.mustTouchWall, item.rotation, item.x, item.y, true, item.unlocked);
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

  captureGridAsImage() {
    const gridElement = document.getElementById('grid-container');
    if (gridElement) {
      html2canvas(gridElement).then((canvas: { toDataURL: (arg0: string) => any; }) => {
        const imgData = canvas.toDataURL('image/png');
        this.exportToPDF(imgData);
      });
    }
  }

  exportToPDF(imgData: string) {
    const pdf = new jsPDF('p', 'mm', 'a4'); 
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    pdf.save('grid-export.pdf');
  }
}