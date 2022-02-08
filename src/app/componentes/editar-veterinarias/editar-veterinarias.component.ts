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
import { veterinariaI } from 'src/app/interfaces/veterinaria.interface';
import { VeterinariasService } from 'src/app/services/veterinarias.service';
import Swal from 'sweetalert2';
import { GmapComponent } from '../gmap/gmap.component';

@Component({
  selector: 'app-editar-veterinarias',
  templateUrl: './editar-veterinarias.component.html',
  styleUrls: ['./editar-veterinarias.component.scss'],
})
export class EditarVeterinariasComponent implements OnInit {
  crearVeterinaria(nombre: string) {
    throw new Error('Method not implemented.');
  }
  editarVeterinariaForm: FormGroup = this.formBuilder.group({
    nombre: ['', [Validators.required,Validators.pattern('^[a-zA-Z ]*$')]],
    direccion: ['', [Validators.required,Validators.pattern('^[a-zA-Z 0-9]*$')]],
    referencia: ['',[Validators.pattern('^[a-zA-Z 0-9]*$')]],
    sector: ['', [Validators.required]],
    formaPago: ['', [Validators.required]],
    servicios: ['', [Validators.required,Validators.pattern('^[a-zA-Z 0-9]*$')]],
    horaApertura: ['', [Validators.required]],
    horaCierre: ['', [Validators.required]],
    latitud: ['', [Validators.required]],
    longitud: ['', [Validators.required]],
    aprobado: ['', [Validators.required]],
    mensajeAprobacion: ['',[Validators.pattern('^[a-zA-Z ]*$')]],
  });

  coordsActivas = false;

  idveterinaria: string;
  imagenSeleccionada: any;
  imagenChecked = false;
  pdfChecked = false;
  urlImagen: string;
  errorIMG = false;
  errorPDF = false;
  pdfSeleccionado: any;
  urlPDF: string;
  url;
  mensajeAprobacionChecked = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EditarVeterinariasComponent>,
    private formBuilder: FormBuilder,
    private storage: AngularFireStorage,
    private veterinariasService: VeterinariasService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.datosVeterinariaActual(this.data.veterinaria);
  }

  datosVeterinariaActual(element: veterinariaI) {
    this.idveterinaria = element.id;
    this.urlImagen = element.imagen;
    this.urlPDF = element.pdfRUC;
    this.url = element.imagen; //Miniatura de la imagen guardada
    this.coordsActivas = true;

    this.editarVeterinariaForm.controls.nombre.setValue(element.nombre);
    this.editarVeterinariaForm.controls.direccion.setValue(element.direccion);
    this.editarVeterinariaForm.controls.referencia.setValue(element.referencia);
    this.editarVeterinariaForm.controls.sector.setValue(element.sector);
    this.editarVeterinariaForm.controls.formaPago.setValue(element.formaPago);
    this.editarVeterinariaForm.controls.servicios.setValue(element.servicios);
    this.editarVeterinariaForm.controls.aprobado.setValue(element.aprobado);
    this.editarVeterinariaForm.controls.horaApertura.setValue(
      element.horaApertura
    );
    this.editarVeterinariaForm.controls.horaCierre.setValue(element.horaCierre);
    this.editarVeterinariaForm.controls.latitud.setValue(element.position[0]);
    this.editarVeterinariaForm.controls.longitud.setValue(element.position[1]);
    this.editarVeterinariaForm.controls.mensajeAprobacion.setValue(
      element.mensajeAprobacion
    );
  }

  comprobarMensajeComprobacion() {
    if (this.mensajeAprobacionChecked) {
      if (this.editarVeterinariaForm.controls.mensajeAprobacion.value === '') {
        Swal.fire({
          icon: 'error',
          title: 'Alerta',
          text: 'El mensaje no puede estar vacío',
        });
      } else {
        this.comprobarHorarioVeterinaria();
      }
    } else {
      this.comprobarHorarioVeterinaria();
    }
  }

  comprobarHorarioVeterinaria() {
    if (
      this.editarVeterinariaForm.value.horaApertura >=
      this.editarVeterinariaForm.value.horaCierre
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
    if (this.imagenSeleccionada === undefined && this.imagenChecked === true) {
      this.errorIMG = true;
    } else if (this.pdfSeleccionado === undefined && this.pdfChecked === true) {
      this.errorPDF = true;
    } else {
      if (this.imagenChecked) {
        this.eliminarimagen(this.idveterinaria);
        this.subirimagen(this.idveterinaria, this.imagenSeleccionada);
      } else if (this.pdfChecked) {
        this.eliminarPDF(this.idveterinaria);
        this.subirPDF(this.idveterinaria, this.pdfSeleccionado);
      } else {
        this.editarveterinaria();
      }
    }
  }

  //MÉTODOS DE EDICIÓN DE LA IMAGEN

  eliminarimagen(idveterinaria) {
    this.veterinariasService
      .eliminarimagen(idveterinaria)
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

  subirimagen(idveterianria, imagen) {
    let filePath = 'veterinarias/' + 'IMG-' + idveterianria;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, imagen);

    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.urlImagen = url;

            if (this.pdfChecked) {
              this.eliminarPDF(this.idveterinaria);
              this.subirPDF(this.idveterinaria, this.pdfSeleccionado);
            } else {
              this.editarveterinaria();
            }
          });
        })
      )
      .subscribe();
  }

  //MÉTODOS DE EDICIÓN DEL PDF

  eliminarPDF(idveterinaria) {
    this.veterinariasService
      .eliminarpdf(idveterinaria)
      .toPromise()
      .then((res) => {
        console.log('Archivo PDF eliminado satisfactoriamente!');
        return;
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Alerta',
          text: 'Error al eliminar el archivo PDF de la base de datos',
        });
      });
  }

  subirPDF(idveterianria, pdf) {
    let filePath = 'veterinarias/' + 'PDF-' + idveterianria;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, pdf);

    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.urlPDF = url;
            this.editarveterinaria();
          });
        })
      )
      .subscribe();
  }

  //MÉTODO PARA ACTUALIZAR LA VETERINARIA
  editarveterinaria() {
    let veterinariaActual: veterinariaI = this.editarVeterinariaForm.value;

    this.veterinariasService
      .actualizarveterinaria(
        veterinariaActual,
        this.idveterinaria,
        this.urlImagen,
        this.urlPDF,
        this.mensajeAprobacionChecked
      )
      .then((res) => {
        this._snackBar.open('Veterinaria actualizada exitosamente!', '', {
          duration: 3000,
        });
        this.reset();
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Alerta',
          text: 'No se pudo actualizar la veterinaria',
        });
      });
  }

  getCoordenadas() {
    let dialogRef;

    if (this.coordsActivas) {
      dialogRef = this.dialog.open(GmapComponent, {
        width: '1200px',
        height: '570px',
        disableClose: true,
        data: {
          dest_lat: this.editarVeterinariaForm.controls.latitud.value,
          dest_lng: this.editarVeterinariaForm.controls.longitud.value,
          direccion: '',
          editar: true,
        },
      });
    } else {
      dialogRef = this.dialog.open(GmapComponent, {
        width: '1200px',
        height: '570px',
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
        this.editarVeterinariaForm.controls.latitud.setValue(data.dest_lat);
        this.editarVeterinariaForm.controls.longitud.setValue(data.dest_lng);
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

  checkImagen(event) {
    let checked = event.checked;

    if (checked) {
      this.imagenChecked = checked;
    } else {
      this.imagenChecked = checked;
    }
  }

  checkPDF(event) {
    let checked = event.checked;

    if (checked) {
      this.pdfChecked = true;
    } else {
      this.pdfChecked = false;
    }
  }

  checkMensajeAprobacion(event) {
    let checked = event.checked;

    if (checked) {
      this.mensajeAprobacionChecked = true;
    } else {
      this.mensajeAprobacionChecked = false;
    }
  }

  reset() {
    this.dialogRef.close();
  }
}
