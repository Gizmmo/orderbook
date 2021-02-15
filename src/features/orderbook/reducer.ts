import { OrderbookData, OrderbookState, SocketResponseData } from "./types";

export const INITIALIZE_DATA = "initializeData";
export const UPDATE_DATA = "updateData";
export const INCREMENT_GROUPING = "incrementGrouping";
export const DECREMENT_GROUPING = "decrementGrouping";
export const INCREMENT_ROWS = "incrementRows";
export const DECREMENT_ROWS = "decrementRows";
export const SET_ERROR = "setError";

export const groupingAmounts = [
  0.5,
  1,
  2.5,
  5,
  10,
  25,
  50,
  100,
  250,
  500,
  1000,
  2500,
];

export type OrderbookAction =
  | {
      type: typeof INITIALIZE_DATA;
      payload: { asks: SocketResponseData; bids: SocketResponseData };
    }
  | {
      type: typeof UPDATE_DATA;
      payload: { asks: SocketResponseData; bids: SocketResponseData };
    }
  | { type: typeof INCREMENT_GROUPING }
  | { type: typeof DECREMENT_GROUPING }
  | { type: typeof INCREMENT_ROWS }
  | { type: typeof DECREMENT_ROWS }
  | { type: typeof SET_ERROR };

export const initialState: OrderbookState = {
  asks: {},
  bids: {},
  grouping: 25,
  rows: 5,
  socketState: "unset",
};

export function reducer(
  currentState: OrderbookState,
  action: OrderbookAction
): OrderbookState {
  switch (action.type) {
    case INITIALIZE_DATA: {
      return {
        ...currentState,
        asks: reduceSocketDataToOrderbookData(
          action.payload.asks,
          initialState.asks
        ),
        bids: reduceSocketDataToOrderbookData(
          action.payload.bids,
          initialState.bids
        ),
        socketState: "ready",
      };
    }
    case UPDATE_DATA: {
      return {
        ...currentState,
        asks: reduceSocketDataToOrderbookData(
          action.payload.asks,
          currentState.asks
        ),
        bids: reduceSocketDataToOrderbookData(
          action.payload.bids,
          currentState.bids
        ),
      };
    }
    case INCREMENT_GROUPING: {
      const index = groupingAmounts.findIndex(
        (item) => item === currentState.grouping
      );
      const nextIndex =
        index === groupingAmounts.length - 1 ? index : index + 1;
      return {
        ...currentState,
        grouping: groupingAmounts[nextIndex],
      };
    }
    case DECREMENT_GROUPING: {
      const index = groupingAmounts.findIndex(
        (item) => item === currentState.grouping
      );
      const nextIndex = index === 0 ? index : index - 1;
      return {
        ...currentState,
        grouping: groupingAmounts[nextIndex],
      };
    }
    case INCREMENT_ROWS: {
      return {
        ...currentState,
        rows: currentState.rows + 1,
      };
    }
    case DECREMENT_ROWS: {
      return {
        ...currentState,
        rows: currentState.rows <= 1 ? 1 : currentState.rows - 1,
      };
    }
    case SET_ERROR: {
      return {
        ...currentState,
        socketState: "error",
      };
    }
    default: {
      return currentState;
    }
  }
}

function reduceSocketDataToOrderbookData(
  data: SocketResponseData,
  currentState: OrderbookData
): OrderbookData {
  const initialReduceValue = { ...currentState };

  return data.reduce((previousValue, askValue) => {
    const [price, quantity] = askValue;
    const key = getKey(price);
    if (quantity === 0) {
      delete previousValue[key];
    } else {
      previousValue[getKey(askValue[0])] = {
        price: askValue[0],
        quantity: askValue[1],
      };
    }
    return previousValue;
  }, initialReduceValue);
}

function getKey(key: number): number {
  return key * 10;
}
