import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigPageComponent } from './pages/config-page/config-page.component';
import { GamePageComponent } from './pages/game-page/game-page.component';
import { GamePageGuard } from './guards/game-page.guard';

const routes: Routes = [
  {
    path: 'config',
    component: ConfigPageComponent
  },
  {
    path: 'game',
    component: GamePageComponent,
    canActivate: [GamePageGuard]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'config'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
