import { Injectable } from "@angular/core";
import { DrawableObject } from "../models/drawable-object.model";

@Injectable({
  providedIn: 'root',
})
export class ObjectService {
  private objects: DrawableObject[] = [];
  private predefinedObjects: DrawableObject[] = [];

  constructor() {
    this.initializeDefaultObjects();
  }

  initializeDefaultObjects(): void {
    this.predefinedObjects = [
      this.createObject("toilet", 40, 60, "https://i.postimg.cc/vT8jQKy9/toiler-01.png", true),
      this.createObject("Bad", 80, 170, "https://i.postimg.cc/Xv3YjTk1/Bad-01.png", false),
      this.createObject("Wasbak", 60, 40, "https://i.postimg.cc/sf0KQx9b/wasbak-01.png", true),
      this.createObject("Douche", 90, 90, "https://i.postimg.cc/6p6QkWF5/douche-01.png", true),
      this.createObject("realtoilet", 40, 60, 'https://i.postimg.cc/gjSjF4Dk/real-toilet.png', true),
      this.createObject("realBad", 80, 170, "https://i.postimg.cc/V6wdjJv1/real-bath.png", false),
      this.createObject("realWasbak", 40, 100, "https://i.postimg.cc/pVqpFXHb/real-wasbak.png", true),
      this.createObject("realDouche", 90, 90, "https://i.postimg.cc/ZnKnMX6M/real-douche.png", true),
    ];
  }

  createObject(name: string, width: number, height: number, image: string, mustTouchWall: boolean, x: number = 0, y: number = 0): DrawableObject {
    return {
      name,
      width: width * 3,
      height: height * 3,
      image,
      mustTouchWall,
      rotated: false,
      rotation: 0,
      x, 
      y,
      isColliding: false
    };
  }

  addObject(name: string, width: number, height: number, image: string, mustTouchWall: boolean, x: number = 0, y: number = 0): DrawableObject {
    const newObject = this.createObject(name, width, height, image, mustTouchWall, x, y);
    this.objects.push(newObject);
    return newObject;
  }

  getObjects(): DrawableObject[] {
    return this.objects;
  }

  getPredefinedObjects(): DrawableObject[] {
    return this.predefinedObjects;
  }

  removeObject(name: string, x: number): void {
    // this.objects = this.objects.filter((obj) => obj.name !== name && obj.x !== x);
    this.objects = this.objects.filter((obj) => obj.name !== name || obj.x !== x);
  }
}
