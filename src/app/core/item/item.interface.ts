export interface Item {
  id: string;
  name: string;
  status: number;
  nextCheck?: Date;
  expiring?: Date;
  categoryId: string;
}
