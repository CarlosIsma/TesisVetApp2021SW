import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaginaInicioComponent } from 'src/app/pages/pagina-inicio/pagina-inicio.component';
import { LoginComponent } from './login.component';

const routes: Routes = [
  { path: '', component: PaginaInicioComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}
