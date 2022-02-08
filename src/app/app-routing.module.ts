import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './modules/login/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'consolaV',
    pathMatch: 'full',
  },

  {
    path:'login',component:LoginComponent

  },
  {
    path: 'consolaV',
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
    loadChildren: () =>
      import('./modules/default/default.module').then((m) => m.DefaultModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./modules/login/login.module').then((m) => m.LoginModule),
  },
  { path: 'shared', loadChildren: () => import('./modules/shared/shared.module').then(m => m.SharedModule) },
  {
    path: '**',
    loadChildren: () =>
      import('./modules/login/login.module').then((m) => m.LoginModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
