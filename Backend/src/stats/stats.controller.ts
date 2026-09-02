import { Controller, Get } from '@nestjs/common';
import { StatsService, type DriverStats } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  getDriverStats(): DriverStats {
    return this.statsService.getDriverStats();
  }
}
