import React, { useState } from 'react'
import Layout from '@/components/Layout'
import FileUpload from '@/components/FileUpload'
import MetricsCard from '@/components/MetricsCard'
import PredictionChart from '@/components/PredictionChart'
import PredictionTable from '@/components/PredictionTable'
import { StockData, PredictionResults } from '@/lib/types'
import { parseCSV, predictStockPrices } from '@/services/predictionService'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, BarChart4, FileText, LineChart } from 'lucide-react'
// import from task
import FileUploader from '@/tasks/FileUploader.js'
import PredictionFinal from '@/tasks/PredictionFinal.js'
import ShowCloseGraph from '@/tasks/ShowCloseGraph'

const Index = () => {
  const [stockData, setStockData] = useState<StockData[] | null>(null)
  const [predictionResults, setPredictionResults] =
    useState<PredictionResults | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  // const [results, setResults] = useState(null)

  const handleFileUpload = async (data: StockData[]) => {
    setStockData(data)
    setPredictionResults(null)
  }

  const handleLoadSample = async () => {
    // try {
    //   const response = await fetch('/sample-stock-data.csv')
    //   const text = await response.text()
    //   const data = parseCSV(text)
    //   setStockData(data)
    //   setPredictionResults(null)
    //   toast.success('Sample data loaded successfully')
    // } catch (error) {
    //   console.error('Error loading sample data:', error)
    //   toast.error('Failed to load sample data')
    // }
  }

  // const handlePredict = async () => {
  //   if (!stockData) return

  //   try {
  //     setIsLoading(true)
  //     toast.info('Processing stock data and generating predictions...')

  //     // Simulate API call with our service
  //     const results = await predictStockPrices(stockData)
  //     setPredictionResults(results)

  //     toast.success('Prediction completed successfully')
  //   } catch (error) {
  //     console.error('Prediction error:', error)
  //     toast.error('Error generating predictions')
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }
  const [results, setResults] = useState(null)
  const [showPredictionFinal, setShowPredictionFinal] = useState(false)

  return (
    <Layout>
      <div className='space-y-8 max-w-5xl mx-auto'>
        <section className='text-center space-y-4'>
          <div className='inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2'>
            Powered by LSTM Neural Networks
          </div>
          <h1 className='text-4xl font-bold tracking-tight'>
            Stock Price Prediction
          </h1>
          <p className='text-muted-foreground text-lg max-w-3xl mx-auto'>
            Upload your stock data CSV file and get accurate predictions using
            advanced machine learning algorithms.
          </p>
        </section>

        <Separator />

        <section className='grid md:grid-cols-3 gap-6'>
          <Card className='md:col-span-1 shadow-sm h-fit'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <FileText className='h-5 w-5' />
                <span>Data Input</span>
              </CardTitle>
              <CardDescription>
                Upload your CSV file with stock price data or use our sample
                data
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* <FileUpload
                onFileUpload={handleFileUpload}
                isLoading={isLoading}
              /> */}

              <FileUploader setResults={setResults} />

              <div className='flex items-center space-x-2'>
                <div className='flex-1 h-px bg-border'></div>
                <span className='text-xs text-muted-foreground'>OR</span>
                <div className='flex-1 h-px bg-border'></div>
              </div>
              <Button
                variant='outline'
                className='w-full'
                onClick={handleLoadSample}
                disabled={isLoading}
              >
                Load Sample Data
              </Button>
              {/* {stockData && (
                <Button
                  className='w-full flex items-center gap-2'
                  onClick={handlePredict}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Generate Predictions'}
                  {!isLoading && <ArrowRight className='h-4 w-4' />}
                </Button>
              )} */}
            </CardContent>
          </Card>

          <Card className='md:col-span-2 shadow-sm'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <BarChart4 className='h-5 w-5' />
                <span>How It Works</span>
              </CardTitle>
              <CardDescription>
                Our LSTM model analyzes historical stock data to predict future
                prices
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='flex flex-col items-center text-center p-4 rounded-lg bg-secondary/50'>
                  <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3'>
                    <span className='font-medium'>1</span>
                  </div>
                  <h3 className='font-medium mb-1'>Upload Data</h3>
                  <p className='text-sm text-muted-foreground'>
                    Provide CSV file with stock price history
                  </p>
                </div>

                <div className='flex flex-col items-center text-center p-4 rounded-lg bg-secondary/50'>
                  <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3'>
                    <span className='font-medium'>2</span>
                  </div>
                  <h3 className='font-medium mb-1'>Model Processing</h3>
                  <p className='text-sm text-muted-foreground'>
                    LSTM neural network analyzes price patterns
                  </p>
                </div>

                <div className='flex flex-col items-center text-center p-4 rounded-lg bg-secondary/50'>
                  <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3'>
                    <span className='font-medium'>3</span>
                  </div>
                  <h3 className='font-medium mb-1'>Get Predictions</h3>
                  <p className='text-sm text-muted-foreground'>
                    View and download accurate price forecasts
                  </p>
                </div>
              </div>

              <div className='bg-secondary/30 p-4 rounded-lg border border-border/50'>
                <h3 className='font-medium text-sm mb-2 flex items-center gap-2'>
                  <LineChart className='h-4 w-4 text-primary' />
                  Expected CSV Format
                </h3>
                <p className='text-sm text-muted-foreground mb-2'>
                  Your CSV should include these columns: Open, High, Low, Ltp
                  (Close), % Change, Qty
                </p>
                <div className='overflow-x-auto text-xs'>
                  <pre className='bg-card p-2 rounded border border-border/50'>
                    Open,High,Low,Ltp,% Change,Qty
                    145.23,146.78,144.56,146.32,0.75,15634
                    146.54,148.92,145.87,148.45,1.46,18934 ...
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {predictionResults && (
          <div className='space-y-8 animate-fadeIn'>
            <Separator />

            {/* <section>
              <h2 className='text-2xl font-bold mb-6'>Prediction Results</h2>
              <div className='space-y-6'>
                <PredictionChart
                  actualPrices={predictionResults.actualPrices}
                  predictedPrices={predictionResults.predictedPrices}
                  futurePrices={predictionResults.futurePrices.map(
                    (p) => p.Ltp
                  )}
                />

                <div className='grid md:grid-cols-2 gap-6'>
                  <MetricsCard metrics={predictionResults.metrics} />
                  <PredictionTable
                    futureData={predictionResults.futurePrices}
                  />
                </div>
              </div>
            </section> */}
          </div>
        )}
        <Separator />
        {/* <Card className='md:col-span-2 shadow-sm'> */}
        {results && <ShowCloseGraph results={results} />}
        <Button
          className='flex items-center gap-2'
          onClick={() => setShowPredictionFinal(true)}
        >
          Generate Prediction
        </Button>
        {showPredictionFinal && <PredictionFinal results={results} />}
      </div>
    </Layout>
  )
}

export default Index
