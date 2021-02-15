import {
  createOrUpdateDataItem,
  getDataWithTotals,
  groupOrderbookData,
  totalOrderbookData,
} from "./utils";

describe("utils", () => {
  describe("groupOrderbookData", () => {
    it("group is 5, all prices can be divided by 5", () => {
      const items = groupOrderbookData(
        [
          { price: 1, quantity: 5 },
          { price: 3, quantity: 5 },
          { price: 37, quantity: 5 },
          { price: 45, quantity: 5 },
        ],
        5
      );

      const isModFive = items.some((e) => e.price % 5 !== 0);

      expect(isModFive).toBeFalsy();
    });

    it("grouped data should be quantity of all between floor and ceil", () => {
      const items = groupOrderbookData(
        [
          { price: 1, quantity: 5 },
          { price: 3, quantity: 5 },
          { price: 37, quantity: 5 },
          { price: 45, quantity: 5 },
        ],
        5
      );

      expect(items[0].quantity).toEqual(10);
      expect(items[1].quantity).toEqual(5);
      expect(items[2].quantity).toEqual(5);
    });
  });

  describe("totalOrderbookData", () => {
    it("totals all quantities from length to 0", () => {
      const items = totalOrderbookData(
        [
          { price: 1, quantity: 5, total: 0 },
          { price: 3, quantity: 5, total: 0 },
          { price: 37, quantity: 5, total: 0 },
          { price: 45, quantity: 5, total: 0 },
        ],
        false
      );

      expect(items[0].total).toEqual(20);
      expect(items[1].total).toEqual(15);
      expect(items[2].total).toEqual(10);
      expect(items[3].total).toEqual(5);
    });

    it("reverse totals all quantities from 0 to length", () => {
      const items = totalOrderbookData(
        [
          { price: 1, quantity: 5, total: 0 },
          { price: 3, quantity: 5, total: 0 },
          { price: 37, quantity: 5, total: 0 },
          { price: 45, quantity: 5, total: 0 },
        ],
        true
      );

      expect(items[0].total).toEqual(5);
      expect(items[1].total).toEqual(10);
      expect(items[2].total).toEqual(15);
      expect(items[3].total).toEqual(20);
    });
  });

  describe("createOrUpdateDataItem", () => {
    it("Updates quantity value to the grouping passed if its in the array", () => {
      const items = createOrUpdateDataItem(
        { price: 41, quantity: 1 },
        [
          { price: 5, quantity: 5, total: 0 },
          { price: 10, quantity: 10, total: 0 },
          { price: 45, quantity: 5, total: 0 },
        ],
        45
      );

      expect(items[0].quantity).toEqual(5);
      expect(items[1].quantity).toEqual(10);
      expect(items[2].quantity).toEqual(6);
    });

    it("Adds a new item to the grouping passed if it is not found in the array", () => {
      const items = createOrUpdateDataItem(
        { price: 53, quantity: 1 },
        [
          { price: 5, quantity: 5, total: 0 },
          { price: 10, quantity: 10, total: 0 },
          { price: 45, quantity: 5, total: 0 },
        ],
        55
      );

      expect(items[0].quantity).toEqual(5);
      expect(items[1].quantity).toEqual(10);
      expect(items[2].quantity).toEqual(5);
      expect(items[3].quantity).toEqual(1);
      expect(items[3].price).toEqual(55);
    });

    it("Creates a new item if there is no current items", () => {
      const items = createOrUpdateDataItem({ price: 53, quantity: 1 }, [], 55);

      expect(items[0].quantity).toEqual(1);
      expect(items[0].price).toEqual(55);
    });
  });

  describe("getDataWithTotals", () => {
    it("Quantities are properly updated and grouped", () => {
      const data = {
        10: { price: 1, quantity: 10 },
        40: { price: 4, quantity: 3 },
        180: { price: 18, quantity: 20 },
        200: { price: 20, quantity: 20 },
        3000: { price: 300, quantity: 30 },
      };

      const result = getDataWithTotals(data, 5, 5);

      expect(result[0].quantity).toEqual(30);
      expect(result[1].quantity).toEqual(40);
      expect(result[2].quantity).toEqual(13);
    });

    it("Price is grouped in the end result", () => {
      const data = {
        10: { price: 1, quantity: 10 },
        40: { price: 4, quantity: 3 },
        180: { price: 18, quantity: 20 },
        200: { price: 20, quantity: 20 },
        3000: { price: 300, quantity: 30 },
      };

      const result = getDataWithTotals(data, 5, 5);

      expect(result[0].price).toEqual(300);
      expect(result[1].price).toEqual(20);
      expect(result[2].price).toEqual(5);
    });

    it("Totals is summed in the end result", () => {
      const data = {
        10: { price: 1, quantity: 10 },
        40: { price: 4, quantity: 3 },
        180: { price: 18, quantity: 20 },
        200: { price: 20, quantity: 20 },
        3000: { price: 300, quantity: 30 },
      };

      const result = getDataWithTotals(data, 5, 5);

      expect(result[0].total).toEqual(83);
      expect(result[1].total).toEqual(53);
      expect(result[2].total).toEqual(13);
    });
  });

  it("Totals is summed in reverse using the reverseTotals option in the end result", () => {
    const data = {
      10: { price: 1, quantity: 10 },
      40: { price: 4, quantity: 3 },
      180: { price: 18, quantity: 20 },
      200: { price: 20, quantity: 20 },
      3000: { price: 300, quantity: 30 },
    };

    const result = getDataWithTotals(data, 5, 5, { reverseTotals: true });

    expect(result[0].total).toEqual(30);
    expect(result[1].total).toEqual(70);
    expect(result[2].total).toEqual(83);
  });
});
