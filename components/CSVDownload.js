"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const CSVDownloader = ({ csvData, uid, start, end }) => {
  const [loading, setLoading] = useState(false);
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

  async function updateCount(uid, start, end) {
    try {
      setLoading(true);

      const { data: fetchLog, error: fetchError } = await supabase
        .from("logs")
        .select("*")
        .eq("start", start)
        .eq("end", end)
        .single();
      if (fetchLog) {
        toast.message("User has downloaded but not uploaded the file yet!");
        if (fetchLog.uid === uid) {
          downloadRows(start, end)
        } else {
          toast.error("This range is already downloaded by another user! Please login again!")
          window.location.reload()
        }
      } else {
        const { data: logData, error: logError } = await supabase
          .from("logs")
          .insert([{ uid, start, end }])
          .select();

        const { data: countData, error: countError } = await supabase
          .from("count")
          .update({ last_collected_num: end })
          .eq("id", 1)
          .select();

        if (countError || logError) {
          console.error("Count Error:", countError);
          console.error("Log Error:", logError);
        }
        if (countData && logData) {
          downloadRows(start, end);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button onClick={() => {
        updateCount(uid, start, end)
      }} disabled={loading}>
        <Loader className="mr-2 animate-spin" size={16} hidden={!loading} />
        Download Rows {start} to {end}
      </Button>
    </div>
  );
};

export default CSVDownloader;
