import { OrderbookDataDisplayItem } from "../../types";
import styles from "./Book.module.css";
import cx from "classnames";

export function Book({ name, items, isGreen: isRed = false }: BookProps) {
  if (items.length === 0) return null;

  var highest = Math.max(items[0].total, items[items.length - 1].total);

  return (
    <div className={styles.bookContainer}>
      {name}
      <table className={styles.bookTable}>
        <thead>
          <tr className={styles.bookrow}>
            <th className={styles.bookData}>Price</th>
            <th className={styles.bookData}>Size</th>
            <th className={styles.bookData}>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr className={styles.bookrow} key={item.price}>
              <td
                className={cx(styles.bookData, {
                  [styles.bidsPrice]: isRed,
                  [styles.askPrice]: !isRed,
                })}
              >
                {item.price.toLocaleString()}
              </td>
              <td className={styles.bookData}>
                {item.quantity.toLocaleString()}
              </td>
              <td className={styles.bookData}>{item.total.toLocaleString()}</td>
              <td
                style={{ width: `${(item.total / highest) * 100}%` }}
                data-testid={item.price}
                className={cx(styles.bookchart, { [styles.bids]: isRed })}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface BookProps {
  items: OrderbookDataDisplayItem[];
  name: string;
  isGreen?: boolean;
}
