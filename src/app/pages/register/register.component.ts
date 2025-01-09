import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AngularFireAuthModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  loginForm: FormGroup;
  constructor(
    public auth: AuthService,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['+591', []],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      console.log('Datos del formulario:', this.loginForm.value);
  
      const { email, password } = this.loginForm.value;
  
      this.auth.registerUser(email, password, this.loginForm.value)
        .then((res: any) => console.log('Registro exitoso:', res))
        .catch((err: any) => console.error('Error en registro:', err));
    } else {
      console.log('Formulario inválido:', this.loginForm.value);
      alert('Revise sus datos.');
    }
  }}
