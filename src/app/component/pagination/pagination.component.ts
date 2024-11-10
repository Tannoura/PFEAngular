import { Component, OnInit } from '@angular/core';
import { Module } from 'src/app/modeles/Module';
import { ModuleService } from 'src/app/services/module.service';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { OrganismeService } from 'src/app/services/organisme.service';
import { Organisme } from 'src/app/modeles/Organisme';
import { Image } from 'src/app/modeles/Image';
import { ImageService } from 'src/app/services/image.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ngbd-pagination',
  templateUrl: './pagination.Component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class NgbdpaginationBasicComponent implements OnInit {
  organismes:Organisme[] = []
  organismesModules:Organisme[] = []
  modulesForOrganisme: Module[] = [];  // Liste pour les modules associés à un organisme spécifique
  auth = this.authService;

  modules: Module[] = [];
  modulesSalarie: Module[] = [];
  salarieId: number = 1;
  images: Image[] = [];
  active1= 1;
  active2= 0;
  active:any
  isAddModulePopup:boolean=false;
  isShowModulePopup:boolean=false;
  selectedModuleId:number =0  ;
  selectedOrganismeId:number = 0;
  isShowOrganismePopup:boolean=false;
  modulesOrganisme:Module[] = [];
    constructor(private modulesService:ModuleService,private authService:AuthentificationService
      ,private organismeservice:OrganismeService,private imageService:ImageService
    ,private router:Router,private moduleService:ModuleService) { }

    ngOnInit(): void {
      this.loadModulesBySalarie();
      this.authService.loadProfile();
      this.salarieId = this.authService.userId;
      this.getOrganismes();
      this.fetchImages();
      this.loadModules();
    }
    //afficher module by specialité
    loadModulesBySalarie(): void {
      if(this.authService.isSalarie())
        {
          this.modulesService.getModulesBySalarié(this.salarieId).subscribe(
            modulesSalarie => {
              this.modulesSalarie = modulesSalarie;
              console.log('Modules récupérés :', modulesSalarie);
            },
            error => {
              console.error('Erreur lors de la récupération des modules :', error);
              // Traitez l'erreur ici, par exemple avec SweetAlert ou tout autre méthode de gestion d'erreur
            }
          );
      }

    }

//afficher organisme
    getOrganismes(): void {
      this.organismeservice.getOrganismes().subscribe(
        organismes => {
          this.organismes = organismes;
          console.log('Organismes récupérés :', organismes);

        },
        error => {
          console.error('Erreur lors de la récupération des organismes :', error);
          // Traitez l'erreur ici, par exemple avec SweetAlert ou tout autre méthode de gestion d'erreur
        }
      );
    }
//affihcer Image Organisme
    getOrganismeImage(organisme: Organisme): Image | null {
      if (organisme.image && this.images) {
        return this.images.find(image => image.id === organisme.image.id) || null;
      }
      return null;
    }

    //affichage Image
    fetchImages(): void {
      this.imageService.list().subscribe(
        (images) => {
          this.images = images;
        },
        (error) => {
          console.error('Error fetching images:', error);
        }
      );
    }
    //popUp Modules par Organisme
    ShowModulesForOrganisme(organismeId: number): void {
      this.isShowModulePopup = true;
      this.modulesOrganisme=[];
      this.modulesService.getModulesByOrganisme(organismeId).subscribe(
        modulesOrganisme => {
          this.modulesOrganisme = modulesOrganisme;
          console.log('Modules récupérés :', modulesOrganisme);
        },
        error => {
          console.error('Erreur lors de la récupération des modules :', error);
        }
      );
    }
    closeShowModulePopup(): void {
      this.isShowModulePopup = false;
      this.selectedOrganismeId=0;
      this.selectedModuleId=0;
      this.modulesForOrganisme = [];

    }


    AddModulesForOrganismePopUp(organismeId: number): void {
      this.isAddModulePopup = true;
      this.loadModules();
      this.selectedOrganismeId = organismeId;

    }
    closeAddModulesPopup(): void {
      this.isAddModulePopup = false;
    }

        //ajout modules pour organisme
    addModuleToOrganisme(): void{
      console.log(this.selectedModuleId);
      console.log(this.selectedOrganismeId);
      if (this.selectedModuleId && this.selectedOrganismeId) {
        this.organismeservice.addModuleToOrganisme(this.selectedOrganismeId, this.selectedModuleId)
        .subscribe( ()=>{
          this.loadModules();
        }
        );
      }
      this.loadModules();
      this.closeAddModulesPopup()
    }

    loadModules(): void {
      this.modulesService.getModules().subscribe((modules: Module[]) => {
        this.modules = modules;
      });
    }

    ShowOrganismesForModule(idModule:number):void {
      this.organismesModules=[];
      this.isShowOrganismePopup = true;
      this.organismeservice.getOrganismesByModule(idModule).subscribe(
        organismesModules => {
          this.organismesModules = organismesModules;
        },
        error => {
          console.error('Erreur lors de la récupération des organismes :', error);
        }
      );

    }

    closeShowOrganismesForModulePopup():void {
      this.isShowOrganismePopup = false;
    }

    deleteModule(moduleId: number) {
      Swal.fire({
        title: "Attention!",
        text: "Êtes vous sûre de suppprimer ce module",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Supprimer"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Supprimé!",
            text: "Le module a été supprimé",
            icon: "success"
          });
          this.modulesService.deleteModule(moduleId).subscribe(
            () => {
              console.log('Module supprimé avec succès');
              setTimeout(() => {
                window.location.reload();
              }, 2000);          },
            error => {
              console.error('Erreur lors de la suppression du module : ', error);
            }
          );
        }
      });
    }


    deleteOrganisme(organismeId: number) {
      Swal.fire({
  title: "Attention",
  text: "Êtes vous sûre de suppprimer cet organisme",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Supprimer"
}).then((result) => {
  if (result.isConfirmed) {
    Swal.fire({
      title: "Supprimé",
      text: "L'organisme a été supprimé",
      icon: "success"
    });

    this.organismeservice.deleteOrganisme(organismeId).subscribe(
      () => {
        console.log('Module supprimé avec succès');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error => {
        console.error('Erreur lors de la suppression du module : ', error);
      }
    );
  }
});

    }


    sendIdModuleToSalarieSession(id:number){
      this.moduleService.changeModuleId(id);
      this.router.navigate(['/component/badges']);

    }


    goToAddModuleAndOrganisme(): void {
      this.router.navigate(['/component/nav']);
    }
}
