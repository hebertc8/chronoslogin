import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NebularModule } from '../nebular/nebular.module';
import { ThemeModule } from '../nebular/@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NebularModule,
    ThemeModule,
    FormsModule, 
    ReactiveFormsModule,
    DragDropModule
  ],
  exports: [
    NebularModule,
    ThemeModule,
    FormsModule, 
    ReactiveFormsModule,
    DragDropModule
  ]
})
export class GeneralModuleModule { }
