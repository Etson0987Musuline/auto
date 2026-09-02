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

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.apiUrl}/vehicles`).pipe(
      catchError(() => of(this.getMockVehicles()))
    );
  }

  getRoutes(): Observable<RouteItem[]> {
    return this.http.get<RouteItem[]>(`${this.apiUrl}/routes`).pipe(
      catchError(() => of(this.getMockRoutes()))
    );
  }

  getDriverStats(): Observable<DriverStats> {
    return this.http.get<DriverStats>(`${this.apiUrl}/stats`).pipe(
      catchError(() => of(this.getMockStats()))
    );
  }

  checkDbStatus(): Observable<{ connected: boolean; message: string }> {
    return this.http.get<{ connected: boolean; message: string }>(`${this.apiUrl}/vehicles/health/db`).pipe(
      catchError(() => of({ connected: false, message: 'Backend Offline or DB Disconnected' }))
    );
  }

  addVehicle(vehicle: Partial<Vehicle>): Observable<Vehicle> {
    return this.http.post<Vehicle>(`${this.apiUrl}/vehicles`, vehicle).pipe(
      catchError(() => of({
        id: Date.now(),
        driverName: vehicle.driverName || 'New Driver',
        driverIdCode: '236-542-999',
        vehicleModel: vehicle.vehicleModel || 'Transporter',
        status: vehicle.status || 'ON THE WAY',
        category: vehicle.category || 'VANS',
        licensePlate: vehicle.licensePlate || '6TRJ999'
      }))
    );
  }

  updateVehicle(id: number, vehicle: Partial<Vehicle>): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.apiUrl}/vehicles/${id}`, vehicle).pipe(
      catchError(() => of({ id, ...vehicle } as Vehicle))
    );
  }

  deleteVehicle(id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/vehicles/${id}`).pipe(
      catchError(() => of({ success: true }))
    );
  }

  private getMockVehicles(): Vehicle[] {
    return [
      { id: 1, driverName: 'Nolan Dokidis', driverIdCode: '236-542-001', vehicleModel: 'Mercedes-Benz Sprinter', status: 'ON THE WAY', category: 'FAVORITES' },
      { id: 2, driverName: 'Ahmad Mango', driverIdCode: '236-542-002', vehicleModel: 'Volkswagen Transporter', status: 'LOADING', category: 'FAVORITES' },
      { id: 3, driverName: 'James Lubin', driverIdCode: '236-542-097', vehicleModel: 'Volkswagen Transporter', status: 'ON THE WAY', category: 'FAVORITES', payload: '2,885 lbs', loadVolume: '0.55 in³', loadLength: '117 in', loadWidth: '67 in', licensePlate: '6TRJ244' },
      { id: 4, driverName: 'Talan Dorwart', driverIdCode: '236-542-004', vehicleModel: 'Mercedes-Benz Metris', status: 'WAITING', category: 'FAVORITES' },
      { id: 5, driverName: 'Jakob Vetrovs', driverIdCode: '236-542-005', vehicleModel: 'Volvo FL', status: 'ON THE WAY', category: 'TRUCKS' },
      { id: 6, driverName: 'Zain Vetrovs', driverIdCode: '236-542-006', vehicleModel: 'Mercedes-Benz Atego', status: 'WAITING', category: 'TRUCKS' },
      { id: 7, driverName: 'Jaylon Rhiel Madsen', driverIdCode: '236-542-007', vehicleModel: 'Volvo FL', status: 'ON THE WAY', category: 'TRUCKS' },
      { id: 8, driverName: 'Gustavo Torff', driverIdCode: '236-542-008', vehicleModel: 'Volvo FH', status: 'UNLOADING', category: 'TRUCKS' },
      { id: 9, driverName: 'Jaylon Botosh', driverIdCode: '236-542-009', vehicleModel: 'Man TGM 15.290 4x2 BL CH', status: 'LOADING', category: 'TRUCKS' },
      { id: 10, driverName: 'Marcus Dokidis', driverIdCode: '236-542-010', vehicleModel: 'Man TGL 8.190 4x2 BL CH', status: 'ON THE WAY', category: 'TRUCKS' },
      { id: 11, driverName: 'Tiana Westervelt', driverIdCode: '236-542-011', vehicleModel: 'Volkswagen Transporter', status: 'LOADING', category: 'VANS' },
      { id: 12, driverName: 'Zain Korsgaard', driverIdCode: '236-542-012', vehicleModel: 'Mercedes-Benz Sprinter', status: 'ON THE WAY', category: 'VANS' }
    ];
  }

  private getMockRoutes(): RouteItem[] {
    return [
      { id: 1, routeCode: '107-591', packageCount: 138, origin: '2972 Westheimer Rd. Santa Ana', destination: '270 Rucker Ave', distance: '0.62 mi', timeLeft: '10 min', weight: '2,160 lbs', volume: '247 in³', isNowOnWay: true },
      { id: 2, routeCode: '109-270', packageCount: 107, origin: '8900 Murray Ave', destination: '168 W 10th St, Gilroy, CA 95020', dateLabel: '12/10/22', isNowOnWay: false },
      { id: 3, routeCode: '112-791', packageCount: 86, origin: '230 Mayock Rd', destination: '8225 Arroyo Cir Suite 21, Gilroy, CA 95020', isNowOnWay: false }
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
        { label: '9/10/22', workingHours: 7.2, avgWorkingHours: 8.5, timeText: '7 hr 12 min', avgText: '8 hr 30 min' },
        { label: '9/11/22', workingHours: 5.4, avgWorkingHours: 8.5, timeText: '5 hr 24 min', avgText: '8 hr 30 min' },
        { label: '9/12/22', workingHours: 6.53, avgWorkingHours: 8.5, timeText: '6 hr 32 min', avgText: '8 hr 30 min' },
        { label: '9/13/22', workingHours: 8.1, avgWorkingHours: 8.5, timeText: '8 hr 06 min', avgText: '8 hr 30 min' }
      ]
    };
  }
}
