
import React, { useRef, useState, ChangeEvent } from 'react';
import { Upload, FileWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FileUploadProps {
  onFileUpload: (data: any[]) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleFile(file);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = async (file?: File) => {
    if (!file) return;

    // Check if file is CSV
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setFileName(file.name);
    
    try {
      const text = await file.text();
      const rows = text.split('\n');
      const headers = rows[0].split(',');
      
      const data = rows.slice(1).map(row => {
        const values = row.split(',');
        return headers.reduce((obj: any, header, i) => {
          obj[header] = isNaN(Number(values[i])) ? values[i] : Number(values[i]);
          return obj;
        }, {});
      });
      
      onFileUpload(data);
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Error processing file. Please check the format.');
    }
  };

  return (
    <div 
      className={`relative h-64 p-8 rounded-xl border-2 border-dashed transition-all ${
        dragActive ? 'border-primary bg-primary/5' : 'border-border'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
      />
      
      <div className="h-full flex flex-col items-center justify-center space-y-4 text-center">
        {fileName ? (
          <>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{fileName}</p>
              <p className="text-xs text-muted-foreground mt-1">CSV file uploaded successfully</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              Change file
            </Button>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              <Upload size={24} className="text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Upload your CSV file</p>
              <p className="text-sm text-muted-foreground mt-1">
                Drag and drop or click to browse
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              Select CSV File
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
