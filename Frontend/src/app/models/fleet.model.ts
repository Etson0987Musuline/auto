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
  isNowOnWay?: boolean;
  dateLabel?: string;
}

export interface Vehicle {
  id: number;
  driverName: string;
  driverIdCode: string;
  vehicleModel: string;
  status: 'ON THE WAY' | 'LOADING' | 'WAITING' | 'UNLOADING' | string;
  category: 'FAVORITES' | 'TRUCKS' | 'VANS' | string;
  payload?: string;
  loadVolume?: string;
  loadLength?: string;
  loadWidth?: string;
  licensePlate?: string;
  avatarUrl?: string;
  vehicleImageUrl?: string;
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
