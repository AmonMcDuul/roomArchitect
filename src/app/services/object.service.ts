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
      this.createObject("toilet", 40, 60, "assets/images/toilet_new.png"),
      this.createObject("Bad", 75, 170, "assets/images/bad_new.png"),
      this.createObject("Wasbak", 60, 40, "assets/images/wasbak_new.png"),
      this.createObject("Wasbak_lang", 100, 40, "assets/images/wasbak_lang_new.png"),
      this.createObject("Douche", 90, 90, "assets/images/douche_new.png"),
      this.createObject("muur_new", 80, 30, "assets/images/muur_new.png"),
      this.createObject("divers", 50, 50, "assets/images/divers_new.png"),
      this.createObject("deur rechts", 80, 80, "assets/images/deur_new.png"),
    ];
  }

  createObject(name: string, width: number, height: number, image: string, rotation: number = 0, x: number = 0, y: number = 0, firstLoad: boolean = false, unlocked: boolean = false): DrawableObject {
    return {
      name,
      width: width * 3,
      height: height * 3,
      image,
      rotated: false,
      rotation: rotation,
      x, 
      y,
      isColliding: false,
      firstLoadConfiguration: firstLoad,
      unlocked: unlocked,
    };
  }

  addObject(name: string, width: number, height: number, image: string, rotation: number = 0, x: number = 0, y: number = 0, firstLoad: boolean = false, unlocked: boolean = false): DrawableObject {
    const newObject = this.createObject(name, width, height, image, rotation, x, y, firstLoad, unlocked);
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
