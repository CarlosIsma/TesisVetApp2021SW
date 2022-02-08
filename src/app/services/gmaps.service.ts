import { Injectable } from '@angular/core';

declare let google;

@Injectable({
  providedIn: 'root',
})
export class GmapsService {
  geocoder = new google.maps.Geocoder();
  map;

  constructor() {}

  async cargarMapa() {
    const coordinates = new google.maps.LatLng(-0.1806532, -78.4678382);
    const mapOptions = (google.maps.MapOptions = {
      center: coordinates,
      zoom: 14,
      streetViewControl: false,
      gestureHandling: 'greedy',
      fullscreenControl: false,
      mapTypeControl: false,
      styles: [
        {
          featureType: 'poi.business',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
      ],
      mapTypeId: 'roadmap',
    });
    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var centerControlDiv = document.createElement('div');

    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
      centerControlDiv
    );
  }
}
