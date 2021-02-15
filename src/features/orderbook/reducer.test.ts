import {
  DECREMENT_GROUPING,
  DECREMENT_ROWS,
  groupingAmounts,
  INCREMENT_GROUPING,
  INCREMENT_ROWS,
  INITIALIZE_DATA,
  initialState,
  reducer,
  SET_ERROR,
  UPDATE_DATA,
} from "./reducer";

describe("reducer", () => {
  const data = {
    asks: [
      [1, 10],
      [2, 20],
      [3, 30],
    ],
    bids: [
      [1, 10],
      [2, 20],
      [3, 30],
    ],
  };

  it("initilize will set socketState to 'ready'", () => {
    const expected = "ready";
    const intiialDataState = {
      ...initialState,
      status: "unset",
    };

    const result = reducer(intiialDataState, {
      type: INITIALIZE_DATA,
      payload: data,
    });

    expect(result.socketState).toEqual(expected);
  });

  it("given initialization data, will return initial state", () => {
    const expected = {
      10: { price: 1, quantity: 10 },
      20: { price: 2, quantity: 20 },
      30: { price: 3, quantity: 30 },
    };

    const result = reducer(initialState, {
      type: INITIALIZE_DATA,
      payload: data,
    });
    expect(result.bids).toEqual(expected);
    expect(result.asks).toEqual(expected);
  });

  it("given update data, will return updated state", () => {
    const expected = {
      10: { price: 1, quantity: 10 },
      20: { price: 2, quantity: 20 },
      30: { price: 3, quantity: 30 },
      50: { price: 5, quantity: 2 },
    };
    const intiialDataState = {
      ...initialState,
      asks: {
        10: { price: 1, quantity: 2 },
        30: { price: 3, quantity: 30 },
        50: { price: 5, quantity: 2 },
      },
      bids: {
        10: { price: 1, quantity: 2 },
        30: { price: 3, quantity: 30 },
        50: { price: 5, quantity: 2 },
      },
    };

    const result = reducer(intiialDataState, {
      type: UPDATE_DATA,
      payload: data,
    });
    expect(result.bids).toEqual(expected);
    expect(result.asks).toEqual(expected);
  });

  it("given a 0 quantity in update data, it will remove it from the list", () => {
    const expected = {
      20: { price: 2, quantity: 20 },
      30: { price: 3, quantity: 30 },
      50: { price: 5, quantity: 2 },
    };
    const intiialDataState = {
      ...initialState,
      asks: {
        10: { price: 1, quantity: 2 },
        30: { price: 3, quantity: 30 },
        50: { price: 5, quantity: 2 },
      },
      bids: {
        10: { price: 1, quantity: 2 },
        30: { price: 3, quantity: 30 },
        50: { price: 5, quantity: 2 },
      },
    };

    const updateData = { ...data };
    updateData.asks[0][1] = 0; //Move the 1 price quantity to 0
    updateData.bids[0][1] = 0; //Move the 1 price quantity to 0

    const result = reducer(intiialDataState, {
      type: UPDATE_DATA,
      payload: updateData,
    });

    expect(result.bids).toEqual(expected);
    expect(result.asks).toEqual(expected);
  });

  it("increment row will cause rows to increase by 1", () => {
    const expected = 6;
    const intiialDataState = {
      ...initialState,
      rows: 5,
    };

    const result = reducer(intiialDataState, {
      type: INCREMENT_ROWS,
    });

    expect(result.rows).toEqual(expected);
  });

  it("decrement row will cause rows to decrease by 1", () => {
    const expected = 4;
    const intiialDataState = {
      ...initialState,
      rows: 5,
    };

    const result = reducer(intiialDataState, {
      type: DECREMENT_ROWS,
    });

    expect(result.rows).toEqual(expected);
  });

  it("decrement row cannot go below 1", () => {
    const expected = 1;
    const intiialDataState = {
      ...initialState,
      rows: 1,
    };

    const result = reducer(intiialDataState, {
      type: DECREMENT_ROWS,
    });

    expect(result.rows).toEqual(expected);
  });

  it("increment grouping will cause the grouping amounts to increase to the next value", () => {
    const expected = groupingAmounts[1];
    const intiialDataState = {
      ...initialState,
      grouping: groupingAmounts[0],
    };

    const result = reducer(intiialDataState, {
      type: INCREMENT_GROUPING,
    });

    expect(result.grouping).toEqual(expected);
  });

  it("increment grouping will not go over the max", () => {
    const expected = groupingAmounts[groupingAmounts.length - 1];
    const intiialDataState = {
      ...initialState,
      grouping: groupingAmounts[groupingAmounts.length - 1],
    };

    const result = reducer(intiialDataState, {
      type: INCREMENT_GROUPING,
    });

    expect(result.grouping).toEqual(expected);
  });

  it("decrement grouping will cause grouping to go to the next amount down", () => {
    const expected = groupingAmounts[groupingAmounts.length - 2];
    const intiialDataState = {
      ...initialState,
      grouping: groupingAmounts[groupingAmounts.length - 1],
    };

    const result = reducer(intiialDataState, {
      type: DECREMENT_GROUPING,
    });

    expect(result.grouping).toEqual(expected);
  });

  it("decrement grouping at bottom will not allow grouping to go to the next amount down", () => {
    const expected = groupingAmounts[0];
    const intiialDataState = {
      ...initialState,
      grouping: groupingAmounts[0],
    };

    const result = reducer(intiialDataState, {
      type: DECREMENT_GROUPING,
    });

    expect(result.grouping).toEqual(expected);
  });

  it("set_error will set socketState to 'error'", () => {
    const expected = "error";
    const intiialDataState = {
      ...initialState,
      status: "unset",
    };

    const result = reducer(intiialDataState, {
      type: SET_ERROR,
    });

    expect(result.socketState).toEqual(expected);
  });
});
