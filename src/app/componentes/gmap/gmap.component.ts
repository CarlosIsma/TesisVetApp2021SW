import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GmapsService } from 'src/app/services/gmaps.service';
import Swal from 'sweetalert2';

declare let google;

@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.scss'],
})
export class GmapComponent implements OnInit {
  geocoder = new google.maps.Geocoder();
  googleAutocomplete = new google.maps.places.AutocompleteService();
  map;
  errorMap = false;
  direccion = '';
  searchResults = [];
  coordinates = new google.maps.LatLng(0.3500804, -78.1295547);
  marker = new google.maps.Marker({
    position: this.coordinates,
    map: null,
    draggable: true,
  });
  clientCoords;
  editar = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<GmapComponent>,
    public gmapsSrv: GmapsService
  ) {}

  ngOnInit(): void {
    this.errorMap = false;
  }

  ngAfterViewInit() {
    this.gmapsSrv.cargarMapa();
    this.nuevoOEditar(this.data);
  }

  nuevoOEditar(data) {
    this.editar = data.editar;

    if (this.editar) {
      let coords = {
        lat: data.dest_lat,
        lng: data.dest_lng,
      };

      this.setEditMarker(coords);
    }
  }

  searchChanged(sitio: string) {
    if (sitio.trim().length) {
      let search = sitio;
      return this.googleAutocomplete.getPlacePredictions(
        { input: 'Ecuador, ' + search },
        (predictions) => {
          this.searchResults = predictions;
        }
      );
    }
  }

  getCoords(e: any) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: e.target.value }, (results) => {
      let coords = results[0].geometry.location;
      this.gmapsSrv.map.setCenter(coords);
      this.setMarker();
    });
  }

  setMarker() {
    if (this.marker.map !== null) {
      this.marker.setMap(null);
    }
    this.marker.setPosition(this.gmapsSrv.map.getCenter());
    this.marker.setMap(this.gmapsSrv.map);
    this.onGetDirection(this.marker.position);
    this.clientCoords = this.gmapsSrv.map.getCenter();
    this.data.dest_lat = this.clientCoords.lat();
    this.data.dest_lng = this.clientCoords.lng();
    google.maps.event.addListener(this.marker, 'dragstart', () => {});
    google.maps.event.addListener(this.marker, 'dragend', () => {
      this.clientCoords = this.marker.position;
      this.data.dest_lat = this.clientCoords.lat();
      this.data.dest_lng = this.clientCoords.lng();
      this.onGetDirection(this.marker.position);
    });
  }

  setEditMarker(coords) {
    this.gmapsSrv.map.setCenter(coords);

    if (this.marker.map !== null) {
      this.marker.setMap(null);
    }

    this.marker.setPosition(this.gmapsSrv.map.getCenter());
    this.marker.setMap(this.gmapsSrv.map);
    this.onGetDirection(this.marker.position);
    this.clientCoords = this.gmapsSrv.map.getCenter();
    this.data.dest_lat = this.clientCoords.lat();
    this.data.dest_lng = this.clientCoords.lng();
    google.maps.event.addListener(this.marker, 'dragstart', () => {});
    google.maps.event.addListener(this.marker, 'dragend', () => {
      this.clientCoords = this.marker.position;
      this.data.dest_lat = this.clientCoords.lat();
      this.data.dest_lng = this.clientCoords.lng();
      this.onGetDirection(this.marker.position);
    });
  }

  async onGetDirection(latLng) {
    await this.geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          const ubica = results[0].formatted_address;
          const ubicaStr = ubica.split(',', 2);
          this.direccion = ubicaStr;
          this.data.direccion = this.direccion;
        }
      }
    });
  }

  onAcceptClick() {
    if (
      this.data.dest_lat !== 0 &&
      this.data.dest_lng !== 0 &&
      this.data.direccion !== ''
    ) {
      this.dialogRef.close(this.data);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Alerta',
        text: 'No se pudo obtener ninguna dirección',
      });
      this.errorMap = true;
    }
  }

  reset() {
    this.dialogRef.close();
  }
}
