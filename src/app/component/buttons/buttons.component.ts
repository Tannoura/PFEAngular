import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { Router } from '@angular/router';
import { EmailService } from 'src/app/services/email.service';
import { Salarie } from 'src/app/modeles/Salarie';
import { Role } from 'src/app/modeles/Role';


@Component({
  selector: 'app-ngbd-buttons',
  standalone: true,
  templateUrl: 'buttons.component.html',
  imports: [
    FormsModule, ReactiveFormsModule , NgFor,NgIf
  ],
  styleUrls: ['button.component.scss']
})
export class NgbdButtonsComponent implements OnInit {

  passwordForm!: FormGroup;

  constructor(private authService:AuthentificationService,
    private router:Router,private emailService:EmailService,private fb: UntypedFormBuilder) {

      this.passwordForm = this.fb.group({
        lastname: ['', Validators.required],
        firstname: ['', Validators.required],
        username: [{ value: '', disabled: true }, Validators.required],
        password: ['', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'), // Au moins un chiffre et une lettre, sans espaces
          this.noWhitespaceValidator
        ]]
      });
    }

    noWhitespaceValidator(control: any) {
      const isWhitespace = (control.value || '').indexOf(' ') >= 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    }

  ngOnInit(): void {

    this.authService.loadProfile();
    this.salarie.firstname=this.authService.firstname;
    this.salarie.lastname=this.authService.lastname;
    this.salarie.username=this.authService.username;
    this.salarie.id=this.authService.userId;


     // Initialiser les valeurs de formulaire avec les données de authService
     this.passwordForm.patchValue({
      username: this.authService.username,
      firstname: this.authService.firstname,
      lastname: this.authService.lastname

    });

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


  updateUser() {
    if (this.passwordForm.valid) {
      const updatedSalarie = { ...this.salarie, ...this.passwordForm.value };
      this.authService.updateUser(this.salarie.id, updatedSalarie)
        .subscribe(updatedUser => {
          console.log('Utilisateur mis à jour avec succès :', updatedUser);
          this.authService.loadProfile();
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }, error => {
          console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
        });
    }
  }
}
