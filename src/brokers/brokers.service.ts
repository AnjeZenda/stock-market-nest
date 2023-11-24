import { Injectable } from '@nestjs/common';
import { IBroker, IBrokerCreate, IBrokerUpdate } from '../models/IBroker';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';

@Injectable()
export class BrokersService {
  private readonly brokers: IBroker[];

  constructor() {
    const rawBrokersData = fs.readFileSync(
      path.join(process.cwd(), 'src/data/brokers.json'),
    );
    console.log(String(rawBrokersData));
    this.brokers = JSON.parse(String(rawBrokersData));
  }

  async getAll() {
    return this.brokers;
  }

  async create(broker: IBrokerCreate) {
    const newBroker: IBroker = {
      id: this.getLastId() + 1,
      name: broker.name,
      value: broker.value,
      stocks: [],
    };
    this.brokers.push(newBroker);
    this.save();
    return newBroker;
  }

  private getLastId() {
    return this.brokers.length > 0
      ? this.brokers[this.brokers.length - 1].id
      : 0;
  }

  private save() {
    const rawBrokersData = JSON.stringify(this.brokers);
    fs.writeFileSync(
      path.join(process.cwd(), 'src/data/brokers.json'),
      rawBrokersData,
    );
  }

  async delete(id: number) {
    const index = this.brokers.findIndex((x) => x.id === id);
    this.brokers.splice(index, 1);
    this.save();
    return id;
  }

  async update(id: number, broker: IBrokerUpdate) {
    const index = this.brokers.findIndex((x) => x.id === id);
    this.brokers[index].name = broker.name;
    this.brokers[index].value = broker.balance;
    this.save();
  }
}
