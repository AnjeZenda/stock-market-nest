import { Controller, Get, Header } from '@nestjs/common';
import { StocksService } from './stocks.service';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get('')
  @Header('Content-Type', 'application/json')
  async getAll() {
    return await this.stocksService.getAll();
  }
}
