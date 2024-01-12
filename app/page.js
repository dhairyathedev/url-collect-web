import { supabase } from '@/lib/supabase'
import React from 'react'
import CSVDownloader from '@/components/CSVDownload'

const fs = require('fs')
const path = require('path')

export const revalidate = 0

export default async function Page() {
  const { data: count } = await supabase.from("count").select("*").eq("id", 1).single()
  const csvFile = path.join(process.cwd(), 'public', 'college_list.csv')
  const csvData = fs.readFileSync(csvFile, 'utf8')
  return (
    <>
      <div className="max-w-screen-md mx-auto m-2 p-4">
        <h1 className="text-3xl font-bold">Email Collector</h1>
        <div className="mt-4 flex flex-col space-y-3">
          {count && (
            <>
              <p className="text-xl">You will be collecting the email for the : <span className="uppercase">{count.name}</span></p>
              <p className="text-xl">Total Universites completed for email collecting: {count.total_collected_num}</p>
              <p className="text-xl">Last item in the CSV: {count.last_collected_num}</p>
              <p className="text-xl">Step Count in CSV: {count.step}</p>
            </>
          )}
        </div>
        <div className="mt-4">
            <CSVDownloader csvData={csvData} start={count.last_collected_num+1} end={count.last_collected_num + count.step}/>
        </div>
      </div>
    </>
  )
}
