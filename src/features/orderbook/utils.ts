import {
  OrderbookData,
  OrderbookDataDisplayItem,
  OrderbookDataItem,
} from "./types";

export function getDataWithTotals(
  orderbookDataItems: OrderbookData,
  grouping: number,
  rows: number,
  options: { reverseTotals: boolean } = { reverseTotals: false }
): OrderbookDataDisplayItem[] {
  const { reverseTotals } = options;
  const items = Object.values(orderbookDataItems);

  const groupedArray = groupOrderbookData(items, grouping);

  const totaledArray = totalOrderbookData(groupedArray, reverseTotals);

  return totaledArray.slice(0, rows);
}

export function groupOrderbookData(
  items: OrderbookDataItem[],
  grouping: number
): OrderbookDataDisplayItem[] {
  return items.reduce(
    (
      previous: OrderbookDataDisplayItem[],
      item: OrderbookDataItem
    ): OrderbookDataDisplayItem[] => {
      const mod = item.price % grouping;
      const ceil = mod === 0 ? item.price : item.price - mod + grouping;
      const newData = createOrUpdateDataItem(item, previous, ceil);

      return newData;
    },
    [] as OrderbookDataDisplayItem[]
  );
}

export function totalOrderbookData(
  items: OrderbookDataDisplayItem[],
  reverseTotals: boolean
) {
  if (reverseTotals) items.reverse();

  let total = 0;
  items.forEach((item) => {
    total += item.quantity;
    item.total = total;
  });

  if (!reverseTotals) items.reverse();

  return items;
}

export function createOrUpdateDataItem(
  item: OrderbookDataItem,
  dataItems: OrderbookDataDisplayItem[],
  insertNumber: number
): OrderbookDataDisplayItem[] {
  if (dataItems.length === 0) {
    dataItems.push({
      price: insertNumber,
      quantity: item.quantity,
      total: 0,
    });
    return dataItems;
  }

  const lastItem = dataItems[dataItems.length - 1];

  if (lastItem.price !== insertNumber) {
    dataItems.push({
      ...item,
      price: insertNumber,
      total: 0,
    });
  } else {
    dataItems[dataItems.length - 1] = {
      ...lastItem,
      quantity: lastItem.quantity + item.quantity,
    };
  }
  return dataItems;
}
