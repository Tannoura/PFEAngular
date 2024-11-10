import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthentificationService } from 'src/app/services/authentification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  form: FormGroup;
  message: string | null = null;
  token: string | null = null;
  showPassword: boolean = false; // New property to manage password visibility

  constructor(
    private fb: FormBuilder,
    private passwordResetService: AuthentificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
    }, { });
  }




  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log('Query Params:', params);  // Debugging line
      this.token = params['token'];
      console.log('Token received:', this.token);  // Debugging line
    });
  }


  togglePassword() {
    this.showPassword = !this.showPassword;
  }


  onSubmit() {
    console.log(this.token);
    if (this.form.valid && this.token) {


    }

    if (this.form.valid && this.token) {
      this.passwordResetService.resetPassword(this.token, this.form.value.password).subscribe(
        response =>{
          console.log(response)
        }

        ,error => {
          console.log(error);
          this.router.navigate(['/loginRegister']);

        }

      );
    }

}
  }
