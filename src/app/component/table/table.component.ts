import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { SessionService } from 'src/app/services/session.service';
import { Session } from 'src/app/modeles/Session';
import { PlanningType } from 'src/app/modeles/PlanningType';
import { StatutSession } from 'src/app/modeles/StatutSession';
import Swal from 'sweetalert2';
import { OrganismeService } from 'src/app/services/organisme.service';
import { ModuleService } from 'src/app/services/module.service';
import { PlanningEntryService } from 'src/app/services/planning-entry.service';
import { PlanningEntry } from 'src/app/modeles/PlanningEntry';
import { Time, WeekDay } from '@angular/common';
import { differenceInDays, eachDayOfInterval } from 'date-fns';
import { MembreService } from 'src/app/services/membre.service';
import { User } from 'src/app/modeles/User';
import { Membre } from 'src/app/modeles/Membre';
import { PresenceService } from 'src/app/services/presence.service';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-table',
  templateUrl: 'table.component.html',
  styleUrls: ['./table.component.scss']

})
export class TableComponent implements OnInit {
  planningSessionId:number = 0;
  planningForm: boolean = false;
  selectedSession!: Session;
  PresencePopUp:boolean = false;
  UsersList:User[]=[]; //liste des presences des users
  membersList: Membre[] = []; // Liste des membres inscrits à la session
  sessions: Session[] = [];
  planningTypes = Object.values(PlanningType);
  statutSessions = Object.values(StatutSession);
  p:any;  //paramètre pagination
  clickedDate: string = ''; // Variable pour stocker la date cliquée
  inputStatuSession=false; // pour mettre la session en inscription par default
  organismeDropdownDisabled = false; // pour liste roulante organisme
  PlanningCard=false; // pour les cards getPlanningsBySessionID
  newEntry:PlanningEntry = {
    id:0,
    debut : {
      hours: 10,
      minutes: 10
  } ,
    fin:  {
      hours: 10,
      minutes: 10
  } ,
    jour: WeekDay.Wednesday,
    session: {
      id: 0,
      salle: '',
      capacite: 0,
      datedebut: '',
      cout: 0,
      datefin: '',
      planningType: PlanningType.EVERYDAY,
      statutSession: StatutSession.INSCRIPTION,
      organisme: {
        id: 0,
        nomOrganisme: '',
        adresseOrganisme: '',
        numeroOrganisme: 0,
        modules: [],
        image: {
          name: '',
          imageUrl: '',
          imageId: ''
        }
      },
      module: {
        id: 0,
        matiere: '',
        duree: 0,
        prix: 0
      }
    }

  }
  newSession:Session={
    id:0,
    salle: '',
    capacite: 0,
    datedebut: '',
    cout: 0,
    datefin: '',
    planningType: PlanningType.EVERYWEEK,
    statutSession: StatutSession.INSCRIPTION,
    organisme: {
      id: 0,
      nomOrganisme: '',
      adresseOrganisme: '',
      numeroOrganisme: 0,
      modules: [],
      image: {
        name: '',
        imageUrl: '',
        imageId: ''
      }
    },
    module: {
      id: 0,
      matiere: '',
      duree: 0,
      prix: 0
    }
  }

  totalCost: number = 0;
  modules!: any[];
  organismes!: any[];
  sessionForum:boolean = false; // variable test formulaire session
  plannings: Array<{ debut: Time; fin: Time; jour: WeekDay }> = [{ debut: { hours: 0, minutes: 0 }, fin: { hours: 0, minutes: 0 },  jour: WeekDay.Monday }]; // pour ajouter les inputs
  weekDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
  isEveryday: boolean = true; // Variable pour vérifier le type de planification
  availableDays: string[] = []; // les jours disponibles entre date début et fin
  showPlanningTypeDropdown: boolean = false; // variable pour planning type si la session est mois ou plus 7 jours
  planningEntries: PlanningEntry[] = [];
  CardJour:boolean = false;
  nbrSalarie:number=1;
  nbrInscrit:number=1;
  NbrModuleWithoutOgra:number=1;
  UserPresencePopUp:boolean=false;
  userDatesSession:any[]=[];
  sessionPresenceId:number=1;
  memberPresenceId:number=1;
  openDropdownIndex: number | null = null; // Garde une trace de l'index du menu déroulant ouvert

  checkWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 6 || day === 0; // 6 = Samedi, 0 = Dimanche
  }// voir si date debut et fin weekday ou pas
  constructor(private authService:AuthentificationService,private sessionService:SessionService,
   private organismeService:OrganismeService,private moduleService:ModuleService
  ,private planningService:PlanningEntryService
,private membreService:MembreService, private presenceService:PresenceService
,private excelService:ExcelService ) {}
  ngOnInit(): void {
  this.authService.loadProfile();
  this.getSessions();
  this.loadTotalCost();
  this.moduleService.getModules().subscribe(modules => {
    this.modules = modules;
  });

  this.authService.getSalariéCount().subscribe(
    (nbrSalarié:any) => {
      this.nbrSalarie = nbrSalarié;}
  );

  this.membreService.getMembresCountByUser().subscribe(
    (nbrInscrit:any) => {
      this.nbrInscrit = nbrInscrit;
    }
  );

  this.moduleService.getNombreModulesSansOrganismes().subscribe(nbr => {
    this.NbrModuleWithoutOgra = nbr;
  });
 }

 validateDates(startDate: string, endDate: string): boolean {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (this.checkWeekend(start)) {
    Swal.fire({
      icon: 'warning',
      title: 'Week-end détecté',
      text: 'La date de début ne peut pas être un week-end.',
    });
    return false;
  }

  if (this.checkWeekend(end)) {
    Swal.fire({
      icon: 'warning',
      title: 'Week-end détecté',
      text: 'La date de fin ne peut pas être un week-end.',
    });
    return false;
  }

  return true;
}

toggleDropdown(index: number) {
  if (this.openDropdownIndex === index) {
    this.openDropdownIndex = null; // Ferme le menu s'il est déjà ouvert
  } else {
    this.openDropdownIndex = index; // Ouvre le menu correspondant à l'index
  }
}

isDropdownOpen(index: number): boolean {
  return this.openDropdownIndex === index;
}

//voir la duree de la session et mettre la liste des roulantes jours
 updateAvailableDays() {
  const startDate = new Date(this.newSession.datedebut);
  const endDate = new Date(this.newSession.datefin);
  //vider la liste des jours valables entre la date debut et fin
  this.availableDays = [];

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Create a set of unique days
  const uniqueDays = new Set(days.map(day => this.weekDays[day.getDay() - 1]));

  // Map the weekDays to get the sorted order
  const weekDaysOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

  // Filter the days based on the unique days and sort them according to the weekDaysOrder
  this.availableDays = weekDaysOrder.filter(day => uniqueDays.has(day));


   const duration = differenceInDays(endDate, startDate);
     // Determine planningType based on duration
  if (duration < 7) {
    this.newSession.planningType = PlanningType.MOINS7;
    this.showPlanningTypeDropdown = false;
  } else {
    this.showPlanningTypeDropdown = true;
    this.planningTypes = [PlanningType.EVERYDAY, PlanningType.EVERYWEEK];

  }
}

 addPlanning(): void {
  this.plannings.push({ debut: { hours: 0, minutes: 0 }, fin: { hours: 0, minutes: 0 },  jour: WeekDay.Monday });
}
removePlanning(index: number): void {
  this.plannings.splice(index, 1);
}


 openSessionAdd(){
  this.sessionForum=true;
 }
 closeSessionAdd(){
  this.sessionForum=false;
 }

 openPlanningPopUp(id:number){
  this.planningForm=true;
  this.planningSessionId=id;

  if(this.newSession.planningType===PlanningType.EVERYDAY){
    this.isEveryday = true
  }

  else {
    this.isEveryday = false;
  }
 }
 closePlanningPopUp(){
  this.planningForm=false;
 }
 loadTotalCost(): void {
  this.sessionService.getTotalCost().subscribe(cost => {
    this.totalCost = cost;
  });
}

onModuleChange(event: any): void {
  const moduleId = event.target.value;
  this.organismeService.getOrganismesByModule(moduleId).subscribe(
    organismes => {
      this.organismeDropdownDisabled = false;
      this.organismes = organismes;
    },
    (error: any) => {
      console.log(error);
      this.organismeDropdownDisabled = true;
      this.organismes = [];
      if (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur 404',
          text: 'Aucun Organisme pour ce module ',
        });
      }
    }
  );
}

 getSessions(): void {
  this.sessionService.getSessions().subscribe((data: Session[]) => {
    this.sessions = data;
  });
}

addSession(): void {
  const today = new Date();
    const startDate = new Date(this.newSession.datedebut);
    const endDate = new Date(this.newSession.datefin);

    if (!this.validateDates(this.newSession.datedebut, this.newSession.datefin)) {
      return; // Si une date est invalide, arrêter la procédure
    }

    if (startDate < today) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'La session doit commençer a partir aujourdhui.',
      });
      return;
    }

    if (endDate < startDate) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'La date de fin ne peut pas être avant la date de début.',
      });
      return;
    }

    this.sessionService.addSession(this.newSession).subscribe((createdSession:Session) => {
      this.updateAvailableDays();
    this.openPlanningPopUp(createdSession.id);
  });
}

selectSession(session: Session) :void{
  this.selectedSession = session;

  if (this.selectedSession && this.selectedSession.statutSession === StatutSession.ANNULE) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'La session est annulé',
    });
    return;
  }
  if (this.selectedSession && this.selectedSession.statutSession === StatutSession.ENCOURS) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'La session se déroule encore',
    });
    return;
  }

  if (this.selectedSession && this.selectedSession.statutSession === StatutSession.INSCRIPTION) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'La session est en Inscription',
    });
    return;
  }
  if (this.selectedSession && this.selectedSession.statutSession === StatutSession.VALIDEPARADMIN) {
    Swal.fire({
      icon: 'question',
      title: 'Validé',
      text: 'La session est déja validé',
    });
    return;
  }

  this.updateSessionStatus(session);
}

getStatusColor(status: StatutSession): string {
  switch (status) {
    case StatutSession.INSCRIPTION:
      return 'bg-yellow-500';
    case StatutSession.ENCOURS:
      return 'bg-blue-500';
    case StatutSession.FINI:
      return 'bg-green-500';
    case StatutSession.ANNULE:
      return 'bg-red-500';

      case StatutSession.VALIDEPARADMIN:
      return 'bg-black';
    default:
      return '';
  }
}

updateSessionStatus(session:Session): void {
  Swal.fire({
    title: "La Session est Terminé",
    text: "Validez là",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Oui, valide là!"
  }).then((result) => {
    if (result.isConfirmed) {
      const newStatus = StatutSession.VALIDEPARADMIN;
      this.sessionService.updateSessionStatus(session.id, newStatus).subscribe(
        (updated: boolean) => {
          if (updated) {
            // Success: Update session locally if needed
            if (this.selectedSession) {
              this.selectedSession.statutSession = newStatus; // Update locally
            }
            // Show success alert
            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: 'Statut de la session mis à jour est validé par l\'admin',
            });

            //window location apres 3 s
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          } else {
            // Error: Show error alert
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Erreur lors de la mise à jour du statut de la session.',
            });
          }
        },
        (error: any) => {
          // Error: Show error alert
          console.error('Error updating session status:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur s\'est produite lors de la mise à jour du statut de la session.',
          });
        }
      );
    }
  });
}

createPlanningEntry(sessionId: number) {
  sessionId = this.planningSessionId;
  this.planningService.createPlanningEntry(sessionId, this.newEntry)
    .subscribe(
      response => {
        console.log('Planning Entry Created:', response);
        this.planningForm = false;
        Swal.fire({
          title: "Le planning a été ajouté avec succès",
          showClass: {
            popup: `
              animate__animated
              animate__fadeInUp
              animate__faster `
          },
          hideClass: {
            popup: `
              animate__animated
              animate__fadeOutDown
              animate__faster
            `
          }
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);

      },
      error => {
        console.error('Error creating planning entry:', error);
      }
    );
}

addMultiplePlanning(): void {
  console.log('Adding multiple clicked')
  this.plannings.forEach(planning => {
    const entry: PlanningEntry = {
      ...this.newEntry,
      debut: planning.debut,
      fin: planning.fin,
      jour: planning.jour,
      session: { id: this.planningSessionId } as Session
    };
    this.planningService.createPlanningEntry(this.planningSessionId,entry).subscribe(
      response=>{console.log(response)}
    );

    this.planningForm=false;
    Swal.fire({
      title: "Les plannings ont été ajoutés avec succès",
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster `
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `
      }
    });

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  });
}


openCardsGetPlanningEntriesBySessionId(sessionId:number,session:Session){
  if (session.planningType === PlanningType.EVERYDAY) {
    this.PlanningCard=true;
    this.CardJour=true;
    this.planningService.getPlanningEntriesBySessionId(sessionId).subscribe(
      (entries) => {
        this.planningEntries = entries;
      },
      (error) => {
        console.error('Error fetching planning entries:', error);
      }
    );
  } else {
    this.CardJour=false;
    this.PlanningCard=true;
    this.planningService.getPlanningEntriesBySessionId(sessionId).subscribe(
      (entries) => {
        this.planningEntries = entries;
      },
      (error) => {
        console.error('Error fetching planning entries:', error);
      }
    );
  }
}

CloseEntry(){
  this.PlanningCard=false;
}

closePopUpPresence(): void {
  this.PresencePopUp = false;
}

OpenPresencePopUp(session: Session): void {
  if(this.authService.isAdmin())
    {
      if(session.statutSession==StatutSession.FINI || session.statutSession==StatutSession.ENCOURS){
          //vider les listes
  this.membersList = [];
  this.UsersList = [];
  this.PresencePopUp = true;
  this.clickedDate = "de " + session.module.matiere + " par " + session.organisme.nomOrganisme;
  this.sessionPresenceId=session.id; // pour envoyer a l'id de la session dans la popup presenceListDays
  // Récupérer les utilisateurs inscrits à la session
  this.membreService.getMembersBySessionId(session.id).subscribe(
    (users: User[]) => {
      this.UsersList=users;
      // Traitement individuel des userIds
      users.forEach(user => {
        this.membreService.getMembreBySessionAndUser(session.id, user.id).subscribe(
          (membre: Membre) => {
             // Vérifier si le membre n'est pas déjà dans la liste pour éviter les duplications
          if (!this.membersList.some(existingMembre => existingMembre.id === membre.id)) {
            this.membersList.push(membre);
          }
          },
          error => {
            console.error(`Erreur lors de la récupération du membre avec userId ${user.id}:`, error);
          }
        );
      });
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

openUserPresencePopUp(membreId:number):void{
  console.log(membreId);
  this.UserPresencePopUp= true;
  this.memberPresenceId=membreId;
  this.sessionService.getPlanningDates(this.sessionPresenceId).subscribe(
    (dates: string[]) => {
      this.userDatesSession = dates;
    },
    (error) => {
      console.error('Error fetching planning dates:', error);
    }
  );
}

closeUserPresencePopUp():void{
  this.UserPresencePopUp= false;

}

togglePresence(event: Event, membreId: number,date:string): void {
  membreId = this.memberPresenceId;
  console.log(membreId);
  const selectElement = event.target as HTMLSelectElement;
  const value = selectElement.value;
  const present = value === 'true'; // Convertir la valeur en boolean
  this.presenceService.checkPresenceExists(membreId,date).subscribe((exists: boolean) => {
    if (exists) {
      Swal.fire({
        title: 'Modifier la présence',
        text: 'La présence de ce membre existe déjà. Voulez-vous vraiment changer l\'état de présence?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, changer',
        cancelButtonText: 'Non, annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          this.updatePresence(membreId, present,date);
        } else {
          selectElement.value = present ? 'true' : 'false';
        }
      });
    } else {
      this.markPresence(membreId, present,date);
    }
  });
}

updatePresence(membreId: number, present: boolean,date:string): void {
  this.presenceService.updatePresence(membreId, present,date).subscribe(() => {
    console.log('Presence updated');

  });}

  markPresence(membreId: number, present: boolean,date:string): void {
    this.presenceService.markPresence(membreId, present,date).subscribe(() => {
      console.log('Presence ajoutée');

    });
  }


  downloadExcel(session: Session): void {
    if(session.statutSession===StatutSession.VALIDEPARADMIN){
      this.excelService.exportPresence(session.id).subscribe(
        (response: Blob) => {
          // Créez un lien temporaire pour télécharger le fichier
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'presence_export.xlsx'; // Nom du fichier
          a.click();
          window.URL.revokeObjectURL(url); // Nettoyez l'URL après utilisation
        },
        error => {
          console.error('Erreur lors de l\'exportation:', error);
        }
      );
    }

    else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'La session n\'est pas encore validée par l\'admin',
      });
    }


  }

}

