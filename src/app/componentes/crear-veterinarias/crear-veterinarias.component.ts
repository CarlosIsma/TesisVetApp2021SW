import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { veterinariaI } from 'src/app/interfaces/veterinaria.interface';
import { VeterinariasService } from 'src/app/services/veterinarias.service';
import Swal from 'sweetalert2';
import { GmapComponent } from '../gmap/gmap.component';

@Component({
  selector: 'app-crear-veterinarias',
  templateUrl: './crear-veterinarias.component.html',
  styleUrls: ['./crear-veterinarias.component.scss'],
})
export class CrearVeterinariasComponent implements OnInit {
  nuevaVeterinariaForm: FormGroup = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
    direccion: ['', [Validators.required,Validators.pattern('^[a-zA-Z 0-9]*$')]],
    referencia: ['',[Validators.pattern('^[a-zA-Z 0-9]*$')]],
    sector: ['', [Validators.required]],
    formaPago: ['', [Validators.required]],
    servicios: ['', [Validators.required,Validators.pattern('^[a-zA-Z 0-9]*$')]],
    horaApertura: ['', [Validators.required]],
    horaCierre: ['', [Validators.required]],
    latitud: ['', [Validators.required]],
    longitud: ['', [Validators.required]],
  });

  coordsActivas = false;

  imagenSeleccionada: any;
  urlImagen: string;
  errorIMG = false;
  errorPDF = false;
  pdfSeleccionado: any;
  urlPDF: string;
  url;

  constructor(
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CrearVeterinariasComponent>,
    private formBuilder: FormBuilder,
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private veterinariasService: VeterinariasService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  comprobarHorarioVeterinaria() {
    if (
      this.nuevaVeterinariaForm.value.horaApertura >=
      this.nuevaVeterinariaForm.value.horaCierre
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Alerta',
        text: 'El horario de apertura no puede ser mayor o igual al horario de cierre',
      });
    } else {
      this.comprobarImagenYPDF();
    }
  }

  comprobarImagenYPDF() {
    if (this.imagenSeleccionada !== undefined) {
      if (this.pdfSeleccionado !== undefined) {
        let idVeterinaria = this.db.createId();
        this.guardarImagen(idVeterinaria, this.imagenSeleccionada);
      } else {
        this.errorPDF = true;
      }
    } else {
      this.errorIMG = true;
    }
  }

  guardarImagen(idVeterinaria, image) {
    let filePath = 'veterinarias/' + 'IMG-' + idVeterinaria;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, image);

    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.urlImagen = url;
            this.guardarPDF(idVeterinaria, this.pdfSeleccionado);
          });
        })
      )
      .subscribe();
  }

  guardarPDF(idVeterinaria, pdf) {
    let filePath = 'veterinarias/' + 'PDF-' + idVeterinaria;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, pdf);

    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.urlPDF = url;
            this.crearVeterinaria(idVeterinaria);
          });
        })
      )
      .subscribe();
  }

  crearVeterinaria(idVeterinaria: string) {
    let nuevaVet: veterinariaI = this.nuevaVeterinariaForm.value;

    this.veterinariasService
      .registrarVeterinaria(
        idVeterinaria,
        nuevaVet,
        this.urlImagen,
        this.urlPDF
      )
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

  getCoordenadas() {
    let dialogRef;

    if (this.coordsActivas) {
      dialogRef = this.dialog.open(GmapComponent, {
        width: '950px',
        height: '650px',
        disableClose: true,
        data: {
          dest_lat: this.nuevaVeterinariaForm.controls.latitud.value,
          dest_lng: this.nuevaVeterinariaForm.controls.longitud.value,
          direccion: '',
          editar: true,
        },
      });
    } else {
      dialogRef = this.dialog.open(GmapComponent, {
        width: '950px',
        height: '650px',
        disableClose: true,
        data: {
          dest_lat: 0,
          dest_lng: 0,
          direccion: '',
          editar: false,
        },
      });
    }

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.nuevaVeterinariaForm.controls.latitud.setValue(data.dest_lat);
        this.nuevaVeterinariaForm.controls.longitud.setValue(data.dest_lng);
        this.coordsActivas = true;
      }
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

  seleccionarPDf(event: any) {
    this.pdfSeleccionado = event.target.files[0];
  }

  reset() {
    this.dialogRef.close();
  }
}
