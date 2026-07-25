import { Component, AfterViewInit, Output, EventEmitter, ElementRef, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-control-geocoder';

@Component({
  selector: 'app-farm-map',
  template: `<div #mapContainer style="height: 450px; width: 100%; border-radius: 8px;"></div>`
})
export class FarmMapComponent implements AfterViewInit, OnChanges {
  // مدخلات للتحكم في سلوك الخريطة
  @Input() farmLocation?: { latitude?: number; longitude?: number; name?: string };
  @Input() nearbyFarms?: any[] = [];
  @Input() interactive: boolean = true;
  @Input() showSearchBox: boolean = true;
  @Input() zoomLevel: number = 10;

  @ViewChild('mapContainer') mapContainer!: ElementRef;
  @Output() locationSelected = new EventEmitter<{lat: number, lng: number, address: string}>();

  private map: any;
  private marker: any;
  private farmMarkers: L.Marker[] = [];

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map && (changes['farmLocation'] || changes['nearbyFarms'])) {
      this.updateMarkers();
    }
  }

  private initMap(): void {
    if (this.map) {
      this.map.remove();
    }

    const centerLat = this.farmLocation?.latitude ?? 36.2021;
    const centerLng = this.farmLocation?.longitude ?? 37.1343;

    this.map = L.map(this.mapContainer.nativeElement, {
      center: [centerLat, centerLng],
      zoom: this.zoomLevel,
      worldCopyJump: true,
      dragging: this.interactive,
      scrollWheelZoom: this.interactive,
      doubleClickZoom: this.interactive,
      boxZoom: this.interactive,
      touchZoom: this.interactive,
      keyboard: this.interactive
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      // attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    if (this.showSearchBox && this.interactive) {
      const geocoder = (L.Control as any).geocoder({
        defaultMarkGeocode: true,
        position: 'topright',
        placeholder: 'Search for a city or place...',
        errorMessage: 'Cannot reach this location!',
        showResultIcons: true,
        collapsed: false
      }).addTo(this.map);
    }

    if (this.interactive) {
      this.map.on('click', async (e: any) => {
        const { lat, lng } = e.latlng;
        if (this.marker) this.map.removeLayer(this.marker);
        this.marker = L.marker([lat, lng]).addTo(this.map);
        const address = await this.getAddress(lat, lng);
        this.locationSelected.emit({ lat, lng, address });
      });
    }

    this.updateMarkers();
  }

  private updateMarkers(): void {
    // تنظيف العلامات القديمة
    this.farmMarkers.forEach(marker => this.map.removeLayer(marker));
    this.farmMarkers = [];

    // 2. إضافة علامات المزارع المجاورة (إذا وجدت)
    if (this.nearbyFarms && this.nearbyFarms.length > 0 && !this.interactive) {
      this.nearbyFarms.forEach(farm => {
        if (farm.latitude && farm.longitude) {
          const color = this.getNearbyColor(farm.distance);
          const marker = L.marker([farm.latitude, farm.longitude], {
            icon: this.createCustomIcon(color, '🌾')
          }).addTo(this.map)

          const distanceText = farm.distance ? ` (${farm.distance.toFixed(1)} km)` : '';
          marker.bindTooltip(`<b>${farm.name}</b><br>nearbyFarm`, {
            permanent: false,
            direction: 'top',
            offset: [0, -15],
            sticky: true
          });
          this.farmMarkers.push(marker);
        }
      });
    }

    // 1. إضافة علامة المزرعة الرئيسية (إذا وجدت)
    if (this.farmLocation?.latitude && this.farmLocation?.longitude)
      {
      const mainIcon = this.createCustomIcon('#4caf50', '★');
      const mainMarker = L.marker([this.farmLocation.latitude, this.farmLocation.longitude], { icon: mainIcon })
        .addTo(this.map)
        .bindTooltip(`<b>${this.farmLocation.name || 'Farm'}</b><br>your farm`, {
        permanent: false,
        direction: 'top',
        offset: [0, -15],
        sticky: true
      });
      this.farmMarkers.push(mainMarker);
    }

    if (this.farmMarkers.length > 1) {
      const bounds = L.latLngBounds(this.farmMarkers.map(m => m.getLatLng()));
      this.map.fitBounds(bounds);
    } else if (this.farmLocation?.latitude && this.farmLocation?.longitude) {
      this.map.setView([this.farmLocation.latitude, this.farmLocation.longitude], this.zoomLevel);
    }
  }

  private getNearbyColor(distance?: number): string {
    if (!distance) return '#ff9800';
    if (distance <= 5) return '#2196f3';
    if (distance <= 10) return '#ff9800';
    return '#f44336';
  }

  private createCustomIcon(color: string, symbol: string = '📍'): L.DivIcon {
    return L.divIcon({
      html: `<div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 16px;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">${symbol}</div>`,
      className: 'custom-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    });
  }

  private async getAddress(lat: number, lng: number): Promise<string> {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`);
      const data = await response.json();
      // استخراج عنوان مختصر (مدينة، بلد)
      const address = data.address;
      const city = address?.city || address?.town || address?.village || '';
      const country = address?.country || '';
      if (city && country) {
        return `${city}, ${country}`;
      }
      return data.display_name || `${lat}, ${lng}`;
    } catch {
      return `${lat}, ${lng}`;
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
