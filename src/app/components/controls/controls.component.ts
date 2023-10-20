import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Action, Orientation, MovementResponse } from '../../interfaces/index';


@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit{
  constructor() { }

  ngOnInit(): void {
    this.doAction('exitEnter');
  }
  
  @Input() canExitEnter = false;
  @Input() currentDirection: Orientation = 'N';
  @Input() numOfArrows: number = 5;
  @Input() showAllValue: boolean = false;
  @Output() movementResponseEmmited = new EventEmitter<MovementResponse>();
  @Output() showAllChange = new EventEmitter<boolean>();



  doAction(action: Action): void {
    const additionalActions = ['throwArrow', 'goForward'];
    if (additionalActions.includes(action)) {
      this.movementResponseEmmited.emit(
        {
          orientation: this.currentDirection,
          additionalAction: action
        });
      return;
    }

    if (action === 'exitEnter') {
      const orientation = (this.currentDirection == 'None') ? 'N' : 'S';
      this.movementResponseEmmited.emit(
        {
          orientation,
          additionalAction: 'exitEnter'
        });
      return;
    }

    this.manageTurns(action);
  }

  private manageTurns(action: Action): void {
    const availablePoints: Orientation[] = ['N', 'E', 'S', 'W'];
    const indexElem = availablePoints.findIndex((value: string) => value === this.currentDirection); 1

    if (action === 'turnRight') {
      const orientation = (indexElem === availablePoints.length - 1) ? 'N' : availablePoints[indexElem + 1];
      this.movementResponseEmmited.emit({ orientation });
      return;
    }

    if (action === 'turnLeft') {
      const orientation = (indexElem === 0) ? 'W' : availablePoints[indexElem - 1];
      this.movementResponseEmmited.emit({ orientation });
      return;
  }

}

  toggleShow(): void {
    this.showAllValue = !this.showAllValue;
    this.showAllChange.emit(this.showAllValue);
  }

}
