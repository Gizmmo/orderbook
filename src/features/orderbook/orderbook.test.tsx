import { fireEvent, render } from "@testing-library/react";
import { Orderbook } from "./orderbook";
import { Server } from "mock-socket";
import { act } from "react-dom/test-utils";
import { groupingAmounts, initialState } from "./reducer";

describe("Orderbook", () => {
  let mockServer: Server;

  function createMockServer(returnNumber: number, isError = false) {
    mockServer = new Server("wss://www.cryptofacilities.com/ws/v1");
  }

  const data = {
    feed: "book_ui_1_snapshot",
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

  beforeEach(() => {
    createMockServer(WebSocket.OPEN);
  });

  afterEach(() => {
    mockServer.close();
  });

  it("if error return error message", async () => {
    const { findByText } = render(<Orderbook />);

    act(() => {
      mockServer.emit("error", "error");
    });

    const result = await findByText(/error with your websocket/);
    expect(result).toBeTruthy();
  });

  it("before connection, render loading", async () => {
    const { findByText } = render(<Orderbook />);

    const result = await findByText(/Loading/);
    expect(result).toBeInTheDocument();
  });

  it("on successful connection, render orderbook", async () => {
    const { findByText } = render(<Orderbook />);

    act(() => {
      mockServer.emit("message", JSON.stringify(data));
    });

    const result = await findByText(/Grouping/);
    expect(result).toBeInTheDocument();
  });

  it("on update message, bids are updated correctly", async () => {
    const { findAllByText, queryByText } = render(<Orderbook />);

    const queryResult = queryByText(61);
    expect(queryResult).not.toBeInTheDocument();

    act(() => {
      mockServer.emit("message", JSON.stringify(data));
      mockServer.emit(
        "message",
        JSON.stringify({ feed: "book_ui_1", bids: [[4, 1]], asks: [] })
      );
    });

    const result = await findAllByText(61);
    expect(result.length).toBeGreaterThan(0);
  });

  it("clicking increment row increases the number of rows displayed", async () => {
    const { findByLabelText, findByText } = render(<Orderbook />);

    act(() => {
      mockServer.emit("message", JSON.stringify(data));
    });

    const increaseButton = await findByLabelText("Increment Rows");
    fireEvent.click(increaseButton);

    const rows = await findByText(initialState.rows + 1);
    expect(rows).toBeInTheDocument();
  });

  it("clicking decrement row will decrease the visible rows", async () => {
    const { findByLabelText, findByText } = render(<Orderbook />);

    act(() => {
      mockServer.emit("message", JSON.stringify(data));
    });

    const decreaseButton = await findByLabelText("Decrement Rows");
    fireEvent.click(decreaseButton);

    const rows = await findByText(initialState.rows - 1);
    expect(rows).toBeInTheDocument();
  });

  it("clicking the + on grouping increasing grouping value", async () => {
    const { findByLabelText, findAllByText, queryByText } = render(
      <Orderbook />
    );

    act(() => {
      mockServer.emit("message", JSON.stringify(data));
    });
    const index = groupingAmounts.findIndex(
      (amount) => amount === initialState.grouping
    );
    const amountToBe = groupingAmounts[index + 1];

    const originalAmountsOnScreen = queryByText(amountToBe);
    expect(originalAmountsOnScreen).not.toBeInTheDocument();

    const increaseButton = await findByLabelText("Increment Grouping");
    fireEvent.click(increaseButton);

    const grouping = await findAllByText(amountToBe);
    expect(grouping.length).toBeGreaterThan(0);
  });

  it("clicking the - on grouping increasing grouping value", async () => {
    const { findByLabelText, findAllByText, queryByText } = render(
      <Orderbook />
    );

    act(() => {
      mockServer.emit("message", JSON.stringify(data));
    });
    const index = groupingAmounts.findIndex(
      (amount) => amount === initialState.grouping
    );
    const amountToBe = groupingAmounts[index - 1];

    const originalAmountsOnScreen = queryByText(amountToBe);
    expect(originalAmountsOnScreen).not.toBeInTheDocument();

    const decreaseButton = await findByLabelText("Decrement Grouping");
    fireEvent.click(decreaseButton);

    const grouping = await findAllByText(amountToBe);
    expect(grouping.length).toBeGreaterThan(0);
  });
});
