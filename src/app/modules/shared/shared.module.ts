import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from 'src/app/componentes/sidebar/sidebar.component';
import { HeaderComponent } from 'src/app/componentes/header/header.component';
import { RouterModule } from '@angular/router';
import { AppMaterialModule } from 'src/app/app-material.module';
import { NgxLoadingModule } from 'ngx-loading';
import { CrearVeterinariasComponent } from 'src/app/componentes/crear-veterinarias/crear-veterinarias.component';
import { CrearUsuariosComponent } from 'src/app/componentes/crear-usuarios/crear-usuarios.component';
import { GmapComponent } from 'src/app/componentes/gmap/gmap.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditarVeterinariasComponent } from 'src/app/componentes/editar-veterinarias/editar-veterinarias.component';
import { EditarUsuariosComponent } from 'src/app/componentes/editar-usuarios/editar-usuarios.component';

@NgModule({
  declarations: [
    SidebarComponent,
    HeaderComponent,
    CrearVeterinariasComponent,
    CrearUsuariosComponent,
    GmapComponent,
    EditarVeterinariasComponent,
    EditarUsuariosComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    AppMaterialModule,
    NgxLoadingModule.forRoot({}),
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [SidebarComponent, HeaderComponent],
})
export class SharedModule {
  constructor() {}

  ngOnInit(): void {}
}
