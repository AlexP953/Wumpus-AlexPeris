import { Injectable } from '@angular/core';

import { Cell, Hero, HeroWithFeedBack, Enemy, Orientation } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  size: number = 0;
  wells: number = 0;
  numOfArrows: number = 0;
  board: Cell[][] = [];

  constructor() { }

  createGame(size: number, wells: number, numOfArrows: number): void {
    this.size = size;
    this.wells = wells;
    this.numOfArrows = numOfArrows;
    this.createBoard(size);
    this.putCharactersInBoard({ type: 'monster', isAlive: true }, 1);
    this.putCharactersInBoard({ type: 'well', isAlive: true }, this.wells);
    this.putCharactersInBoard('gold', 1);
  }

  private createBoard(size: number): void {
    this.board = [];

    for (let rowIndex = 0; rowIndex < size; rowIndex++) {
      const row: Cell[] = [];
      for (let colIndex = 0; colIndex < size; colIndex++) {
        row.push({
          hasHero: false,
          hasGold: false,
          hasBeenVisited: false,
        });
      }
      this.board.push(row);
    }
  }

  private putCharactersInBoard(characterType: Enemy | 'gold', numOfCharacters: number): void {
    let characterIsInBoard = false;
    let requiredCharacters = numOfCharacters;
    do {
      characterIsInBoard = this.putCharacterInBoard(characterType);
      if (characterIsInBoard) {
        requiredCharacters--;
      }
    } while (requiredCharacters > 0);
  }

  private putCharacterInBoard(character: Enemy | 'gold'): boolean {
    const row = Math.floor(Math.random() * (this.size - 1));
    const col = Math.floor(Math.random() * (this.size - 1));
    const cell = this.board[row][col];

    if ((row === this.size - 1) && (col === 0)) {
      return false;
    }

    if (character === 'gold' && !cell.enemies) {
      this.board[row][col].hasGold = true;
      return true;
    }

    if (!cell.enemies && !cell.hasGold) {
      this.board[row][col].enemies = character as Enemy;
      return true;
    }

    return false;
  }

  getBoard(): Cell[][] {
    return this.board;
  }

  getHeroIntoBoard(hero: Hero): Hero {
    const maxSize = this.size - 1;
    hero.orientation = 'N';
    hero.row = maxSize;
    hero.col = 0;

    this.board[maxSize][0].hasHero = true;
    this.board[maxSize][0].hasBeenVisited = true;
    return hero;
  }

  getHeroOutOfBoard(hero: Hero): Hero {
    hero.orientation = 'N';

    this.board[hero.row][hero.col].hasHero = false;

    hero.row = -1;
    hero.col = -1;

    return hero;
  }

  advanceHeroInBoard(heroParam: Hero): HeroWithFeedBack {
    let heroWithFeedback: HeroWithFeedBack = {
      hero: { ...heroParam },
      feedbackMessages: [],
      isHeroAlive: true
    };
    const cantAdvance = 'No puedo avanzar. Hay un muro';

    switch (heroParam.orientation) {
      case 'N':
        const prevRow = heroParam.row - 1;
        if (prevRow >= 0) {
          heroWithFeedback.hero.row = prevRow;
          heroWithFeedback = this.updateHeroPositionInBoard(heroParam.row, heroParam.col, heroWithFeedback.hero);
        } else {
          heroWithFeedback.feedbackMessages.push(cantAdvance);
        }
        break;
      case 'S':
        const nextRow = heroParam.row + 1;
        if (nextRow < this.size) {
          heroWithFeedback.hero.row = nextRow;
          heroWithFeedback = this.updateHeroPositionInBoard(heroParam.row, heroParam.col, heroWithFeedback.hero);
        } else {
          heroWithFeedback.feedbackMessages.push(cantAdvance);
        }
        break;
      case 'E':
        const nextCol = heroParam.col + 1;
        if (nextCol < this.size) {
          heroWithFeedback.hero.col = nextCol;
          heroWithFeedback = this.updateHeroPositionInBoard(heroParam.row, heroParam.col, heroWithFeedback.hero);
        } else {
          heroWithFeedback.feedbackMessages.push(cantAdvance);
        }
        break;
      case 'W':
        const prevCol = heroParam.col - 1;
        if (prevCol >= 0) {
          heroWithFeedback.hero.col = prevCol;
          heroWithFeedback = this.updateHeroPositionInBoard(heroParam.row, heroParam.col, heroWithFeedback.hero);
        } else {
          heroWithFeedback.feedbackMessages.push(cantAdvance);
        }
        break;
      default:
        throw new Error('Movement not defined');
    }

    return heroWithFeedback;
  }

  private updateHeroPositionInBoard(currehtRow: number, currentCol: number, newHeroPosition: Hero): HeroWithFeedBack {
    this.board[currehtRow][currentCol].hasHero = false;
    this.board[newHeroPosition.row][newHeroPosition.col].hasHero = true;
    this.board[newHeroPosition.row][newHeroPosition.col].hasBeenVisited = true;
    return this.getMovementReaction({ ...newHeroPosition });
  }

  private getMovementReaction(heroParam: Hero): HeroWithFeedBack {
    const hero = { ...heroParam };

    const boardEnemy = this.board[hero.row][hero.col].enemies;

    // Actions that implies death of hero
    if (boardEnemy?.type === 'monster') {
      const messages = ['Puedo percibir al Wumpus'];

      if (boardEnemy?.isAlive) {
        messages.push('Me ha matado el Wumpus');
        return this.heroDies(hero, messages);
      }

      return { hero, feedbackMessages: messages, isHeroAlive: true };
    }

    if (boardEnemy?.type === 'well') {
      const messages = ['He caído a un pozo']
      return this.heroDies(hero, messages);
    }

    // get hero perceptions if any    
    return this.getHeroPerceptions(hero);
  }

  heroDies(hero: Hero, messages: string[]): HeroWithFeedBack {
    return { hero, feedbackMessages: messages, isHeroAlive: false };
  }

  getHeroPerceptions(heroParam: Hero): HeroWithFeedBack {
    const isHeroAlive = true;
    const feedbackMessages: string[] = [];
    const hero: Hero = { ...heroParam };

    const currenCell: Cell = this.board[hero.row][hero.col];

    if (currenCell.hasGold) {
      feedbackMessages.push('Puedo percibir el brillo del oro');
      hero.hasGold = true;
    }

    const windMessage = 'Puedo percibir la brisa de un pozo';
    const smellMessage = 'Puedo percibir el hedor de la bestia';

    const validAdjentPositions = this.getValidAdjacentsPositions(hero);

    validAdjentPositions.forEach((adjacentPosition: number[]) => {
      const adjacentCell: Cell = this.board[adjacentPosition[0]][adjacentPosition[1]];
      const enemies = adjacentCell.enemies;

      if (enemies?.type === 'monster' && !feedbackMessages.includes(smellMessage)) {
        feedbackMessages.push(smellMessage);
      }

      if (enemies?.type === 'well' && !feedbackMessages.includes(windMessage)) {
        feedbackMessages.push(windMessage);
      }
    });

    return { hero, feedbackMessages, isHeroAlive };
  }

  getValidAdjacentsPositions(hero: Hero): number[][] {
    const coordsOperation = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    const validAdjacentPositions: number[][] = [];
    coordsOperation.forEach((coordOperation: number[]) => {
      const newCurrentRow = hero.row + coordOperation[0];
      const newCurrentCol = hero.col + coordOperation[1];

      if ((newCurrentRow >= 0 && newCurrentRow < this.size) && (newCurrentCol >= 0 && newCurrentCol < this.size)) {
        validAdjacentPositions.push([newCurrentRow, newCurrentCol])
      }
    });
    return validAdjacentPositions;
  }

  heroAttacks(hero: Hero, Orientation: Orientation): string[] {
    switch (Orientation) {
      case 'N':
        for (let row = hero.row; row >= 0; row--) {
          if (this.verifyIfWumpusHasDiedInCell(row, hero.col)) {
            return ['Has lanzado una flecha. Escuchas el grito del Wumpus.. Ha muerto'];
          }
        }
        break;

      case 'S':
        for (let row = hero.row; row < this.size; row++) {
          if (this.verifyIfWumpusHasDiedInCell(row, hero.col)) {
            return ['Has lanzado una flecha. Escuchas el grito del Wumpus.. Ha muerto'];
          }
        }
        break;

      case 'E':
        for (let col = hero.col; col < this.size; col++) {
          if (this.verifyIfWumpusHasDiedInCell(hero.row, col)) {
            return ['Has lanzado una flecha. Escuchas el grito del Wumpus.. Ha muerto'];
          }
        }
        break;

      case 'W':
        for (let col = hero.col; col >= 0; col--) {
          if (this.verifyIfWumpusHasDiedInCell(hero.row, col)) {
            return ['Has lanzado una flecha. Escuchas el grito del Wumpus.. Ha muerto'];
          }
        }
        break;

      default:
        throw new Error('Orientation is not defined');
    }

    return ['Has lanzado una flecha, pero has fallado'];
  }

  isWumpusAlive(): boolean {
    for (let row = 0; row < this.size; row++) {
      const wumpusCell = this.board[row].find((cell: Cell) => cell.enemies?.type === 'monster');
      if (wumpusCell) {
        return wumpusCell.enemies?.isAlive!;
      }
    }
    throw new Error('Wumpus is not in placed the board');
  }

  verifyIfWumpusHasDiedInCell(row: number, col: number): boolean {
    const enemy = this.board[row][col].enemies;
    if (!enemy) {
      return false;
    }

    if (enemy.type.includes('monster')) {
      enemy.isAlive = false;
      return true;
    }
    return false;
  }
}
