
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface PredictionChartProps {
  actualPrices: number[];
  predictedPrices: number[];
  futurePrices: number[];
  nSteps?: number;
}

const PredictionChart: React.FC<PredictionChartProps> = ({ 
  actualPrices, 
  predictedPrices, 
  futurePrices,
  nSteps = 60
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Format data for chart
  const chartData = [];
  
  // Add actual prices
  for (let i = 0; i < actualPrices.length; i++) {
    chartData.push({
      index: i,
      actual: actualPrices[i],
      predicted: i >= nSteps ? predictedPrices[i - nSteps] : null,
      future: null
    });
  }
  
  // Add future prices
  for (let i = 0; i < futurePrices.length; i++) {
    chartData.push({
      index: actualPrices.length + i,
      actual: null,
      predicted: null,
      future: futurePrices[i]
    });
  }

  // Animation effect for chart
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.classList.add('animate-fadeIn');
    }
  }, [actualPrices, predictedPrices, futurePrices]);

  return (
    <Card className="shadow-sm w-full overflow-hidden" ref={chartRef}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Stock Price Prediction</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-chart-grid/30" />
              <XAxis 
                dataKey="index" 
                label={{ value: 'Days', position: 'insideBottomRight', offset: -10 }}
                className="text-xs"
              />
              <YAxis 
                label={{ value: 'Price', angle: -90, position: 'insideLeft' }}
                className="text-xs"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: any) => [value ? value.toFixed(2) : 'N/A', '']}
                labelFormatter={(value) => `Day ${value}`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="actual"
                name="Actual Price"
                stroke="#1e40af"
                fill="#3b82f6"
                fillOpacity={0.2}
                strokeWidth={2}
                activeDot={{ r: 6 }}
                isAnimationActive={true}
                animationDuration={1000}
              />
              <Area
                type="monotone"
                dataKey="predicted"
                name="Predicted Price"
                stroke="#b91c1c"
                fill="#ef4444"
                fillOpacity={0.2}
                strokeWidth={2}
                isAnimationActive={true}
                animationDuration={1500}
                animationBegin={300}
              />
              <Area
                type="monotone"
                dataKey="future"
                name="Future Prediction"
                stroke="#047857"
                fill="#10b981"
                fillOpacity={0.2}
                strokeWidth={2}
                isAnimationActive={true}
                animationDuration={2000}
                animationBegin={600}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionChart;
