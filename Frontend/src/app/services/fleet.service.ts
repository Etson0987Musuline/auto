import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Vehicle, RouteItem, DriverStats } from '../models/fleet.model';

@Injectable({
  providedIn: 'root',
})
export class FleetService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  // --- VEHÍCULOS ---
  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.apiUrl}/vehiculos`).pipe(
      catchError(() => of(this.getMockVehicles()))
    );
  }

  getVehicle(id: number): Observable<Vehicle | null> {
    return this.http.get<Vehicle>(`${this.apiUrl}/vehiculos/${id}`).pipe(
      catchError(() => of(null))
    );
  }

  addVehicle(vehicle: Partial<Vehicle>): Observable<Vehicle> {
    return this.http.post<Vehicle>(`${this.apiUrl}/vehiculos`, vehicle).pipe(
      catchError(() => of({
        id: Date.now(),
        driverName: vehicle.driverName || 'Nuevo Conductor',
        driverIdCode: `236-542-${Math.floor(100 + Math.random() * 900)}`,
        vehicleModel: vehicle.vehicleModel || 'Volkswagen Transporter',
        status: vehicle.status || 'EN CAMINO',
        category: vehicle.category || 'FURGONETAS',
        payload: vehicle.payload || '2,885 lbs (1,308 kg)',
        loadVolume: vehicle.loadVolume || '0.55 in³ (5.8 m³)',
        loadLength: vehicle.loadLength || '117 in (2.97 m)',
        loadWidth: vehicle.loadWidth || '67 in (1.70 m)',
        licensePlate: vehicle.licensePlate || '6TRJ244',
        avatarUrl: vehicle.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        vehicleImageUrl: '/van.jpg'
      }))
    );
  }

  updateVehicle(id: number, vehicle: Partial<Vehicle>): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.apiUrl}/vehiculos/${id}`, vehicle).pipe(
      catchError(() => of({ id, ...vehicle } as Vehicle))
    );
  }

  deleteVehicle(id: number): Observable<{ success: boolean; message?: string }> {
    return this.http.delete<{ success: boolean; message?: string }>(`${this.apiUrl}/vehiculos/${id}`).pipe(
      catchError(() => of({ success: true, message: 'Eliminado localmente' }))
    );
  }

  // --- RUTAS ---
  getRoutes(vehicleId?: number): Observable<RouteItem[]> {
    const url = vehicleId 
      ? `${this.apiUrl}/rutas/vehiculo/${vehicleId}` 
      : `${this.apiUrl}/rutas`;
    return this.http.get<RouteItem[]>(url).pipe(
      catchError(() => of(this.getMockRoutes()))
    );
  }

  addRoute(route: Partial<RouteItem>): Observable<RouteItem> {
    return this.http.post<RouteItem>(`${this.apiUrl}/rutas`, route).pipe(
      catchError(() => of({
        id: Date.now(),
        routeCode: route.routeCode || '108-990',
        packageCount: route.packageCount || 80,
        origin: route.origin || 'Av. Javier Prado 1200',
        destination: route.destination || 'Av. Arequipa 3400',
        distance: route.distance || '1.1 mi (1.8 km)',
        timeLeft: route.timeLeft || '15 min',
        weight: route.weight || '1,500 lbs (680 kg)',
        volume: route.volume || '180 in³ (3.0 m³)',
        status: 'EN CURSO',
        isNowOnWay: true
      }))
    );
  }

  updateRoute(id: number, route: Partial<RouteItem>): Observable<RouteItem> {
    return this.http.put<RouteItem>(`${this.apiUrl}/rutas/${id}`, route).pipe(
      catchError(() => of({ id, ...route } as RouteItem))
    );
  }

  // --- ESTADÍSTICAS ---
  getDriverStats(driverId?: number): Observable<DriverStats> {
    const url = driverId 
      ? `${this.apiUrl}/conductores/estadisticas?driverId=${driverId}` 
      : `${this.apiUrl}/conductores/estadisticas`;
    return this.http.get<DriverStats>(url).pipe(
      catchError(() => of(this.getMockStats()))
    );
  }

  checkDbStatus(): Observable<{ connected: boolean; message: string }> {
    return this.http.get<{ connected: boolean; message: string }>(`${this.apiUrl}/vehiculos/health/db`).pipe(
      catchError(() => of({ connected: false, message: 'Backend Offline o DB Desconectada' }))
    );
  }

  // --- MOCKS DE RESPALDO ---
  private getMockVehicles(): Vehicle[] {
    return [
      {
        id: 1,
        driverName: 'James Lubin',
        driverIdCode: '236-542-097',
        marca: 'Volkswagen',
        modelo: 'Transporter T6',
        vehicleModel: 'Volkswagen Transporter',
        status: 'EN CAMINO',
        category: 'FAVORITOS',
        payload: '2,885 lbs (1,308 kg)',
        loadVolume: '0.55 in³ (5.8 m³)',
        loadLength: '117 in (2.97 m)',
        loadWidth: '67 in (1.70 m)',
        licensePlate: '6TRJ244',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        vehicleImageUrl: '/van.jpg'
      },
      {
        id: 2,
        driverName: 'Nolan Dokidis',
        driverIdCode: '236-542-001',
        marca: 'Mercedes-Benz',
        modelo: 'Sprinter 314',
        vehicleModel: 'Mercedes-Benz Sprinter',
        status: 'EN CAMINO',
        category: 'FAVORITOS',
        payload: '3,150 lbs (1,428 kg)',
        loadVolume: '0.62 in³ (6.5 m³)',
        loadLength: '130 in (3.30 m)',
        loadWidth: '70 in (1.78 m)',
        licensePlate: '8XPT102',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        vehicleImageUrl: '/van.jpg'
      },
      {
        id: 3,
        driverName: 'Ahmad Mango',
        driverIdCode: '236-542-002',
        marca: 'Volkswagen',
        modelo: 'Transporter Cargo',
        vehicleModel: 'Volkswagen Transporter',
        status: 'CARGANDO',
        category: 'FAVORITOS',
        payload: '2,750 lbs (1,247 kg)',
        loadVolume: '0.52 in³ (5.5 m³)',
        loadLength: '115 in (2.92 m)',
        loadWidth: '66 in (1.68 m)',
        licensePlate: '4KLA918',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        vehicleImageUrl: '/van.jpg'
      },
      {
        id: 4,
        driverName: 'Talan Dorwart',
        driverIdCode: '236-542-004',
        marca: 'Mercedes-Benz',
        modelo: 'Metris Van',
        vehicleModel: 'Mercedes-Benz Metris',
        status: 'ESPERANDO',
        category: 'FAVORITOS',
        payload: '2,500 lbs (1,134 kg)',
        loadVolume: '0.48 in³ (5.1 m³)',
        loadLength: '110 in (2.79 m)',
        loadWidth: '65 in (1.65 m)',
        licensePlate: '7MNB331',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
        vehicleImageUrl: '/van.jpg'
      },
      {
        id: 5,
        driverName: 'Jakob Vetrovs',
        driverIdCode: '236-542-005',
        marca: 'Volvo',
        modelo: 'FL 250 Heavy',
        vehicleModel: 'Volvo FL',
        status: 'EN CAMINO',
        category: 'CAMIONES',
        payload: '18,500 lbs (8,391 kg)',
        loadVolume: '1.45 in³ (15.2 m³)',
        loadLength: '240 in (6.10 m)',
        loadWidth: '96 in (2.44 m)',
        licensePlate: '9VLV502',
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
        vehicleImageUrl: '/van.jpg'
      }
    ];
  }

  private getMockRoutes(): RouteItem[] {
    return [
      {
        id: 1,
        routeCode: '107-591',
        packageCount: 138,
        origin: '2972 Westheimer Rd. Santa Ana',
        destination: '270 Rucker Ave',
        distance: '0.62 mi',
        timeLeft: '10 min',
        weight: '2,160 lbs',
        volume: '247 in³',
        status: 'EN CURSO',
        isNowOnWay: true,
      },
      {
        id: 2,
        routeCode: '109-270',
        packageCount: 107,
        origin: '8900 Murray Ave',
        destination: '168 W 10th St, Gilroy, CA 95020',
        distance: '1.45 mi',
        timeLeft: '22 min',
        weight: '1,890 lbs',
        volume: '190 in³',
        dateLabel: '12/10/22',
        status: 'COMPLETADO',
        isNowOnWay: false,
      },
      {
        id: 3,
        routeCode: '112-791',
        packageCount: 86,
        origin: '230 Mayock Rd',
        destination: '8225 Arroyo Cir Suite 21, Gilroy, CA 95020',
        distance: '2.10 mi',
        timeLeft: '35 min',
        weight: '1,240 lbs',
        volume: '145 in³',
        dateLabel: '10/10/22',
        status: 'COMPLETADO',
        isNowOnWay: false,
      },
      {
        id: 4,
        routeCode: '128-612',
        packageCount: 129,
        origin: '6215 Engle Way',
        destination: '905 1st St, Gilroy, CA 95020',
        distance: '3.40 mi',
        timeLeft: '40 min',
        weight: '1,920 lbs',
        volume: '215 in³',
        dateLabel: '08/10/22',
        status: 'COMPLETADO',
        isNowOnWay: false,
      }
    ];
  }

  private getMockStats(): DriverStats {
    return {
      onTheWayPercent: 39.7,
      onTheWayTime: '3 hr 10 min',
      unloadingPercent: 28.3,
      unloadingTime: '2 hr 15 min',
      loadingPercent: 17.4,
      loadingTime: '1 hr 23 min',
      waitingPercent: 14.6,
      waitingTime: '1 hr 10 min',
      chartData: [
        { label: '09/10', workingHours: 7.2, avgWorkingHours: 8.5, timeText: '7 hr 12 min', avgText: '8 hr 30 min' },
        { label: '10/10', workingHours: 5.4, avgWorkingHours: 8.5, timeText: '5 hr 24 min', avgText: '8 hr 30 min' },
        { label: '11/10', workingHours: 6.53, avgWorkingHours: 8.5, timeText: '6 hr 32 min', avgText: '8 hr 30 min' },
        { label: '12/10', workingHours: 8.1, avgWorkingHours: 8.5, timeText: '8 hr 06 min', avgText: '8 hr 30 min' },
        { label: '13/10', workingHours: 4.8, avgWorkingHours: 8.5, timeText: '4 hr 48 min', avgText: '8 hr 30 min' },
        { label: '14/10', workingHours: 7.9, avgWorkingHours: 8.5, timeText: '7 hr 54 min', avgText: '8 hr 30 min' },
        { label: '15/10', workingHours: 6.8, avgWorkingHours: 8.5, timeText: '6 hr 48 min', avgText: '8 hr 30 min' },
      ],
    };
  }
}
