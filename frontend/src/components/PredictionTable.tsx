
import React from 'react';
import { StockData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PredictionTableProps {
  futureData: StockData[];
}

const PredictionTable: React.FC<PredictionTableProps> = ({ futureData }) => {
  const handleDownloadCSV = () => {
    if (!futureData.length) return;
    
    // Get headers from the first object
    const headers = Object.keys(futureData[0]);
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...futureData.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'predicted_future_prices.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <Card className="shadow-sm w-full overflow-hidden animate-fadeIn">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Future Price Predictions</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] rounded-md border">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead className="w-[80px]">Day</TableHead>
                <TableHead>Open</TableHead>
                <TableHead>High</TableHead>
                <TableHead>Low</TableHead>
                <TableHead>Close (Ltp)</TableHead>
                <TableHead>% Change</TableHead>
                <TableHead>Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {futureData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{row.Open.toFixed(2)}</TableCell>
                  <TableCell>{row.High.toFixed(2)}</TableCell>
                  <TableCell>{row.Low.toFixed(2)}</TableCell>
                  <TableCell className="font-semibold">{row.Ltp.toFixed(2)}</TableCell>
                  <TableCell>{row['% Change'].toFixed(2)}%</TableCell>
                  <TableCell>{Math.round(row.Qty)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleDownloadCSV}
          className="flex items-center gap-2"
        >
          <Download size={16} />
          Download CSV
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PredictionTable;
