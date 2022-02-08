import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DefaultRoutingModule } from './default-routing.module';
import { DefaultComponent } from './default.component';
import { AppMaterialModule } from 'src/app/app-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VeterinariasComponent } from 'src/app/pages/veterinarias/veterinarias.component';
import { UsuariosComponent } from 'src/app/pages/usuarios/usuarios.component';
import { MenuComponent } from 'src/app/componentes/menu/menu.component';
import { SharedModule } from '../shared/shared.module';
import { GmapComponent } from 'src/app/componentes/gmap/gmap.component';

@NgModule({
  declarations: [
    DefaultComponent,
    VeterinariasComponent,
    UsuariosComponent,
    MenuComponent,
  ],
  imports: [
    CommonModule,
    DefaultRoutingModule,
    AppMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
  ],
})
export class DefaultModule {}
