import { Injectable } from '@nestjs/common';

export interface DriverStats {
  onTheWayPercent: number;
  onTheWayTime: string;
  unloadingPercent: number;
  unloadingTime: string;
  loadingPercent: number;
  loadingTime: string;
  waitingPercent: number;
  waitingTime: string;
  chartData: {
    label: string;
    workingHours: number;
    avgWorkingHours: number;
    timeText: string;
    avgText: string;
  }[];
}

@Injectable()
export class StatsService {
  getDriverStats(): DriverStats {
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
        { label: '9/13/22', workingHours: 8.1, avgWorkingHours: 8.5, timeText: '8 hr 06 min', avgText: '8 hr 30 min' },
        { label: '9/14/22', workingHours: 4.8, avgWorkingHours: 8.5, timeText: '4 hr 48 min', avgText: '8 hr 30 min' },
        { label: '9/15/22', workingHours: 7.9, avgWorkingHours: 8.5, timeText: '7 hr 54 min', avgText: '8 hr 30 min' },
        { label: '9/16/22', workingHours: 6.8, avgWorkingHours: 8.5, timeText: '6 hr 48 min', avgText: '8 hr 30 min' },
      ],
    };
  }
}
