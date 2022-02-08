import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { CrearVeterinariasComponent } from 'src/app/componentes/crear-veterinarias/crear-veterinarias.component';
import { EditarVeterinariasComponent } from 'src/app/componentes/editar-veterinarias/editar-veterinarias.component';
import { veterinariaI } from 'src/app/interfaces/veterinaria.interface';
import { VeterinariasService } from 'src/app/services/veterinarias.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-veterinarias',
  templateUrl: './veterinarias.component.html',
  styleUrls: ['./veterinarias.component.scss'],
})
export class VeterinariasComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  //dataSource: MatTableDataSource<any>;
  filtroVeterinaria;
  veterinarias;
  dataSource:MatTableDataSource<any>;
  displayedColumns: string[] = [
    'nombre',
    'direccion',
    'horario',
    'servicios',
    'formaPago',
    'aprobado',
    'edit',
    'delete',
    'descargarPDF',
  ];

  constructor(
    private veterniariasservice: VeterinariasService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
  
    this.getAllVeterinarias();
  }


  getAllVeterinarias() {
    this.veterniariasservice.getveterinarias().subscribe((res) => {
      this.veterinarias = res;
      this.dataSource = new MatTableDataSource<veterinariaI>(this.veterinarias);
      this.dataSource=new MatTableDataSource<veterinariaI>(this.veterinarias);
      this.dataSource.paginator = this.paginator;
    });
  }

  filterData($event:any){
    this.dataSource.filter=$event.target.value;
    
  }

  crearVeterinaria() {
    const dialogRef = this.dialog.open(CrearVeterinariasComponent, {
      width: '1100px',
      height: '550px',
      disableClose: true,
      data: {
        editar: false,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {});
  }

  editarVeterinaria(element) {
    const dialogRef = this.dialog.open(EditarVeterinariasComponent, {
      width: '1100px',
      height: '550px',
      disableClose: true,
      data: {
        veterinaria: element,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {});
  }

  confirmarDeleteVeterinaria(element) {
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
        this.eliminarPDF(element.id);
        this.eliminarveterinaria(element);
      }
    });
  }

  eliminarveterinaria(element: veterinariaI) {
    this.veterniariasservice
      .eliminarveterinaria(element.id)
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
    this.veterniariasservice
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
  

  eliminarPDF(idveterinaria) {
    this.veterniariasservice
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
}
