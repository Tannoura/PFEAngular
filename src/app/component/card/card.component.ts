import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // Importation du plugin d'interaction
import * as moment from 'moment';
import { Membre } from 'src/app/modeles/Membre';
import { Presence } from 'src/app/modeles/Presence';
import { Session } from 'src/app/modeles/Session';
import { StatutSession } from 'src/app/modeles/StatutSession';
import { User } from 'src/app/modeles/User';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { MembreService } from 'src/app/services/membre.service';
import { PresenceService } from 'src/app/services/presence.service';
import { SessionService } from 'src/app/services/session.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-cards',
  templateUrl: 'card.component.html',
  styleUrls: ['card.component.scss'],
})
export class CardsComponent implements OnInit {
  userId:number=1;
  popupUserListBySession:boolean=false;
  UsersList:User[]=[]; //liste des presences des users
  membersList: Membre[] = []; // Liste des membres inscrits à la session
  userPresentOrNot:boolean=false;
  TimeLineSession!:Session;
  TimeLineDates:string[]=[];
  PresenceListBySessionAndUser:Presence[]=[];
  calendarVisible = true;

  moduleColors: { [moduleName: string]: string } = {}; // Stocke les couleurs par module

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  ngOnInit(): void {
    this.authService.loadProfile();
    this.userId = this.authService.userId;
    this.loadSessions();
  }
  constructor(private authService:AuthentificationService
    ,private membreService:MembreService,
    private sessionService:SessionService,
    private presenceService:PresenceService
  ){}
  calendarOptions: any = {
    plugins: [dayGridPlugin,interactionPlugin],
    initialView: 'dayGridMonth',
    weekends:false,
    events: [],
     eventClick: this.handleEventClick.bind(this), // Ajoute le gestionnaire d'événements pour le clic

  };
  switchToDayView(): void {
    this.calendarComponent.getApi().changeView('dayGridDay');
  }

  switchToMonthView(): void {
    this.calendarComponent.getApi().changeView('dayGridWeek');
  }

  switchToWeekView(): void {
    this.calendarComponent.getApi().changeView('dayGridMonth');
  }

  loadSessions(): void {
    if(this.authService.isSalarie()){
      this.membreService.getSessionsByUserId(this.userId).subscribe((sessions: Session[]) => {
        const events = sessions.flatMap(session => {
          const color = this.getColorForModule(session.module.matiere); // Obtenez la couleur pour le module
          // Ajouter un jour à la date de fin pour inclure le dernier jour complet
          const endDate = moment(session.datefin).add(1, 'days').toISOString();
            return {
              title: session.module.matiere,
              start: session.datedebut,
              end: endDate,
              color: color, // Utilisez la couleur associée à la séance
            };
        });
        this.calendarOptions.events = events;
      });
    }

    if(this.authService.isAdmin()){
      this.sessionService.getSessions().subscribe((sessions: Session[]) => {
        const events = sessions.map(session => {
          const color = this.getColorForModule(session.module.matiere); // Obtenez la couleur pour le module
          // Ajouter un jour à la date de fin pour inclure le dernier jour complet
          const endDate = moment(session.datefin).add(1, 'days').toISOString();
            return {
              title: session.module.matiere,
              start: session.datedebut,
              end: endDate,
              color: color, // Utilisez la couleur associée à la séance
              extendedProps: { session } // Attachez l'objet session complet
            };
        });
        this.calendarOptions.events = events;
      });
    }
  }

  getColorForModule(moduleName: string): string {
    if (!this.moduleColors[moduleName]) {
      this.moduleColors[moduleName] = this.generateRandomColor(); // Générez une nouvelle couleur si le module n'en a pas
    }
    return this.moduleColors[moduleName];
  }

  generateRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  handleEventClick(clickInfo: any): void {
    const session = clickInfo.event.extendedProps.session;
    this.openPopupUsersList(session);
  }

  openPopupUsersList(session: Session): void {
    this.TimeLineSession=session;
      if(this.authService.isAdmin())
        {
      if(session.statutSession==StatutSession.FINI || session.statutSession==StatutSession.VALIDEPARADMIN  || session.statutSession==StatutSession.ENCOURS){
      this.membersList = [];
      this.UsersList = [];
      this.popupUserListBySession = true;
      // Récupérer les utilisateurs inscrits à la session
      this.membreService.getMembersBySessionId(session.id).subscribe(
        (users: User[]) => {
          this.UsersList=users;
        },
        error => {
          console.error('Erreur lors de la récupération des utilisateurs:', error);
        }
      );
      }
      else
      {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'La session non Finie',
        });
      }
          }
    }
  closePopupUsersList(): void {
    this.popupUserListBySession=false;
    this.calendarVisible=true;
  }

openPresenceTimeLine(user:User,session:Session):void{
this.userPresentOrNot=true;
this.calendarVisible=false;
this.presenceService.getPresencesBySessionIdAndUserId(session.id,user.id).subscribe(
  (presences)=>{
    this.PresenceListBySessionAndUser=presences;
    console.log(this.PresenceListBySessionAndUser);
  }
);
}

 // Méthode pour obtenir la classe CSS en fonction de la présence (présent ou absent) coueur vert ou rouge
 getPresenceClass(presence: Presence): string {
  return presence.present ? 'bg-green-500' : 'bg-red-500';
}

  // Méthode pour obtenir le titre en fonction de la présence
  getPresenceTitle(presence: Presence): string {
    return presence.present ? this.getDayOfWeek(presence.jour) : this.getDayOfWeek(presence.jour);
  }

  // Méthode pour obtenir le message en fonction de la présence
  getPresenceMessage(presence: Presence): string {
    return presence.present ? '' : '';
  }

  BackoCalendar():void{
    this.userPresentOrNot=false;
    this.calendarVisible=true;
  }

  getDayOfWeek(dateString: string): string {
    const date = new Date(dateString);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[date.getDay()];
  }
}
