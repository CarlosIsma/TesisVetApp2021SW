import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { AppMaterialModule } from 'src/app/app-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginaInicioComponent } from 'src/app/pages/pagina-inicio/pagina-inicio.component';


@NgModule({
  declarations: [
    LoginComponent,
    PaginaInicioComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    AppMaterialModule,
    ReactiveFormsModule
  ]
})
export class LoginModule { }
