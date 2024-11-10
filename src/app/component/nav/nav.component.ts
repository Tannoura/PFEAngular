import { Component, OnInit } from '@angular/core';
import { NgbNavModule, NgbDropdownModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { OrganismeService } from 'src/app/services/organisme.service';
import { Organisme } from 'src/app/modeles/Organisme';
import { Module } from 'src/app/modeles/Module';
import { ModuleService } from 'src/app/services/module.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/services/authentification.service';

@Component({
	selector: 'app-ngbd-nav',
	standalone: true,
	imports: [NgbNavModule, NgbDropdownModule, NgFor, NgIf, NgbAlertModule,FormsModule],
	templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NgbdnavBasicComponent implements OnInit  {

  selectedFile: File | null = null;
  newOrganisme: Organisme = {
    id: 0,
    nomOrganisme: '',
    adresseOrganisme: '',
    numeroOrganisme: null,
    modules: [],
    image: {
      name: '',
      imageUrl: '',
      imageId: ''
  }
  };
  nomOrganisme: string = '';
  adresseOrganisme: string = '';
  numeroOrganisme!: number  ;
  moduleId: number = 0;
  photo: File | null = null;
  moduleIdhiden:boolean=false;

  module:Module={
    id:0,
    duree:null,
    matiere:'',
    prix:null
  };

  loader:boolean=false;

  constructor(private authService:AuthentificationService,private organismeService: OrganismeService,private moduleService:ModuleService,private router:Router) {

  }
  ngOnInit(): void {
    this.authService.loadProfile();
    this.loading();
  }

  loading(){
//load apres 2500ms
    setTimeout(() => {
      this.loader=true;
    }, 3500);
  }


  onFileSelected(event: any) {
    this.photo = event.target.files[0];
  }

  addOrganisme(): void {
    if (this.moduleId === 0) {
      this.handleNoModuleCase();


    } else {
      this.addOrganismeWithModule();
    }
  }

  handleNoModuleCase(): void {
    if(this.photo){
    if (!this.validateAdresseOrganisme(this.adresseOrganisme)) {
      this.showInvalidAddressAlert();
      return;
    }else{
      this.organismeService.AddOrganismeSansModule(this.photo,this.nomOrganisme,this.adresseOrganisme,this.numeroOrganisme);

    }}


    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: "Cet organisme n'a pas de module",
      text: "Voulez-vous l'ajouter sans module ou non",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, ajoutez-le",
      cancelButtonText: "Non, ajoutez un module",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.addOrganismeWithoutModule();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.showAddModuleFirstAlert();
      }
    });
  }

  addOrganismeWithoutModule(): void {
    Swal.fire({
      title: "Ajouté!",
      text: "Cet organisme a été ajouté sans module",
      icon: "success"
    });

    if (this.photo) {
      if (!this.validateAdresseOrganisme(this.adresseOrganisme)) {
        this.showInvalidAddressAlert();
        return;
      }

      this.organismeService.AddOrganismeSansModule(this.photo, this.nomOrganisme, this.adresseOrganisme, this.numeroOrganisme)
        .subscribe(
          response => {
            console.log('Organisme ajouté sans module avec succès:', response);
            this.resetForm();
            this.reloadPageAfterDelay(2000);
          },
          error => {
            console.error('Erreur lors de l\'ajout de l\'organisme sans module:', error);
            this.resetForm();
            this.reloadPageAfterDelay(2000);
          }
        );
    }
  }

  addOrganismeWithModule(): void {
    if (this.photo) {
      if (!this.validateAdresseOrganisme(this.adresseOrganisme)) {
        this.showInvalidAddressAlert();
        return;
      }

      this.organismeService.addOrganisme(this.photo, this.nomOrganisme, this.adresseOrganisme, this.numeroOrganisme, this.moduleId)
        .subscribe(
          response => {
            console.log('Organisme ajouté avec succès:', response);
            this.resetForm();
            this.reloadPageAfterDelay(2000);


          },
          error => {
            console.error('Erreur lors de l\'ajout de l\'organisme:', error);
            this.resetForm();
            this.reloadPageAfterDelay(2000);
          }
        );
    }
  }

  validateAdresseOrganisme(adresse: string): boolean {
    const regex = /^\d+\s+.+\s+\d+$/;
  return regex.test(adresse.trim());
  }

  showInvalidAddressAlert(): void {
    Swal.fire({
      icon: 'error',
      title: 'Adresse Organisme',
      text: 'Veuillez saisir une adresse d\'organisme valide.',
    });
  }

  showAddModuleFirstAlert(): void {
    Swal.fire({
      title: "Annulé",
      text: "Ajoutez un module d'abord",
      icon: "error"
    });

    const checkbox = document.getElementById('reg-log') as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = false;
  }
  this.reloadPageAfterDelay(3000)

  this.resetForm();

}

  resetForm(): void {
    this.nomOrganisme = '';
    this.photo = null;
    this.adresseOrganisme = '';
    this.numeroOrganisme = 0;
    this.moduleId = 0;
  }

  reloadPageAfterDelay(delay: number): void {
    setTimeout(() => {
      window.location.reload();

    }, delay);
  }


  addModule(): void {
    if (this.module.matiere || this.module.duree || this.module.prix) {

      this.moduleService.addModule(this.module)
      .subscribe(
        response => {
          console.log('Module ajouté avec succès:', response);
          // Réinitialiser les champs après l'ajout
          this.moduleId = response.id;
          console.log(this.moduleId);
          this.module.matiere = '';
          this.module.duree =null;
          this.module.prix = null;
          this.onModuleAdded();
        },
        error => {
          console.error('Erreur lors de l\'ajout du module:', error);
          Swal.fire({
            title: "<strong>Erreur module</strong>",
            icon: "info",
            html: `
              Ce module déja existe ! `,
            showCloseButton: false,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: `
              <i class="fa fa-thumbs-up"></i> OK
            `
          });

        }
      );
    }
  }

  onModuleAdded() {
      const checkbox = document.getElementById('reg-log') as HTMLInputElement;
      if (checkbox) {
        checkbox.checked = true;
      }


    }




  /*
   const checkbox = document.getElementById('reg-log') as HTMLInputElement;
        if (checkbox) {
          checkbox.checked = false;
        }*/

}
