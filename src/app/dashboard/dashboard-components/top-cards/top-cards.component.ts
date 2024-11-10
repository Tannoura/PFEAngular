import { Component, OnInit } from '@angular/core';
import {topcard,topcards} from './top-cards-data';
import { SessionService } from 'src/app/services/session.service';
import { AuthentificationService } from 'src/app/services/authentification.service';

@Component({
  selector: 'app-top-cards',
  templateUrl: './top-cards.component.html'
})
export class TopCardsComponent implements OnInit {

  topcards:topcard[];
  numberOfSessionsValidated: number=0;
  numberOfSessionsNotValidated: number=0;
  maxSessionCost: number=0;
  totalPlanningHours: number=0;
  authservice: any;
  constructor(private sessionService: SessionService,private authService:AuthentificationService) {
    this.topcards=topcards;
  }

  ngOnInit(): void {
    this.loadIndicators();
    this.authService.loadProfile();
    this.authservice = this.authService;

  }

  loadIndicators(): void {
    this.sessionService.getNumberOfSessionsValidatedByAdmin().subscribe(count => {
      this.numberOfSessionsValidated = count;
      this.topcards[0].title =  this.numberOfSessionsValidated.toString();
        });

    this.sessionService.getNumberOfSessionsNotValidatedByAdmin().subscribe(count => {
      this.numberOfSessionsNotValidated = count;
      this.topcards[1].title = this.numberOfSessionsNotValidated.toString();
    });

    this.sessionService.getMaxSessionCost().subscribe(cost => {
      this.maxSessionCost = cost;
      this.topcards[2].title = this.maxSessionCost.toString() + " €";
    });

      this.sessionService.getTotalPlanningHours().subscribe(hours => {
        this.totalPlanningHours = hours;
        this.topcards[3].title = this.totalPlanningHours.toString();
        console.log(this.totalPlanningHours);
      });
  }
}
