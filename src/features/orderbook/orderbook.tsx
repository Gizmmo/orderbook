import React from "react";
import { Book } from "./components/Book/Book";
import { NumberAdjuster } from "../../components/numberAdjuster";
import { useOrderbook } from "./hooks/useOrderbook";
import styles from "./orderbook.module.css";

export function Orderbook() {
  const { asks, bids, grouping, rows, socketState } = useOrderbook();

  if(socketState === 'unset') {
    return <div>Loading...</div>
  }
  if (socketState === "error") {
    return (
      <div>
        There was an error with your websocket. Please try refreshing the page!
      </div>
    );
  }
  return (
    <div className={styles.content}>
      <NumberAdjuster
        name="Grouping"
        increment={grouping.increment}
        decrement={grouping.decrement}
        amount={grouping.amount}
      />
      <NumberAdjuster
        name="Rows"
        increment={rows.increment}
        decrement={rows.decrement}
        amount={rows.amount}
      />
      <div className={styles.books}>
        <Book items={asks} name="Asks" />
        <Book items={bids} isRed name="Bids" />
      </div>
    </div>
  );
}
