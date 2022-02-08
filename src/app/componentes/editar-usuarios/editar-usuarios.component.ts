import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { usuariosI } from 'src/app/interfaces/usuarios.interface';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-usuarios',
  templateUrl: './editar-usuarios.component.html',
  styleUrls: ['./editar-usuarios.component.scss'],
})
export class EditarUsuariosComponent implements OnInit {
  createMailUser(cedula: string, nombre: string, apellido: string, correo: string, rol: string) {
    throw new Error('Method not implemented.');
  }
  editarUsuarioForm: FormGroup = this.formBuilder.group({
    cedula: [
      '',
      [Validators.required, Validators.minLength(10), Validators.maxLength(10)],
    ],
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    rol: ['', [Validators.required]],
    aprobado: ['', [Validators.required]],
  });

  idusuario: string;
  imagenSeleccionada: any;
  imagenChecked = false;
  urlImagen: string;
  errorIMG = false;
  url;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EditarUsuariosComponent>,
    private formBuilder: FormBuilder,
    private storage: AngularFireStorage,
    private usuariosservice: UsuariosService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.datosUsuarioActual(this.data.usuario);
  }

  datosUsuarioActual(element: usuariosI) {
    this.idusuario = element.id;
    this.urlImagen = element.imagen;
    this.url = element.imagen; //Miniatura de la imagen guardada

    this.editarUsuarioForm.controls.cedula.setValue(element.cedula);
    this.editarUsuarioForm.controls.nombre.setValue(element.nombre);
    this.editarUsuarioForm.controls.apellido.setValue(element.apellido);
    this.editarUsuarioForm.controls.correo.setValue(element.correo);
    this.editarUsuarioForm.controls.rol.setValue(element.rol);
    this.editarUsuarioForm.controls.aprobado.setValue(element.aprobado);
  }

  comprobarImagen() {
    if (this.imagenSeleccionada === undefined && this.imagenChecked === true) {
      this.errorIMG = true;
    } else {
      if (this.imagenChecked) {
        this.eliminarimagen(this.idusuario);
        this.subirimagen(this.idusuario, this.imagenSeleccionada);
      } else {
        this.editarusuario();
      }
    }
  }

  //MÉTODOS DE EDICIÓN DE LA IMAGEN

  eliminarimagen(idusuarios) {
    this.usuariosservice
      .eliminarimagenusuario(idusuarios)
      .toPromise()
      .then((res) => {
        console.log('Imagen eliminada satisfactoriamente!');
        return;
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Alerta',
          text: 'Error al eliminar la imagen de la base de datos',
        });
      });
  }

  subirimagen(idusuario, imagen) {
    let filePath = 'usuarios-movil/' + idusuario;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, imagen);

    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.urlImagen = url;

            this.editarusuario();
          });
        })
      )
      .subscribe();
  }

  //MÉTODO PARA ACTUALIZAR EL USUARIO
  editarusuario() {
    let usuarioActualizado: usuariosI = this.editarUsuarioForm.value;

    this.usuariosservice
      .actualizarusuario(usuarioActualizado, this.idusuario, this.urlImagen)
      .then((res) => {
        this._snackBar.open('Usuario actualizado exitosamente!', '', {
          duration: 3000,
        });
        this.reset();
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Alerta',
          text: 'No se pudo actualizar el usuario',
        });
      });
  }

  showPreview(event: any) {
    this.imagenSeleccionada = event.target.files[0];
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.url = reader.result;
      };
    }
  }

  checkImagen(event) {
    let checked = event.checked;

    if (checked) {
      this.imagenChecked = checked;
    } else {
      this.imagenChecked = checked;
    }
  }

  reset() {
    this.dialogRef.close();
  }
}
