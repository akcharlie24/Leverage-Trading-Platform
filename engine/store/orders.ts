enum OrderType {
  "long",
  "short",
}

enum StatusType {
  "open",
  "closed",
}

interface Order {
  orderId: string;
  userId: string;
  type: OrderType;
  status: StatusType;
  openingPrice: bigint;
  closingPrice: bigint;
  margin: bigint;
  liquidationPrice: bigint;
  pnl: number;
  leverage: number;
  timestamp: number;
}

export const positions: Map<string, Order> = new Map();
