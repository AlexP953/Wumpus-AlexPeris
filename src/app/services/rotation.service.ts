import { Injectable } from '@angular/core';
import { Orientation } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class RotationService {

  constructor() { }

  orientation: Orientation = 'E'

  rotate(text:any){
    this.orientation = text.orientation
  }

  getRotation(): string {
    switch (this.orientation) {
      case 'E':
        return 'rotate(0deg)';
      case 'S':
        return 'rotate(90deg)';
      case 'W':
        return 'scaleX(-1)';
      case 'N':
        return 'rotate(-90deg)';
      default:
        return 'rotate(0deg)'; 
    }
  }
}
