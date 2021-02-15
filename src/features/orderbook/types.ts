export interface SocketResponse {
  feed: string;
  asks: SocketResponseData;
  bids: SocketResponseData;
}

export type SocketResponseData = number[][];

export type OrderbookData = { [id: number]: OrderbookDataItem };

export interface OrderbookDataItem {
  price: number;
  quantity: number;
}

export interface OrderbookDataDisplayItem extends OrderbookDataItem {
  total: number;
}
