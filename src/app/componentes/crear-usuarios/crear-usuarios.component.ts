import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { usuariosI } from 'src/app/interfaces/usuarios.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-usuarios',
  templateUrl: './crear-usuarios.component.html',
  styleUrls: ['./crear-usuarios.component.scss'],
})
export class CrearUsuariosComponent implements OnInit {
  createMailUser(mail: string, pass: string, name: string, lastname: string, role: string) {
    throw new Error('Method not implemented.');
  }
  nuevoUsuarioForm: FormGroup = this.formBuilder.group({
    cedula: [
      '',
      [Validators.required, Validators.minLength(10), Validators.maxLength(13)],
    ],
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    rol: ['', [Validators.required]],
  });

  imagenSeleccionada: any;
  urlImagen: string;
  errorIMG = false;
  url;

  constructor(
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CrearUsuariosComponent>,
    private formBuilder: FormBuilder,
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private usuariosservice: UsuariosService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  comprobarImagen() {
    if (this.imagenSeleccionada !== undefined) {
      let idusuario = this.db.createId();
      this.guardarImagen(idusuario, this.imagenSeleccionada);
    } else {
      this.errorIMG = true;
    }
  }

  guardarImagen(idusuario, image) {
    let filePath = 'usuarios-movil/' + idusuario;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, image);

    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.urlImagen = url;
            this.crearVeterinaria(idusuario);
          });
        })
      )
      .subscribe();
  }

  crearVeterinaria(idusuario: string) {
    let nuevouser: usuariosI = this.nuevoUsuarioForm.value;

    this.usuariosservice
      .registrarusuario(idusuario, nuevouser, this.urlImagen)
      .then(() => {
        this._snackBar.open('Veterinaria guardada', '', {
          duration: 2000,
        });
        this.reset();
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Alerta',
          text: 'Ocurrió un problema al registrar la veterinaria en la base de datos',
        });
        console.log('Error al guardar la veterinaria', err);
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

  reset() {
    this.dialogRef.close();
  }
}
