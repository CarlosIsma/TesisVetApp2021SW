export interface veterinariaI {
  id?: string;
  nombre: string;
  direccion: string;
  telefono: string;
  horario: string;
  referencia: string;
  imagen: string;
  formasPago: string;
  servicios: string;
  coordenadas: any;
  pdfRUC: string;
  sector: string;
  formaPago: string;
  horaApertura: string;
  horaCierre: string;
  position?: any;
  aprobado: boolean;
  mensajeAprobacionChecked?: boolean;
  mensajeAprobacion?: string;
}
