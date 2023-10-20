import { Component, OnInit } from '@angular/core';
import { MovementResponse, Hero } from '../../interfaces/index';
import { GameService } from '../../services/game.service';
import { MatDialog } from '@angular/material/dialog';
import { FinishModalComponent } from '../../components/finish-modal/finish-modal.component';
import { Router } from '@angular/router';

import { RotationService } from '../../services/rotation.service'

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements OnInit {
  hero!: Hero;
  feedbackMessages: string[] = [];
  showAllValue: boolean = false;

  constructor(
    private gameService: GameService,
    private dialog: MatDialog,
    private router: Router,
    private rotationService:RotationService
  ) { }

  ngOnInit(): void {
    this.hero = { orientation: 'None', hasGold: false, row: -1, col: -1, numOfArrows: this.gameService.numOfArrows };
  }

  receiveMovement(movementResponse: MovementResponse): void {
    this.rotationService.rotate(movementResponse)
    
    if (this.hero.orientation === 'None' && movementResponse.additionalAction !== 'exitEnter') {
      return;
    }

    if (movementResponse.additionalAction === 'exitEnter' && this.hero.orientation === 'None') {
      this.hero = this.gameService.getHeroIntoBoard(this.hero);
      return;
    }

    if (movementResponse.additionalAction === 'exitEnter' && this.hero.hasGold) {
      this.hero = this.gameService.getHeroOutOfBoard(this.hero);
      this.openDialog('¡Has ganado!');
      return;
    }

    if (!movementResponse.additionalAction) {
      this.hero.orientation = movementResponse.orientation;
      this.feedbackMessages = [];
      return;
    }

    if (movementResponse.additionalAction === 'goForward') {
      const { hero, feedbackMessages, isHeroAlive } = this.gameService.advanceHeroInBoard(this.hero);
      this.hero = hero;
      this.feedbackMessages = feedbackMessages;
      if (!isHeroAlive) {
        this.openDialog('¡Has muerto!');
      }
      return;
    }

    if (movementResponse.additionalAction === 'throwArrow' && this.hero.numOfArrows === 0) {
      this.feedbackMessages = ['No puedes lanzar flechas. No te quedan flechas'];
      return;
    }

    if (movementResponse.additionalAction === 'throwArrow' && !this.gameService.isWumpusAlive()) {
      this.feedbackMessages = ['No es necesario atacar. El Wumpus ya está muerto'];
      return;
    }

    if (movementResponse.additionalAction === 'throwArrow') {
      const feedbackMessages = this.gameService.heroAttacks(this.hero, movementResponse.orientation);
      this.feedbackMessages = feedbackMessages;
      this.hero.numOfArrows = this.hero.numOfArrows - 1;
      return;
    }
  }

  openDialog(message: string): void {
    const dialogRef = this.dialog.open(FinishModalComponent, { data: { message } });
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigateByUrl('/config');
    });
  }

  get canExitEnter(): boolean {
    return (this.hero.row === -1 && this.hero.col === -1) ||
      (this.hero.hasGold && this.hero.row === this.gameService.size - 1 && this.hero.col === 0);
  }

  changeShowAll(showAllValue: boolean): void {
    this.showAllValue = showAllValue;
  }
}
