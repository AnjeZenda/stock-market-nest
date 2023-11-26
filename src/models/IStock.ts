export interface IStock {
  id: number;
  label: string;
  name: string;
  file: string;
}

export interface IBoughtStock {
  userId: number;
  stockLabel: string;
  price: number;
  amount: number;
}
