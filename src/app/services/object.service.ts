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
      this.createObject("toilet", 40, 60, "/assets/images/toiler_01.png", true),
      this.createObject("Bad", 80, 170, "/assets/images/bad_01.png", false),
      this.createObject("Wasbak", 60, 40, "/assets/images/wasbak_01.png", true),
      this.createObject("Douche", 90, 90, "/assets/images/douche_01.png", true),
      this.createObject("realtoilet", 40, 60, '/assets/images/real-toilet.png', true),
      this.createObject("realBad", 80, 170, "/assets/images/real-bath.png", false),
      this.createObject("realWasbak", 40, 100, "/assets/images/real-wasbak.png", true),
      this.createObject("realDouche", 90, 90, "/assets/images/real-douche.png", true),
    ];
  }

  createObject(name: string, width: number, height: number, image: string, mustTouchWall: boolean, rotation: number = 0, x: number = 0, y: number = 0, firstLoad: boolean = false, unlocked: boolean = false): DrawableObject {
    return {
      name,
      width: width * 3,
      height: height * 3,
      image,
      mustTouchWall,
      rotation: rotation,
      x, 
      y,
      isColliding: false,
      firstLoadConfiguration: firstLoad,
      unlocked: unlocked,
    };
  }

  addObject(name: string, width: number, height: number, image: string, mustTouchWall: boolean, rotation: number = 0, x: number = 0, y: number = 0, firstLoad: boolean = false, unlocked: boolean = false): DrawableObject {
    const newObject = this.createObject(name, width, height, image, mustTouchWall, rotation, x, y, firstLoad, unlocked);
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
