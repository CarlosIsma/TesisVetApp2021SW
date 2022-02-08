import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginUserFormGroup: FormGroup;
  show = false;

  constructor(private formBuilder: FormBuilder, private authSrv: AuthService) {}

  ngOnInit() {
    this.loginUserFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(15),
        ],
      ],
    });
  }

  password() {
    this.show = !this.show;
  }

  login(formData: FormData) {
    this.authSrv.login(formData['email'], formData['password']);
  }
}
