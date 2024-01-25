"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { COUNT_ID } from "@/lib/consts";

const CSVDownloader = ({ csvData, uid, start, end }) => {
  const [loading, setLoading] = useState(false);
  const downloadRows = (startIndex, endIndex) => {
    const rows = csvData.split('\n');
    const header = rows[0]; // Header as a string
    const idIndex = header.indexOf('id');

    if (idIndex === -1) {
      console.error('id column not found in the header');
      return;
    }

    const selectedRows = rows
      .slice(1) // Exclude the header
      .filter((row) => {
        const idno = row.split(',')[idIndex];
        return idno >= startIndex && idno <= endIndex;
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
          .insert([{ uid, start, end, for: COUNT_ID }])
          .select();

        const { data: countData, error: countError } = await supabase
          .from("count")
          .update({ last_collected_num: end })
          .eq("id", COUNT_ID)
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
