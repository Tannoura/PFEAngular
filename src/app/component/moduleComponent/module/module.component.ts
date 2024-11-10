import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';



@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss']
})
export class ModuleComponent{
  constructor(private router: Router) {}


}
