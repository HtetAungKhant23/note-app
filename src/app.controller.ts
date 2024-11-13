import { Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { IResponse } from './core/interfaces/response.interface';

@Controller()
export class AppController {
  @Get('/health-check')
  healthCheck(): IResponse {
    return {
      _data: new Date(),
      _metadata: {
        message: 'Health check success.',
        statusCode: HttpStatus.OK,
      },
    };
  }

  @Get('/test1')
  test1(): IResponse {
    return {
      _data: { test: 'one' },
      _metadata: {
        message: 'test one success.',
        statusCode: HttpStatus.OK,
      },
    };
  }

  @Post('/test2')
  test2(): IResponse {
    return {
      _data: { test: 'two' },
      _metadata: {
        message: 'test two success.',
        statusCode: HttpStatus.OK,
      },
    };
  }
}
