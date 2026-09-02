import { Injectable } from '@nestjs/common';
import { DriversService, DriverStatsResponse } from '../drivers/drivers.service';

@Injectable()
export class StatsService {
  constructor(private readonly driversService: DriversService) {}

  async getDriverStats(driverId?: number): Promise<DriverStatsResponse> {
    return this.driversService.getStatistics(driverId);
  }
}
