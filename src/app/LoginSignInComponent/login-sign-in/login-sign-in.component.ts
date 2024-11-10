import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IAlert, NgbdAlertBasicComponent } from 'src/app/component/alert/alert.component';
import { Admin } from 'src/app/modeles/Admin';
import { AuthenticationResponse } from 'src/app/modeles/AuthenticationResponse';
import { Role } from 'src/app/modeles/Role';
import { Salarie } from 'src/app/modeles/Salarie';
import { AuthentificationService } from 'src/app/services/authentification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-sign-in',
  templateUrl: './login-sign-in.component.html',
  styleUrls: ['./login-sign-in.component.scss']
})
export class LoginSignInComponent implements OnInit{
  constructor(private authService:AuthentificationService,private router:Router) { }
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
    password: '',
    role: Role.SALARIE,
    poste: {
      id: 0,
      specialite: ''
    }
  };



  alertVisible: boolean = false;
  alertMessage: string = '';


  ngOnInit(): void {
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

  onSignUp(event: Event): void {
    event.preventDefault();
    console.log('Sign Up form submitted');


    // Ajoutez ici le code pour gérer la soumission du formulaire de création de compte
    this.authService.registerSalarie(this.salarie).subscribe((response: AuthenticationResponse) => {
      // Gérer la réponse si nécessaire
      console.log('Registration successful:', response);
      this.showSuccessAlert();

      setTimeout(() => {
        this.onSignInClick();},
        3500);

    }, error => {
      // Gérer les erreurs si nécessaire
      console.error('Registration failed:', error);
      if (error.status === 403) {

        this.alertMessage = 'Vérifier la forme votre adresse mail si elle est déjà utilisée ';
        this.alertVisible = true;

        setTimeout(() => {
          this.alertVisible = false},
          5000);
      }
    });
  }

  onSignIn(event: Event): void {
    event.preventDefault();
    console.log('Sign In form submitted');

    // Vérification si c'est un admin ou un salarié
    if (this.admin.username && this.admin.password) {
      this.authService.loginAdmin(this.admin).subscribe(response => {
        console.log('Connexion réussie pour l\'admin ! Token : ', response.token);
        localStorage.setItem('token', response.token);

        this.authService.loadProfile();
        localStorage.setItem('id',this.authService.userId);

        this.router.navigate(['/dashboard']);
       // this.authService.loadProfile(response.token);
        //console.log(this.authService.UserRole) ;
      }, error => {
        console.error('Erreur lors de la connexion de l\'admin:', error);
        if (error.status === 403) {

          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Quelque chose s'est mal passé!",
            footer: '<a> Vérifiez vos identifiants et réessayez</a>'
          });
        }
      }

    );
    } else if (this.salarie.username && this.salarie.password) {
      this.authService.loginSalarie(this.salarie).subscribe(response => {
        console.log('Connexion réussie pour le salarié ! Token : ', response.token);
        localStorage.setItem('token', response.token);
        this.authService.loadProfile();
        localStorage.setItem('id',this.authService.userId);

        this.router.navigate(['/dashboard']);
       //this.authService.loadProfile(response.token);
       //console.log(this.authService.UserRole) ;

       //ajoute un cas d'erreur
      }
      , error => {
        console.error('Erreur lors de la connexion du salarié:', error);
        if (error.status === 403) {

          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Quelque chose s'est mal passé!",
            footer: '<a > Vérifiez vos identifiants et réessayez</a>'
          });
        }

      });
    }
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
}
