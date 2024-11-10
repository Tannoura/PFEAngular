import { Component, OnInit } from '@angular/core';
import { Feeds,Feed } from './feeds-data';
import { SessionService } from 'src/app/services/session.service';
import { Session } from 'src/app/modeles/Session';
import { AuthentificationService } from 'src/app/services/authentification.service';

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html'
})
export class FeedsComponent implements OnInit {

  feeds:Feed[];
  closestSession!: Session;
  myDate = new Date();
  currentDate: string = new Date().toISOString().split('T')[0]; // Date au format 'YYYY-MM-DD'

  constructor(private sessionService: SessionService,private authService:AuthentificationService) {
    this.feeds = Feeds;
  }

  ngOnInit(): void {
    this.authService.loadProfile();
    if(this.authService.isAdmin())
      this.loadClosestSession(this.myDate.toISOString().slice(0, 10));
    else
      this.getClosestSession();

  }

  //admin closet session by date
  loadClosestSession(date: string): void {
    this.sessionService.getClosestSession(date).subscribe(session => {
      this.closestSession = session;
      this.feeds[0].task = this.closestSession.module.matiere;
      this.feeds[1].task = this.closestSession.organisme.nomOrganisme;
      this.feeds[2].task =  this.closestSession.datedebut;
      this.feeds[3].task = this.closestSession.cout.toString();
      this.feeds[4].task = this.closestSession.salle;
    });
  }

//salarie closet session by his poste
  getClosestSession(): void {
    this.sessionService.getClosestSessionBySalarie(this.authService.userId, this.currentDate)
      .subscribe(session => {
        this.closestSession = session;
        if(this.closestSession == null){
          this.feeds[0].task = "Aucune session trouvée";
          this.feeds[1].task = "Aucune session trouvée";
          this.feeds[2].task = "Aucune session trouvée";
          this.feeds[3].task = "Aucune session trouvée";
          this.feeds[4].task = "Aucune session trouvée";
          return;
        }
        this.feeds[0].task = this.closestSession.module.matiere;
        this.feeds[1].task = this.closestSession.organisme.nomOrganisme;
        this.feeds[2].task =  this.closestSession.datedebut;
        this.feeds[3].task = this.closestSession.cout.toString();
        this.feeds[4].task = this.closestSession.salle;
      });
  }
}
