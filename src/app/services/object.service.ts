import { Injectable } from '@angular/core';
import { DrawableObject } from '../models/drawable-object.model';

@Injectable({
  providedIn: 'root',
})
export class ObjectService {
  private objects: DrawableObject[] = [];

  constructor() {
    // this.initializeDefaultObjects();
  }

  initializeDefaultObjects(): void {
    this.addObject("toilet", 90, 60, true);
    this.addObject("Bad",170, 80, false);
    this.addObject("Wasbak",60, 40, true);
  }

  addObject(name: string, width: number, height: number, mustTouchWall: boolean): DrawableObject {
    const newObject: DrawableObject = {
      name,
      width: width * 3,
      height: height * 3,
      mustTouchWall,
    };
    this.objects.push(newObject);
    return newObject;
  }

  getObjects(): DrawableObject[] {
    return this.objects;
  }

  removeObject(name: string): void {
    this.objects = this.objects.filter((obj) => obj.name !== name);
  }
}
