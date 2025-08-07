'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFilesUpload: (files: File[]) => void;
}

export default function FileUpload({ onFilesUpload }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesUpload(acceptedFiles);
  }, [onFilesUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
      'text/tab-separated-values': ['.tsv'],
      'application/gzip': ['.gz'],
      'application/zip': ['.zip'],
    },
    maxFiles: 3,
  });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center w-full max-w-xl p-16 border-2 border-dashed rounded-xl cursor-pointer transition-colors
      ${isDragActive ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        {isDragActive ? (
          <p className="text-xl font-semibold text-blue-700">Drop the files here!</p>
        ) : (
          <>
            <button
              type="button"
              className="px-10 py-5 bg-blue-600 text-white text-lg font-bold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-transform transform hover:scale-105"
            >
              Upload GWAS Files
            </button>
            <p className="mt-4 text-md text-gray-600">or drag and drop</p>
            <p className="text-xs text-gray-500 mt-2">Up to 3 files (.txt, .csv, .tsv, .gz, .zip)</p>
          </>
        )}
      </div>
    </div>
  );
}


