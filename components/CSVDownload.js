"use client";

import { Button } from "./ui/button";

const CSVDownloader = ({ csvData, start, end }) => {
  const downloadRows = (startIndex, endIndex) => {
    const rows = csvData.split('\n');
    const header = rows[0]; // Header as a string
    const snoIndex = header.indexOf('Sno');

    if (snoIndex === -1) {
      console.error('Sno column not found in the header');
      return;
    }

    const selectedRows = rows
      .slice(1) // Exclude the header
      .filter((row) => {
        const sno = row.split(',')[snoIndex];
        return sno >= startIndex && sno <= endIndex;
      })
      .join('\n');

    const csvContent = `${header}\n${selectedRows}`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `selected_rows_${startIndex}_${endIndex}.csv`;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Button onClick={() => downloadRows(start, end)}>
        Download Rows {start} to {end}
      </Button>
    </div>
  );
};

export default CSVDownloader;
