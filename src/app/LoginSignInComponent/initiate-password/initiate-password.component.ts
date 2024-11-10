import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/services/authentification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-initiate-password',
  templateUrl: './initiate-password.component.html',
  styleUrls: ['./initiate-password.component.scss']
})
export class InitiatePasswordComponent {
  form: FormGroup;
  message: string | null = null;
  constructor(private fb: FormBuilder, private passwordResetService: AuthentificationService,private router:Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.passwordResetService.initiatePasswordReset(this.form.value.email).subscribe(
        (response: any) => {
          if (response) {
            const token = response.token;
            //this.router.navigate(['/forgetPassword'], { queryParams: { token: token } });
            this.router.navigateByUrl("/loginRegister")
          }
        },
        (error) => {
          // Affichez une alerte en cas d'erreur côté serveur ou réseau
          console.error('Error:', error);
          this.showErrorAlertEmail();
        }
      );
    }
  }

  private showErrorAlert(): void {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Erreur ",
      footer: 'Erreur application'
    });
  }

  private showErrorAlertEmail(): void {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Email Faux!",
      footer: 'Vérifier votre adresse mail'
    });
  }


}
