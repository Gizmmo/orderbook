import styles from "./NumberAdjuster.module.css";

export function NumberAdjuster({
  name,
  amount,
  increment,
  decrement,
}: NumberAdjusterProps) {
  return (
    <div className={styles.adjuster}>
      <div>{name}</div>
      <div className={styles.controls}>
        <button
          className={styles.adjustButton}
          onClick={decrement}
          aria-label={`Decrement ${name}`}
        >
          -
        </button>
        <span className={styles.amount}>{amount}</span>
        <button
          className={styles.adjustButton}
          onClick={increment}
          aria-label={`Increment ${name}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

interface NumberAdjusterProps {
  name: string;
  amount: number;
  increment: () => void;
  decrement: () => void;
}
