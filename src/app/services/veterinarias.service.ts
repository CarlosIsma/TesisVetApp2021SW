import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { map } from 'rxjs/operators';
import { veterinariaI } from '../interfaces/veterinaria.interface';

@Injectable({
  providedIn: 'root',
})
export class VeterinariasService {

  filtroVeterinaria:'';

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  getveterinarias() {
    return this.db
      .collection<veterinariaI>('veterinarias')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  registrarVeterinaria(
    idVeterinaria: string,
    data,
    urlImagen: string,
    urlPDF: string
  ) {
    let coordenadas = {
      0: Number(data.latitud),
      1: Number(data.longitud),
    };

    let nuevaVeterinaria = {
      id: idVeterinaria,
      nombre: data.nombre,
      direccion: data.direccion,
      referencia: data.referencia,
      sector: data.sector,
      formaPago: data.formaPago,
      servicios: data.servicios,
      horaApertura: data.horaApertura,
      horaCierre: data.horaCierre,
      imagen: urlImagen,
      pdfRUC: urlPDF,
      position: coordenadas,
      aprobado: false,
    };

    return this.db.doc(`veterinarias/` + idVeterinaria).set(nuevaVeterinaria);
  }

  eliminarveterinaria(id) {
    return this.db.doc(`veterinarias/` + id).delete();
  }

  eliminarimagen(idveterianria) {
    let filePath = 'veterinarias/' + 'IMG-' + idveterianria;
    const fileRef = this.storage.ref(filePath);

    return fileRef.delete();
  }

  eliminarpdf(idPDF) {
    let filePath = 'veterinarias/' + 'PDF-' + idPDF;
    const fileRef = this.storage.ref(filePath);

    return fileRef.delete();
  }

  actualizarveterinaria(
    data,
    idveterinaria,
    urlImagen,
    urlPDF,
    mensajeAprobacionChecked
  ) {
    let coordenadas = {
      0: Number(data.latitud),
      1: Number(data.longitud),
    };

    return this.db.doc(`veterinarias/` + idveterinaria).update({
      nombre: data.nombre,
      direccion: data.direccion,
      referencia: data.referencia,
      sector: data.sector,
      formaPago: data.formaPago,
      servicios: data.servicios,
      horaApertura: data.horaApertura,
      horaCierre: data.horaCierre,
      imagen: urlImagen,
      pdfRUC: urlPDF,
      position: coordenadas,
      aprobado: data.aprobado,
      mensajeAprobacionChecked: mensajeAprobacionChecked,
      mensajeAprobacion: data.mensajeAprobacion,
    });
  }
}
