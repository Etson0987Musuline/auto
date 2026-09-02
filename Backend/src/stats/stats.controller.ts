import { Controller, Get, Query } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller(['stats', 'estadisticas'])
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  async getDriverStats(@Query('driverId') driverId?: string) {
    return this.statsService.getDriverStats(driverId ? +driverId : undefined);
  }
}
