import { Dispatch, useCallback, useEffect, useReducer } from "react";
import {
  DECREMENT_GROUPING,
  DECREMENT_ROWS,
  INCREMENT_GROUPING,
  INCREMENT_ROWS,
  INITIALIZE_DATA,
  initialState,
  OrderbookAction,
  reducer,
  SET_ERROR,
  UPDATE_DATA,
} from "../reducer";
import { SocketResponse } from "../types";
import { getDataWithTotals } from "../utils";

export function useOrderbook() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const handleOnMessage = useHandleOnMessage(dispatch);
  const handleOnError = useHandleOnError(dispatch);

  useEffect(() => {
    const webSocket = new WebSocket("wss://www.cryptofacilities.com/ws/v1");

    webSocket.onopen = handleOnOpen(webSocket);
    webSocket.onmessage = handleOnMessage;
    webSocket.onerror = handleOnError;

    return () => webSocket.close();
  }, [handleOnMessage, handleOnError]);

  const incrementGrouping = useCallback(() => {
    dispatch({ type: INCREMENT_GROUPING });
  }, [dispatch]);

  const decrementGrouping = useCallback(() => {
    dispatch({ type: DECREMENT_GROUPING });
  }, [dispatch]);

  const incrementRows = useCallback(() => {
    dispatch({ type: INCREMENT_ROWS });
  }, [dispatch]);

  const decrementRows = useCallback(() => {
    dispatch({ type: DECREMENT_ROWS });
  }, [dispatch]);

  return {
    asks: getDataWithTotals(state.asks, state.grouping, state.rows),
    bids: getDataWithTotals(state.bids, state.grouping, state.rows, {
      reverseTotals: true,
    }),
    grouping: {
      increment: incrementGrouping,
      decrement: decrementGrouping,
      amount: state.grouping,
    },
    rows: {
      increment: incrementRows,
      decrement: decrementRows,
      amount: state.rows,
    },
    socketState: state.socketState,
  };
}

function handleOnOpen(webSocket: WebSocket) {
  return () =>
    webSocket.send(
      JSON.stringify({
        event: "subscribe",
        feed: "book_ui_1",
        product_ids: ["PI_XBTUSD"],
      })
    );
}

function useHandleOnMessage(dispatch: Dispatch<OrderbookAction>) {
  return useCallback(
    (ev: MessageEvent) => {
      const response = JSON.parse(ev.data) as SocketResponse;
      const { feed, asks, bids } = response;

      if (!asks?.length && !bids?.length) return;

      switch (feed) {
        case "book_ui_1_snapshot":
          dispatch({ type: INITIALIZE_DATA, payload: { asks, bids } });
          break;
        case "book_ui_1":
          dispatch({ type: UPDATE_DATA, payload: { asks, bids } });
          break;
        default:
          break;
      }
    },
    [dispatch]
  );
}

function useHandleOnError(dispatch: Dispatch<OrderbookAction>) {
  return useCallback(() => dispatch({ type: SET_ERROR }), [dispatch]);
}
