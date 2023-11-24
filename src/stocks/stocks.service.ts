import { Injectable } from '@nestjs/common';
import { IStock } from '../models/IStock';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';

@Injectable()
export class StocksService {
  private readonly stocks: IStock[];
  constructor() {
    const rawStocksData = fs.readFileSync(
      path.join(process.cwd(), 'src/data/stocks.json'),
    );
    this.stocks = JSON.parse(String(rawStocksData));
  }
  async getAll() {
    const data = [];
    for (const stock of this.stocks) {
      const raw = fs.readFileSync(
        path.join(process.cwd(), `src/data/story/${stock.file}`),
      );
      data.push({
        id: stock.id,
        label: stock.label,
        name: stock.name,
        data: JSON.parse(String(raw)),
      });
    }
    return data;
  }
}
