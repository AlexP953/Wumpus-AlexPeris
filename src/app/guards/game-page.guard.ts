import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { GameService } from '../services/game.service';

@Injectable({
  providedIn: 'root'
})
export class GamePageGuard implements CanActivate {

  constructor(private router: Router, private gameService: GameService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.gameService.size > 0) {
      return true;
    }

    this.router.navigateByUrl('/config');
    return false;
  }
}
