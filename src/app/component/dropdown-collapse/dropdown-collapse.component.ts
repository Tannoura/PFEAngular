import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Admin } from 'src/app/modeles/Admin';
import { AuthenticationResponse } from 'src/app/modeles/AuthenticationResponse';
import { Role } from 'src/app/modeles/Role';
import { Salarie } from 'src/app/modeles/Salarie';
import { AuthentificationService } from 'src/app/services/authentification.service';
import Swal  from 'sweetalert2';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { EmailService } from 'src/app/services/email.service';

(pdfMake as any).vfs=pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-dropdown-basic',
  templateUrl: './dropdown-collapse.component.html',
  styleUrls: ['./dropdown-collapse.component.scss']

})
export class NgbdDropdownBasicComponent implements OnInit {

  constructor(private authService:AuthentificationService,
    private router:Router,private emailService:EmailService) { }
  admin: Admin ={
    id: 0,
    firstname: '',
    lastname: '',
    username: '',
    password: '',
    role: Role.ADMIN
  }
  salarie: Salarie = {
    id: 0,
    firstname: '',
    lastname: '',
    username: '',
    password: 'password',
    role: Role.SALARIE,
    poste: {
      id: 0,
      specialite: ''
    }
  };
  passwordInput:boolean=false;
  username:string=""
  boutonContrat:boolean=false
  lastname:string=""

  ngOnInit(): void {
    this.authService.loadProfile();
    this.lastname = this.authService.lastname
    this.username= this.authService.username;
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    signUpButton?.addEventListener('click', () => {
      container?.classList.add('right-panel-active');
    });

    signInButton?.addEventListener('click', () => {
      container?.classList.remove('right-panel-active');
    });
  }

  onAddSalarie(event: Event): void {
    event.preventDefault();
    // Ajoutez ici le code pour gérer la soumission du formulaire de création de compte
    this.authService.registerSalarie(this.salarie).subscribe((response: AuthenticationResponse) => {
      // Gérer la réponse si nécessaire
      console.log('Registration successful:', response);
      this.showSuccessAlert();
      this.salarie.firstname = ""
      this.salarie.password = "password"
      this.salarie.poste.specialite=""
      setTimeout(() => {
        this.onSignUpClick();},
        3500);
    }, (error) => {
      // Gérer les erreurs si nécessaire
      console.error('Registration failed:', error);

      if (error.status === 403) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: " L'adresse mail",
          footer: 'Vérifier le mail du salarié'
        });
      }

    });
  }


  onSignUpClick(): void {
    const container = document.getElementById('container');
    container?.classList.add('right-panel-active');


  }

  onSignInClick(): void {
    const container = document.getElementById('container');
    container?.classList.remove('right-panel-active');
  }

  showSuccessAlert(): void {
    Swal.fire({
      icon: 'success',
      title: 'Registration Successful',
      text: 'Your account has been registered successfully!',
      showConfirmButton: false,
      timer: 2000 // Durée en millisecondes avant de fermer automatiquement l'alerte
    });
  }


  generatePdfAndSendEmail() {

      // Date d'envoi du PDF
      const dateEnvoi = new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const docDefinition = {
      content: [
        {
          text: `Date d'envoi du contrat: ${dateEnvoi}`,
          style: 'date'
        },

        `Monsieur/Madame ${this.salarie.lastname}, voici votre contrat qui a été fait par monsieur ${this.lastname}`,
        {
          text: 'Conditions du contrat',
          style: 'header'
        },
        {
          ul: [
            'Durée du contrat: Le contrat est valable pour une période de 12 mois à compter de la date de signature.',
            'Responsabilités du salarié: Le salarié s’engage à fournir des formations selon le calendrier convenu et à respecter les normes de qualité définies par l’entreprise.',
            'Rémunération: Le salarié recevra une rémunération mensuelle fixe, payée à la fin de chaque mois.',
            'Confidentialité: Le salarié doit maintenir la confidentialité des informations privilégiées de l’entreprise et des clients.',
            'Résiliation du contrat: Le contrat peut être résilié par écrit par l’une ou l’autre des parties avec un préavis de 30 jours.'
          ],
          style: 'content'
        },
        {
          text: 'Signature:',
          style: 'signature'
        }
      ],
      styles: {

        header: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 10] as [number, number, number, number]
        },
        content: {
          fontSize: 14,
          margin: [0, 5, 0, 5] as [number, number, number, number]
        },
        signature: {
          margin: [0, 20, 0, 0] as [number, number, number, number]
        },
      }
    };


    const pdf = pdfMake.createPdf(docDefinition);

    // Téléchargement du PDF (vous pouvez supprimer cette ligne si vous ne voulez pas le télécharger)
    pdf.download('contrat.pdf');

    // Envoi du PDF par e-mail
    const email = this.salarie.username; // Adresse e-mail du destinataire
    const subject = 'Votre contrat';
    const body = 'Bonjour, veuillez trouver ci-joint votre contrat.';
    const filename = 'contrat.pdf';

    pdf.getBlob((blob: Blob) => {
      const file = new File([blob], filename, { type: 'application/pdf' });

      // Appel à la méthode d'envoi d'e-mail avec pièce jointe de votre service EmailService
      this.sendEmailWithAttach(email, subject, body, file);
      this.onSignInClick();
    });

    this.salarie.username=""
    this.salarie.lastname=""
  }




  sendEmailWithAttach(email: string, subject: string, body: string, attachment: File) {
    this.emailService.sendEmailWithAttachment(email, subject, body, attachment).subscribe(
      response => {
        console.log('Email sent successfully:', response);
        // Gérer la réponse ici, par exemple afficher un message de succès
      },
      error => {
        console.error('Failed to send email:', error);
        // Gérer les erreurs ici, par exemple afficher un message d'erreur à l'utilisateur
      }
    );
  }
}
