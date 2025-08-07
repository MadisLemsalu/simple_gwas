'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import FileInfoCard from '@/components/FileInfoCard';

interface FileInfo {
  fileName: string;
  header: string[];
  rows: (string | number)[][];
  column_mapping: {
    [key: string]: {
      mapped_from: string;
      score: number;
    };
  };
  warnings: string[];
  errors: string[];
}

export default function Home() {
  const [fileInfos, setFileInfos] = useState<FileInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilesUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setIsLoading(true);
    setError(null);
    setFileInfos([]);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/upload/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Server responded with an error');
      }

      const data = await response.json();
      setFileInfos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">GWAS Header Standardizer</h1>
          <p className="text-md text-gray-600 mt-2">
            Upload your GWAS files to automatically standardize the headers.
          </p>
        </header>

        <div className="flex justify-center mb-10">
          <FileUpload onFilesUpload={handleFilesUpload} />
        </div>

        {isLoading && (
          <div className="text-center">
            <p className="text-lg text-blue-600">Processing files, please wait...</p>
          </div>
        )}

        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        <div className="space-y-8">
          {fileInfos.map((info, index) => (
            <FileInfoCard key={index} fileInfo={info} />
          ))}
        </div>
      </div>
    </main>
  );
}
