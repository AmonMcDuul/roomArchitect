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
    this.addObject("toilet", 90, 60, "", true);
    // this.addObject("Bad", 80, 170, "", false);
    this.addObject("Wasbak",60, 40, "", true);
    this.addObject("Douche",90, 90, "", true);
    // this.addObject("toilet", 90, 60, "https://i.postimg.cc/KYhPzTCM/toilet.png", true);
    this.addObject("Bad", 80, 170, "https://i.postimg.cc/Xv3YjTk1/Bad-01.png", false);
    // this.addObject("Wasbak",60, 40, "https://i.postimg.cc/KjGQYTkN/wasbak.png", true);
    // this.addObject("Douche",90, 90, "https://i.postimg.cc/5tXhxhd0/douche.png", true);
  }

  addObject(name: string, width: number, height: number, image: string, mustTouchWall: boolean): DrawableObject {
    const newObject: DrawableObject = {
      name,
      width: width * 3,
      height: height * 3,
      image,
      mustTouchWall,
      rotated: false,
      rotation: 0,
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
