import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarUsuariosComponent } from './editar-usuarios.component';

describe('EditarUsuariosComponent', () => {
  let component: EditarUsuariosComponent;
  let fixture: ComponentFixture<EditarUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarUsuariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarUsuariosComponent);
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
