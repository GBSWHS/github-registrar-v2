import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health Check')
@Controller('')
export class HealthController {
  constructor(private healthService: HealthService) {}

  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiResponse({
    status: 404,
    description: '페이지 참조 실패',
  })
  @ApiOperation({ summary: 'healthz' })
  @Get('/healthz')
  healthcheck() {
    return this.healthService.check();
  }

  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiResponse({
    status: 404,
    description: '페이지 참조 실패',
  })
  @ApiOperation({ summary: 'dummy' })
  @Get('/dummy')
  dummy() {
    return this.healthService.dummy();
  }
}
