import React from 'react'
import Plot from 'react-plotly.js'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ArrowRight, BarChart4, FileText, LineChart } from 'lucide-react'

const PredictionFinal = ({ results }) => {
  const {
    actual_prices,
    predicted_prices,
    future_prices,
    future_days,
    columns,
    future_prices_json,
    data_df_json,
  } = results

  const futureDaysRange = [...Array(future_days).keys()].map(
    (i) => actual_prices.length + i
  )

  const futureLtp = future_prices.map((price) => price[3]) // 'Ltp' column is 3rd index

  return (
    <div>
      <section className='text-center space-y-4'>
        <Card className='md:col-span-1 shadow-sm h-fit'>
          <CardHeader>
            {/* <CardTitle className='flex items-center gap-2'>
              
              <span className='text-center'>Predicted Metrices</span>
            </CardTitle> */}
            <div>
              <strong className='mb-10'> Predicted Metrics:</strong>
              <ol>
                {Object.entries(results.metrics).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value.toFixed(6)}
                  </li>
                ))}
              </ol>
            </div>
          </CardHeader>
        </Card>
        <Card className='md:col-span-2 shadow-sm'>
          <Plot
            data={[
              {
                x: [...Array(actual_prices.length).keys()],
                y: actual_prices,
                type: 'scatter',
                mode: 'lines',
                name: 'Actual Prices',
              },
              {
                x: [...Array(predicted_prices.length).keys()].map(
                  (i) => i + 60
                ),
                y: predicted_prices,
                type: 'scatter',
                mode: 'lines',
                name: 'Predicted Prices',
              },
              {
                x: futureDaysRange,
                y: futureLtp,
                type: 'scatter',
                mode: 'lines',
                name: 'Future Close_Price 50 days',
              },
            ]}
            layout={{
              title: {
                text: 'Stock Price Prediction',
                font: { color: 'black' },
              },
              xaxis: { title: { text: 'Date', font: { color: 'black' } } },
              yaxis: { title: { text: 'Price', font: { color: 'black' } } },
            }}
          />
        </Card>
        {/* Future Prices Table */}
        {/* <Card className='shadow-sm'>
          <CardHeader>
            <strong>Future Stock Prices</strong>
          </CardHeader>
          <CardContent>
            <table className='w-full border-collapse border border-gray-200'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border border-gray-300 px-4 py-2'>Day</th>
                  <th className='border border-gray-300 px-4 py-2'>
                    Predicted Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {futureDaysRange.map((day, index) => (
                  <tr key={index} className='border border-gray-300'>
                    <td className='border border-gray-300 px-4 py-2'>{day}</td>
                    <td className='border border-gray-300 px-4 py-2'>
                      {futureLtp[index].toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card> */}
        {/* Future Prices Table */}
        <Card className='shadow-sm'>
          <CardHeader>
            <strong>Future Stock Prices</strong>
          </CardHeader>
          <CardContent>
            <table className='w-full border-collapse border border-gray-200'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border border-gray-300 px-4 py-2'>Day</th>
                  {Object.keys(future_prices_json[0]).map((key) => (
                    <th key={key} className='border border-gray-300 px-4 py-2'>
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {futureDaysRange.map((day, index) => (
                  <tr key={index} className='border border-gray-300'>
                    <td className='border border-gray-300 px-4 py-2'>{day}</td>
                    {Object.values(future_prices_json[index]).map(
                      (value, i) => (
                        <td
                          key={i}
                          className='border border-gray-300 px-4 py-2'
                        >
                          {value.toFixed(2)}
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

export default PredictionFinal
