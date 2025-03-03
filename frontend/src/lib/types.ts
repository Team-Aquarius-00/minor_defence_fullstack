
export interface StockData {
  Open: number;
  High: number;
  Low: number;
  Ltp: number;
  "% Change": number;
  Qty: number;
  [key: string]: number;
}

export interface PredictionMetrics {
  closePrice: {
    mae: number;
    r2: number;
    mse: number;
    mape: number;
  };
  overall: {
    mae: number;
    r2: number;
    mse: number;
    mape: number;
  };
}

export interface PredictionResults {
  metrics: PredictionMetrics;
  actualPrices: number[];
  predictedPrices: number[];
  futurePrices: StockData[];
}
