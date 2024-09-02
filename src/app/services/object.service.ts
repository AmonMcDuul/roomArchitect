import { Injectable } from '@angular/core';
import { DrawableObject } from '../models/drawable-object.model';

@Injectable({
  providedIn: 'root',
})
export class ObjectService {
  private objects: DrawableObject[] = [];
  private nextId = 1;

  constructor() {
    this.initializeDefaultObjects();
  }

  private initializeDefaultObjects(): void {
    // this.addObject(3, 2, true);
    // this.addObject(2, 2, false);
    // this.addObject(1, 4, true);
  }

  addObject(width: number, height: number, mustTouchWall: boolean): DrawableObject {
    const newObject: DrawableObject = {
      id: this.nextId++,
      width,
      height,
      x: 0,
      y: 0,
      mustTouchWall,
    };
    this.objects.push(newObject);
    return newObject;
  }

  updateObjectPosition(id: number, x: number, y: number): void {
    const object = this.objects.find((obj) => obj.id === id);
    if (object) {
      object.x = x;
      object.y = y;
    }
  }

  getObjects(): DrawableObject[] {
    return this.objects;
  }

  removeObject(id: number): void {
    this.objects = this.objects.filter((obj) => obj.id !== id);
  }
}
