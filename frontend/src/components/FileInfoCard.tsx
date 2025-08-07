'use client';

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

interface FileInfoCardProps {
  fileInfo: FileInfo;
}

export default function FileInfoCard({ fileInfo }: FileInfoCardProps) {
  return (
    <div className="w-full max-w-4xl p-6 mb-8 bg-white border border-blue-100 rounded-xl shadow-lg hover:shadow-blue-200/50 transition-shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{fileInfo.fileName}</h2>

      {/* Data Preview Table */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">File Preview (Header and first 6 rows)</h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-blue-600 text-white">
              <tr>
                {fileInfo.header.map((col, index) => (
                  <th key={index} className="py-3 px-4 text-left font-semibold">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {fileInfo.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="py-3 px-4">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Column Mapping Results */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Standardized Header Mapping</h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left font-semibold">Standard Column</th>
                <th className="py-3 px-4 text-left font-semibold">Mapped From</th>
                <th className="py-3 px-4 text-left font-semibold">Match Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(fileInfo.column_mapping).map(([stdCol, mapping]) => (
                <tr key={stdCol} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{stdCol}</td>
                  <td className="py-3 px-4">{mapping.mapped_from}</td>
                  <td className="py-3 px-4">{mapping.score}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Warnings and Errors */}
      {fileInfo.warnings.length > 0 && (
        <div className="p-4 mb-4 text-sm text-yellow-800 bg-yellow-100 rounded-lg border border-yellow-200" role="alert">
          <h4 className="font-bold">Warnings</h4>
          <ul className="mt-2 list-disc list-inside">
            {fileInfo.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {fileInfo.errors.length > 0 && (
        <div className="p-4 text-sm text-red-800 bg-red-100 rounded-lg border border-red-200" role="alert">
          <h4 className="font-bold">Errors</h4>
          <ul className="mt-2 list-disc list-inside">
            {fileInfo.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

