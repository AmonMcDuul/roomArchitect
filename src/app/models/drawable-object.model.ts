export interface DrawableObject {
    name: string;
    width: number;
    height: number;
    image: string;
    x: number;
    y: number;
    rotated: boolean;
    rotation: number;
    isColliding: boolean;
    firstLoadConfiguration: boolean;
    unlocked: boolean;
  }