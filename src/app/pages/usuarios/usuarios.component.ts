import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { CrearUsuariosComponent } from 'src/app/componentes/crear-usuarios/crear-usuarios.component';
import { EditarUsuariosComponent } from 'src/app/componentes/editar-usuarios/editar-usuarios.component';
import { usuariosI } from 'src/app/interfaces/usuarios.interface';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  veterinarias;
  dataSource:MatTableDataSource<any>;
  displayedColumns: string[] = [
    'cedula',
    'nombre',
    'apellido',
    'correo',
    'rol',
    'aprobado',
    'edit',
    'delete',
  ];

  constructor(
    private usuariosservice: UsuariosService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getAllUsuarios();
  }

  getAllUsuarios() {
    this.usuariosservice.getAllUsuarios().subscribe((res) => {
      this.veterinarias = res;
      this.dataSource = new MatTableDataSource<usuariosI>(this.veterinarias);
      this.dataSource=new MatTableDataSource<usuariosI>(this.veterinarias);
      this.dataSource.paginator = this.paginator;
    });
  }
  filterData($event:any){
    this.dataSource.filter=$event.target.value;
    
  }

  crearUsuario() {
    const dialogRef = this.dialog.open(CrearUsuariosComponent, {
      width: '1100px',
      height: '550px',
      disableClose: true,
      data: {
        editar: false,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {});
  }

  editarUsuario(element) {
    const dialogRef = this.dialog.open(EditarUsuariosComponent, {
      width: '1100px',
      height: '550px',
      disableClose: true,
      data: {
        usuario: element,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {});
  }

  confirmarDeleteUsuario(element) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No se podrá deshacer esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarimagen(element.id);
        this.eliminarusuario(element);
      }
    });
  }

  eliminarusuario(element: usuariosI) {
    this.usuariosservice
      .eliminarusuario(element.id)
      .then((res) => {
        this._snackBar.open('Veterinaria eliminada exitosamente!', '', {
          duration: 3000,
        });
      })
      .catch((err) => {
        console.log('Error al eliminar el registro de la base de datos', err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error al eliminar el registro de la base de datos',
        });
      });
  }

  eliminarimagen(idveterinaria) {
    this.usuariosservice
      .eliminarimagenusuario(idveterinaria)
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
}
