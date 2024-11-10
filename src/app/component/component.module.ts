import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbCollapseModule, NgbDropdownModule, NgbModule, NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsRoutes } from './component.routing';
import { NgbdpaginationBasicComponent } from './pagination/pagination.component';
import { NgbdAlertBasicComponent } from './alert/alert.component';
import { NgbdnavBasicComponent } from './nav/nav.component';
import { NgbdButtonsComponent } from './buttons/buttons.component';
import { CardsComponent } from './card/card.component';
import { TableComponent } from "./table/table.component";
import { ModuleComponent } from './moduleComponent/module/module.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SidebarComponent } from "../shared/sidebar/sidebar.component";
import { BadgeComponent } from './badge/badge.component';
import {  FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ComponentsRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    NgbNav,
    NgbDropdownModule,
    NgbdAlertBasicComponent,
    NgbdnavBasicComponent,
    NgbdButtonsComponent,
    NgxPaginationModule,
    NgbCollapseModule,
    SidebarComponent,FullCalendarModule
],
  declarations: [
    ModuleComponent,NgbdpaginationBasicComponent,TableComponent,BadgeComponent,CardsComponent
  ],
})
export class ComponentsModule { }
