import {  Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Membre } from "src/app/modeles/Membre";
import { PlanningEntry } from "src/app/modeles/PlanningEntry";
import { PlanningType } from "src/app/modeles/PlanningType";
import { Session } from "src/app/modeles/Session";
import { StatutSession } from "src/app/modeles/StatutSession";
import { AuthentificationService } from "src/app/services/authentification.service";
import { MembreService } from "src/app/services/membre.service";
import { ModuleService } from "src/app/services/module.service";
import { PlanningEntryService } from "src/app/services/planning-entry.service";
import { SessionService } from "src/app/services/session.service";
import Swal from "sweetalert2";
@Component({
  templateUrl: "badge.component.html",
  selector: 'app-badge',
  styleUrls: ['badge.component.scss'],
})
export class BadgeComponent implements OnInit,OnDestroy {
  sessions: Session[] = [];
  PlanningCard=false; // pour les cards getPlanningsBySessionID
  CardJour:boolean = false;
  planningEntries: PlanningEntry[] = [];
  moduleId: number | null = null;
  private moduleIdSubscription: Subscription |null = null;
  loading:boolean = false;
  userId:number=1;
  membreList: Membre[] = []; // Ajout de la propriété
  membershipStatuses:{[sessionId:number]:boolean}={}

  nomModule:string="";
  constructor(private authService:AuthentificationService,private sessionService:SessionService
    ,private moduleService:ModuleService,private planningService:PlanningEntryService,private membreService:MembreService
    ,private router:Router

  ) { }
  ngOnInit(): void {
  this.authService.loadProfile();
  this.loading = true; // Afficher le loader
  this.userId=this.authService.userId;


  setTimeout(() => {
    this.loading = false; // Cacher le loader une fois l'opération terminée
  }, 4000);

  this.moduleIdSubscription = this.moduleService.currentModuleId.subscribe(
    (id: number | null) => {
      this.moduleId = id;
      if (this.moduleId !== null) {
        this.getSessionsByModule(this.moduleId);

        this.moduleService.getMatiereById(this.moduleId).subscribe(
          (data: string) => {
            this.nomModule = data;
          },
          (error) => {
            console.error('Erreur lors de la récupération de la matière :', error);
          }
        );



      }
      else{
        this.router.navigateByUrl("/component/pagination")
      }
    }
  );
}




  getSessionsByModule(moduleId: number): void {
    this.sessionService.getSessionsByModule(moduleId).subscribe(
      (data) => {
        this.sessions = data;
        this.sessions.forEach(session =>
        {this.checkMembershipStatus(session.id,this.userId)}
        )
      },
      (error) => {
        console.error('Erreur lors de la récupération des sessions', error);
      }
    );
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
  ngOnDestroy(): void {
    if (this.moduleIdSubscription)
    this.moduleIdSubscription.unsubscribe();
  }


  ajouterMembre(userId: number, session: Session) {
    userId=this.userId;
    if(session.statutSession===StatutSession.INSCRIPTION)
      {
      this.membreService.addMembreToSession(userId, session.id).subscribe(
        response => {
          console.log('Membre ajouté : ', response);
          Swal.fire({
            title: "Féliciation",
            text: "Participé à la session",
            icon: "success"
          });
          this.router.navigateByUrl("/component/card")

        },
        error => {
          console.error('Erreur lors de l\'ajout du membre : ', error);
        }
      );
    }
    else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Statut Session",
        footer: 'La session n est pas en phase inscription'
      });
    }
  }

  supprimerMembreByUserSessionIds(userId: number,session:Session) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Etes vous sûre",
      text: " Vous ne pourrez pas revenir en arrière !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, vas-y!",
      cancelButtonText: "Non, annuler!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        this.membreService.deleteMembreByUserAndSessionId(userId,session.id).subscribe(
          () => {
            console.log('Membre supprimé');
            this.router.navigateByUrl("/component/card")

          },
          error => {
            console.error('Erreur lors de la suppression du membre : ', error);
          }
        );

        swalWithBootstrapButtons.fire({
          title: "Anuulé",
          text: "Tu n'est plus un membre de cette session",
          icon: "success"
        });
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Vous êtes toujours membre de cette session",
          icon: "error"
        });
      }
    });
}

isSessionInInscription(session: Session): boolean {
  return session.statutSession === StatutSession.INSCRIPTION;
}




checkMembershipStatus(sessionId: number,userId:number): void {
  this.userId=userId
  this.membreService.isMember(userId, sessionId).subscribe(
    (isMember) => {
      this.membershipStatuses[sessionId] = isMember;
    },
    (error) => {
      console.error('Erreur lors de la vérification du statut de membre', error);
    }
  );
}
}
