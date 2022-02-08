import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { map } from 'rxjs/operators';
import { usuariosI } from '../interfaces/usuarios.interface';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  getAllUsuarios() {
    return this.db
      .collection<usuariosI>('usuarios-movil')
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

  registrarusuario(idusuario: string, data, urlImagen: string) {
    let nuevoUsuario = {
      id: idusuario,
      cedula: data.cedula,
      nombre: data.nombre,
      apellido: data.apellido,
      correo: data.correo,
      rol: data.rol,
      aprobado: false,
      imagen: urlImagen,
    };

    console.log(nuevoUsuario);

    return this.db.doc(`usuarios-movil/` + idusuario).set(nuevoUsuario);
  }

  eliminarusuario(idusuario) {
    return this.db.doc(`usuarios-movil/` + idusuario).delete();
  }

  eliminarimagenusuario(idusuario) {
    let filePath = 'usuarios-movil/' + idusuario;
    const fileRef = this.storage.ref(filePath);

    return fileRef.delete();
  }

  actualizarusuario(data, idusuario, urlImagen) {
    return this.db.doc(`usuarios-movil/` + idusuario).update({
      cedula: data.cedula,
      nombre: data.nombre,
      apellido: data.apellido,
      correo: data.correo,
      rol: data.rol,
      aprobado: data.aprobado,
      imagen: urlImagen,
    });
  }
}
