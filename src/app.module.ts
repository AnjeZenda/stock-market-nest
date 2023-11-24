import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BrokersController } from './brokers/brokers.controller';
import { BrokersService } from './brokers/brokers.service';
import { StocksController } from './stocks/stocks.controller';
import { StocksService } from './stocks/stocks.service';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [SocketModule],
  controllers: [AppController, BrokersController, StocksController],
  providers: [AppService, BrokersService, StocksService],
})
export class AppModule {}
