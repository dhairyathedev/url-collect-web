import { useEffect, useRef, useState } from "react"
import { Button } from "./ui/button";
import html2canvas from "html2canvas";
import { supabase } from "@/lib/supabase";
export default function Certificate({name, forWhat, uid,}) {

    const printRef = useRef()
    const [totalURLCount, setTotalURLCount] = useState(0)
    const handleDownloadImage = async () => {
        const element = printRef.current;
      
        element.style.width = "800px"; 
        element.style.height = "auto";
      
        const canvas = await html2canvas(element, {
          scrollY: -window.scrollY, 
          windowWidth: document.documentElement.offsetWidth, 
          windowHeight: document.documentElement.offsetHeight, 
        });
      
        element.style.width = "100%";
        element.style.height = "100%";
      
        const data = canvas.toDataURL('image/jpg');
        const link = document.createElement('a');
      
        if (typeof link.download === 'string') {
          link.href = data;
          link.download = 'url_collection_certificate.jpg';
      
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          window.open(data);
        }
      };
    useEffect(() => {
        async function fetchTotalURLCount() {
            const { data: count } = await supabase.from("logs").select("*").eq("uid", uid).eq("uploaded", true);
            let sum;
            if (count) {
                sum = count.reduce((acc, curr) => {
                    return acc + curr.end - curr.start + 1
                }, 0)
            }
            setTotalURLCount(sum);
        }
        fetchTotalURLCount()
    }, [uid])
    return (
        <>
      <div className="w-full h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-10 text-center shadow-lg rounded-lg overflow-hidden" ref={printRef}>
        <div className="border-b-2 border-gray-300 dark:border-gray-700 pb-6">
          <h1 className="text-5xl font-bold text-white dark:text-gray-100">Certificate of Completion</h1>
          <p className="text-xl text-white dark:text-gray-400 mt-2">This is to certify that</p>
        </div>
        <div className="mt-10">
          <p className="text-4xl font-bold text-white dark:text-gray-100 mt-2">{name}</p>
          <p className="text-xl text-white dark:text-gray-400 mt-4">has successfully collected</p>
          <p className="text-4xl font-bold text-white dark:text-gray-100 mt-2 uppercase">{totalURLCount} URLs</p>
          <p className="text-xl text-white dark:text-gray-400 mt-4">for</p>
          <p className="text-4xl font-bold text-white dark:text-gray-100 mt-2 uppercase">{forWhat}</p>
        </div>
        <div className="flex justify-center items-center mt-10">
          <div className="border-b border-white dark:border-gray-400 w-1/2" />
          <div className="border-b border-white dark:border-gray-400 w-1/2" />
        </div>
        <p className="text-sm text-white dark:text-gray-400 mt-10">
        This certificate is purely for appreciation purposes and holds no official or legal significance.
        </p>
      </div>
      <Button type="button" onClick={handleDownloadImage} className="mt-4">
        Download Certificate
      </Button>
      </>
    )
  }
  
  
  