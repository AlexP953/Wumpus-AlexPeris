import { NgModule } from '@angular/core';

import { MaterialModule } from './material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  exports: [
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ]
})
export class BaseModule { }
