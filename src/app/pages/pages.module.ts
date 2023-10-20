import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigPageComponent } from './config-page/config-page.component';
import { GamePageComponent } from './game-page/game-page.component';
import { ComponentsModule } from '../components/components.module';
import { BaseModule } from '../base/base.module';

@NgModule({
  declarations: [
    ConfigPageComponent,
    GamePageComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    BaseModule
  ],
  exports: [
    ConfigPageComponent,
    GamePageComponent
  ]
})
export class PagesModule { }
