import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearUsuariosComponent } from './crear-usuarios.component';

describe('CrearUsuariosComponent', () => {
  let component: CrearUsuariosComponent;
  let fixture: ComponentFixture<CrearUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearUsuariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Crea el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('Debería verificarque los campos requeridos: cedula, nombre, apellido, correo electrónico, contraseña, repetir contraseña, tipo de usuario e imagen', () => {

    const component2= fixture.componentInstance;
    const cp= {cedula: "1723585939", nombre: 'Carlos', apellido :"Lucero", correo: "carlos.lucero26@hotmail.com", rol: "veterinario",   }
    const verificacion = component2.createMailUser(cp.cedula, cp.nombre, cp.apellido, cp.correo, cp.rol);

    expect(verificacion['required']).toBeFalsy();
    expect(verificacion ['cedula']).toBeFalsy();
    expect(verificacion ['nombre']).toBeFalsy();
    expect(verificacion ['apellido']).toBeFalsy();
    expect(verificacion ['correo']).toBeFalsy();
    expect(verificacion ['rol']).toBeDefined();

  });



});
function AuthServiceService(AuthServiceService: any) {
  throw new Error('Function not implemented.');
}

