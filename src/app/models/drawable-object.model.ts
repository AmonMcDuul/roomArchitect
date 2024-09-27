export interface DrawableObject {
    // id: number;
    name: string;
    width: number;
    height: number;
    image: string;
    x: number;
    y: number;
    mustTouchWall: boolean;
    rotated: boolean;
    rotation: number;
  }