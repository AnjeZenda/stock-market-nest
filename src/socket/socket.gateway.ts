import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { SocketService } from './socket.service';
import axios from 'axios';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private clients: any[] = [];
  private index: number = 0;
  private list: any[] = [];
  private interval: any;
  constructor(private readonly socketService: SocketService) {}

  handleConnection(client: any): any {
    if (!this.clients.includes(client)) {
      console.log('Connected');
      this.clients.push(client);
    }
  }

  handleDisconnect(client: any): any {
    for (let i = 0; i < this.clients.length; ++i) {
      if (this.clients[i] === client) {
        console.log('Disconnected');
        this.clients.splice(i, 1);
        break;
      }
    }
  }

  private broadcast(event: string, message: any) {
    const broadcastMessage = JSON.stringify(message);
    for (const client of this.clients) {
      console.log(event, broadcastMessage);
      client.emit(event, broadcastMessage);
    }
  }

  @SubscribeMessage('tradingListDone')
  handleTradingListEvent(
    @MessageBody() dto: any,
    @ConnectedSocket() client: any,
  ) {
    this.list = dto;
    this.broadcast('trading_list', dto);
  }

  @SubscribeMessage('start')
  handleStartEvent(@MessageBody() dto: any, @ConnectedSocket() client: any) {
    console.log(dto);
    this.index = Number(dto.index);
    console.log(dto.speed);
    this.broadcast('trading_list', this.list);
    this.broadcast('trading', this.index);
    ++this.index;
    this.interval = setInterval(() => {
      console.log(this.index);
      this.broadcast('trading_list', this.list);
      this.broadcast('trading', this.index);
      ++this.index;
    }, 1000 * dto.speed);
  }

  @SubscribeMessage('stop')
  handleStopEvent(@MessageBody() dto: any, @ConnectedSocket() client: any) {
    clearInterval(this.interval);
    console.log('stop');
    this.index = 0;
  }

  @SubscribeMessage('buy')
  handleBuyEvent(@MessageBody() dto: any, @ConnectedSocket() client: any) {
    axios.post('http://localhost:8080/brokers/buy', dto).then((res) => {
      console.log(res.data);
      this.broadcast('bought', res.data);
    });
  }

  @SubscribeMessage('sell')
  handleSellEvent(@MessageBody() dto: any, @ConnectedSocket() client: any) {
    axios.post('http://localhost:8080/brokers/sell', dto).then((res) => {
      console.log(res.data);
      this.broadcast('sold', res.data);
    });
  }

  @SubscribeMessage('brokers')
  handleBrokersChangeEvent(
    @MessageBody() dto: any,
    @ConnectedSocket() client: any,
  ) {
    axios.get('http://localhost:8080/brokers').then((res) => {
      console.log(res.data);
      this.broadcast('brokers', res.data);
    });
  }
}
