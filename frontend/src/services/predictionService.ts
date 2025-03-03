import { StockData, PredictionResults } from '@/lib/types'
import * as tf from '@tensorflow/tfjs'

// Constants from your Python code
const N_STEPS = 60
const FUTURE_DAYS = 50

// Load the model
async function loadModel() {
  try {
    // Load model from the public folder
    return await tf.loadLayersModel('public/final_model_60_noEps.keras')
  } catch (error) {
    console.error('Error loading model:', error)
    throw new Error('Failed to load the prediction model')
  }
}

// Function to simulate MinMaxScaler
function minMaxScale(
  data: number[][],
  featureRange = [0, 1]
): {
  scaled: number[][]
  mins: number[]
  maxs: number[]
} {
  const columns = data[0].length
  const mins: number[] = Array(columns).fill(Infinity)
  const maxs: number[] = Array(columns).fill(-Infinity)

  // Find min and max for each column
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < columns; j++) {
      mins[j] = Math.min(mins[j], data[i][j])
      maxs[j] = Math.max(maxs[j], data[i][j])
    }
  }

  // Scale data
  const scaled = data.map((row) =>
    row.map((val, j) => {
      const min = mins[j]
      const max = maxs[j]
      const range = max - min
      if (range === 0) return featureRange[0] // Handle division by zero
      return (
        ((val - min) / range) * (featureRange[1] - featureRange[0]) +
        featureRange[0]
      )
    })
  )

  return { scaled, mins, maxs }
}

// Function to inverse transform scaled data
function inverseTransform(
  scaledData: number[][],
  mins: number[],
  maxs: number[],
  featureRange = [0, 1]
): number[][] {
  return scaledData.map((row) =>
    row.map((val, j) => {
      const min = mins[j]
      const max = maxs[j]
      return (
        ((val - featureRange[0]) / (featureRange[1] - featureRange[0])) *
          (max - min) +
        min
      )
    })
  )
}

// Function to create sequences for time series prediction
function createSequences(
  data: number[][],
  nSteps: number
): { X: number[][][]; y: number[][] } {
  const X: number[][][] = []
  const y: number[][] = []

  for (let i = 0; i < data.length - nSteps; i++) {
    X.push(data.slice(i, i + nSteps))
    y.push(data[i + nSteps])
  }

  return { X, y }
}

// Function to predict using the loaded model
async function predictWithModel(
  model: tf.LayersModel,
  input: number[][][]
): Promise<number[][]> {
  const inputTensor = tf.tensor3d(input)
  const predictions = (await model.predict(inputTensor)) as tf.Tensor
  const result = (await predictions.array()) as number[][]

  // Clean up tensors
  inputTensor.dispose()
  predictions.dispose()

  return result
}

// Recursive future predictions
async function predictFuture(
  model: tf.LayersModel,
  sequence: number[][],
  nSteps: number,
  futureDays: number,
  mins: number[],
  maxs: number[]
): Promise<number[][]> {
  const predicted: number[][] = []
  let currentSequence = [...sequence] // Clone to avoid modifying the original

  for (let i = 0; i < futureDays; i++) {
    // Use the last nSteps of currentSequence for prediction
    const input = [currentSequence.slice(-nSteps)]
    const prediction = await predictWithModel(model, input)

    predicted.push(prediction[0])

    // Update the sequence by removing the first value and adding the prediction
    currentSequence.shift()
    currentSequence.push(prediction[0])
  }

  // Inverse transform the predictions to get the actual values
  return inverseTransform(predicted, mins, maxs)
}

// Calculate evaluation metrics
function calculateMetrics(
  actual: number[][],
  predicted: number[][]
): {
  closePrice: { mae: number; r2: number; mse: number; mape?: number }
  overall: { mae: number; r2: number; mse: number; mape?: number }
} {
  // Mean Absolute Error
  const mae = (actual: number[], predicted: number[]): number => {
    return (
      actual.reduce((sum, val, i) => sum + Math.abs(val - predicted[i]), 0) /
      actual.length
    )
  }

  // Mean Squared Error
  const mse = (actual: number[], predicted: number[]): number => {
    return (
      actual.reduce((sum, val, i) => sum + Math.pow(val - predicted[i], 2), 0) /
      actual.length
    )
  }

  // R² Score (simplified)
  const r2 = (actual: number[], predicted: number[]): number => {
    const mean = actual.reduce((sum, val) => sum + val, 0) / actual.length
    const totalSS = actual.reduce(
      (sum, val) => sum + Math.pow(val - mean, 2),
      0
    )
    const residualSS = actual.reduce(
      (sum, val, i) => sum + Math.pow(val - predicted[i], 2),
      0
    )
    return Math.max(0, 1 - residualSS / totalSS) // Ensure not negative for visualization
  }

  // Mean Absolute Percentage Error
  const mape = (actual: number[], predicted: number[]): number => {
    return (
      (actual.reduce((sum, val, i) => {
        return val !== 0 ? sum + Math.abs((val - predicted[i]) / val) : sum
      }, 0) /
        actual.length) *
      100
    )
  }

  // Calculate metrics for Close Price (index 3 is Ltp)
  const actualClose = actual.map((row) => row[3])
  const predictedClose = predicted.map((row) => row[3])
  const closeMetrics = {
    mae: mae(actualClose, predictedClose),
    mse: mse(actualClose, predictedClose),
    r2: r2(actualClose, predictedClose),
    mape: mape(actualClose, predictedClose),
  }

  // Calculate overall metrics (flatten arrays)
  const actualFlat: number[] = []
  const predictedFlat: number[] = []

  actual.forEach((row) => row.forEach((val) => actualFlat.push(val)))
  predicted.forEach((row) => row.forEach((val) => predictedFlat.push(val)))

  const overallMetrics = {
    mae: mae(actualFlat, predictedFlat),
    mse: mse(actualFlat, predictedFlat),
    r2: r2(actualFlat, predictedFlat),
    mape: mape(actualFlat, predictedFlat),
  }

  return { closePrice: closeMetrics, overall: overallMetrics }
}

// Main prediction function
export async function predictStockPrices(
  stockData: StockData[]
): Promise<PredictionResults> {
  try {
    // Show loading message in console for debugging
    console.log('Loading TensorFlow.js model...')

    // Load the model
    const model = await loadModel()
    console.log('Model loaded successfully')

    // Extract features from stock data
    const featureColumns = ['Open', 'High', 'Low', 'Ltp', '% Change', 'Qty']
    const data = stockData.map((row) => featureColumns.map((col) => row[col]))

    // Scale data
    const { scaled, mins, maxs } = minMaxScale(data)

    // Create sequences
    const { X, y } = createSequences(scaled, N_STEPS)

    // Model prediction
    console.log('Generating predictions...')
    const testResult = await predictWithModel(model, X)

    // Inverse transform predictions
    const testResultInverse = inverseTransform(testResult, mins, maxs)

    // Calculate metrics
    const metrics = calculateMetrics(y, testResult)

    // Predict future prices
    console.log('Predicting future prices...')
    const futurePrices = await predictFuture(
      model,
      scaled,
      N_STEPS,
      FUTURE_DAYS,
      mins,
      maxs
    )

    // Convert future prices to StockData format
    const futurePricesData: StockData[] = futurePrices.map((row) => {
      const result: any = {}
      featureColumns.forEach((col, i) => {
        result[col] = row[i]
      })
      return result as StockData
    })

    // Extract actual and predicted closing prices for charting
    const actualPrices = stockData.map((row) => row.Ltp)
    const predictedPrices = testResultInverse.map((row) => row[3]) // 3 is index of Ltp

    console.log('Prediction process completed')

    return {
      metrics,
      actualPrices,
      predictedPrices,
      futurePrices: futurePricesData,
    }
  } catch (error) {
    console.error('Error in prediction process:', error)
    throw new Error('Failed to generate predictions')
  }
}

// Function to parse CSV file
export function parseCSV(csvText: string): StockData[] {
  const lines = csvText.trim().split('\n')
  const headers = lines[0].split(',')

  return lines.slice(1).map((line) => {
    const values = line.split(',')
    const row: any = {}

    headers.forEach((header, i) => {
      row[header] = isNaN(Number(values[i])) ? values[i] : Number(values[i])
    })

    return row as StockData
  })
}
