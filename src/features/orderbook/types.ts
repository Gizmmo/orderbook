export interface SocketResponse {
  feed: string;
  asks: SocketResponseData;
  bids: SocketResponseData;
}

export type CurrentSocketState = "unset" | "ready" | "error";

export interface OrderbookState {
  asks: OrderbookData;
  bids: OrderbookData;
  grouping: number;
  rows: number;
  socketState: CurrentSocketState;
}

export type SocketTuple = [price: number, quantity: number];
export type SocketResponseData = SocketTuple[];

export type OrderbookData = { [id: number]: OrderbookDataItem };

export interface OrderbookDataItem {
  price: number;
  quantity: number;
}

export interface OrderbookDataDisplayItem extends OrderbookDataItem {
  total: number;
}
