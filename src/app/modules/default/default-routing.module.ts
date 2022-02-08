import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from 'src/app/componentes/menu/menu.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { UsuariosComponent } from 'src/app/pages/usuarios/usuarios.component';
import { VeterinariasComponent } from 'src/app/pages/veterinarias/veterinarias.component';
import { DefaultComponent } from './default.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        data: { roles: ['admin'] },
        component: MenuComponent,
      },
      {
        path: 'veterinarias',
        canActivate: [AuthGuard],
        data: { roles: ['admin'] },
        component: VeterinariasComponent,
      },
      {
        path: 'usuarios',
        canActivate: [AuthGuard],
        data: { roles: ['admin'] },
        component: UsuariosComponent,
      },
      {
        path: '**',
        canActivate: [AuthGuard],
        data: { roles: ['admin'] },
        component: MenuComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefaultRoutingModule {}
