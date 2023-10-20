import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-config-page',
  templateUrl: './config-page.component.html',
  styleUrls: ['./config-page.component.scss']
})
export class ConfigPageComponent implements OnInit {
  configForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private gameService: GameService,
    private router: Router
  ) {
    this.configForm = this.fb.group({
      boardSize: [4, [Validators.required]],
      numOfWells: [1, [Validators.required]],
      numOfArrows: [5, [Validators.required]]
    })
  }

  ngOnInit(): void { }

  sendForm(): void {
    if (this.configForm.invalid) {
      return;
    }

    const size = this.configForm.get('boardSize')?.value!;
    const numOfWells = this.configForm.get('numOfWells')?.value!;
    const numOfArrows = this.configForm.get('numOfArrows')?.value!;

    this.gameService.createGame(size, numOfWells, numOfArrows);
    this.router.navigateByUrl('/game');
  }
}
