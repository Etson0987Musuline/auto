export interface RouteItem {
  id?: number;
  routeCode: string;
  packageCount: number;
  origin: string;
  destination: string;
  distance?: string;
  timeLeft?: string;
  weight?: string;
  volume?: string;
  status?: 'EN CURSO' | 'PENDIENTE' | 'COMPLETADO' | string;
  isNowOnWay?: boolean;
  dateLabel?: string;
}

export interface Driver {
  id: number;
  nombre: string;
  codigo: string;
  fotoUrl?: string;
  telefono?: string;
  email?: string;
  estado: 'EN CAMINO' | 'CARGANDO' | 'ESPERANDO' | 'DESCARGANDO' | string;
  vehiculo?: Vehicle;
  rutas?: RouteItem[];
}

export interface Vehicle {
  id: number;
  driverName: string;
  driverIdCode: string;
  marca?: string;
  modelo?: string;
  vehicleModel: string;
  status: 'EN CAMINO' | 'CARGANDO' | 'ESPERANDO' | 'DESCARGANDO' | 'ON THE WAY' | 'LOADING' | 'WAITING' | 'UNLOADING' | string;
  category: 'FAVORITOS' | 'CAMIONES' | 'FURGONETAS' | 'FAVORITES' | 'TRUCKS' | 'VANS' | string;
  payload?: string;
  loadVolume?: string;
  loadLength?: string;
  loadWidth?: string;
  licensePlate?: string;
  avatarUrl?: string;
  vehicleImageUrl?: string;
  activo?: boolean;
  routes?: RouteItem[];
}

export interface ChartPoint {
  label: string;
  workingHours: number;
  avgWorkingHours: number;
  timeText: string;
  avgText: string;
}

export interface DriverStats {
  onTheWayPercent: number;
  onTheWayTime: string;
  unloadingPercent: number;
  unloadingTime: string;
  loadingPercent: number;
  loadingTime: string;
  waitingPercent: number;
  waitingTime: string;
  chartData: ChartPoint[];
}

export interface VehicleDocument {
  id: string;
  title: string;
  type: string;
  expiration: string;
  status: 'VIGENTE' | 'POR RENOVAR' | 'VENCIDO';
  fileNumber: string;
}
