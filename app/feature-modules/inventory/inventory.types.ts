export interface IInventory {
  _id?: string;
  spare_part: string;
  min_qty: number;
  price: number;
  isSpecial: boolean;
  points?: number;
}
