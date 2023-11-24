import {
  Controller,
  Header,
  Get,
  Post,
  HttpStatus,
  HttpCode,
  Body,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { BrokersService } from './brokers.service';
import { IBrokerCreate, IBrokerUpdate } from '../models/IBroker';

@Controller('brokers')
export class BrokersController {
  constructor(private readonly brokersService: BrokersService) {}
  @Get('')
  @Header('Content-Type', 'application/json')
  async getAll() {
    return await this.brokersService.getAll();
  }
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-Type', 'application/json')
  async create(@Body() broker: IBrokerCreate) {
    return await this.brokersService.create(broker);
  }

  @Delete(':id')
  async deleteBroker(@Param('id') id: string) {
    return await this.brokersService.delete(parseInt(id));
  }
  @Put(':id')
  async updateBroker(@Param('id') id: string, @Body() broker: IBrokerUpdate) {
    return await this.brokersService.update(parseInt(id), broker);
  }
}
