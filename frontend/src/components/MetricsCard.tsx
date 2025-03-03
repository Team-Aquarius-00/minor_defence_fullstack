
import React from 'react';
import { PredictionMetrics } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MetricsCardProps {
  metrics: PredictionMetrics;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ metrics }) => {
  return (
    <Card className="shadow-sm w-full overflow-hidden animate-fadeIn">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Model Evaluation Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="close">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="close">Close Price (Ltp)</TabsTrigger>
            <TabsTrigger value="overall">Overall (All Features)</TabsTrigger>
          </TabsList>
          <TabsContent value="close" className="pt-4 animate-slideUp">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricItem 
                title="MAE"
                value={metrics.closePrice.mae.toFixed(4)}
                tooltip="Mean Absolute Error"
              />
              <MetricItem 
                title="R²"
                value={metrics.closePrice.r2.toFixed(4)}
                tooltip="R-squared Score"
              />
              <MetricItem 
                title="MSE"
                value={metrics.closePrice.mse.toFixed(4)}
                tooltip="Mean Squared Error"
              />
              <MetricItem 
                title="MAPE"
                value={metrics.closePrice.mape ? `${metrics.closePrice.mape.toFixed(2)}%` : 'N/A'}
                tooltip="Mean Absolute Percentage Error"
              />
            </div>
          </TabsContent>
          <TabsContent value="overall" className="pt-4 animate-slideUp">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricItem 
                title="MAE"
                value={metrics.overall.mae.toFixed(4)}
                tooltip="Mean Absolute Error"
              />
              <MetricItem 
                title="R²"
                value={metrics.overall.r2.toFixed(4)}
                tooltip="R-squared Score"
              />
              <MetricItem 
                title="MSE"
                value={metrics.overall.mse.toFixed(4)}
                tooltip="Mean Squared Error"
              />
              <MetricItem 
                title="MAPE"
                value={metrics.overall.mape ? `${metrics.overall.mape.toFixed(2)}%` : 'N/A'}
                tooltip="Mean Absolute Percentage Error"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface MetricItemProps {
  title: string;
  value: string;
  tooltip: string;
}

const MetricItem: React.FC<MetricItemProps> = ({ title, value, tooltip }) => {
  return (
    <div className="flex flex-col items-center justify-center p-3 bg-secondary/50 rounded-lg">
      <div className="text-sm text-muted-foreground" title={tooltip}>{title}</div>
      <div className="text-lg font-semibold mt-1">{value}</div>
    </div>
  );
};

export default MetricsCard;
