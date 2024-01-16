import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button'
import { DialogClose } from '@radix-ui/react-dialog'
import { ArrowUpFromLine, Loader } from 'lucide-react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function UploadCSVFile({uid, start, end}) {
    const [csvFile, setCSVFile] = useState();
    const [loading, setLoading] = useState(false);
    async function handleCSVFileUpload(){
        setLoading(true)
        try{
        const {data, error} = await supabase.storage.from("urls").upload(`public/output_${start}_${end}.csv`, csvFile, {
            cacheControl: '3600',
            upsert: false,
            onProgress: (event) => {
                console.log(event);
            },
        })
        if(data){
            setLoading(false)
            const {data: logDataUpdate, error: logErrorUpdate} = await supabase.from("logs").update({
                uploaded: true
            }).eq("start", start).eq("end", end).select()
            toast.success("Successfully uploaded the file!")
            window.location.reload()
        }else if(error){
            setLoading(false)
            console.log(error)
            if(error.statusCode === "409"){
                toast.error("Output for this range has already uploaded! If this issue persist contact admin")
            }
        }
    }catch(error){
        console.log(error)
        throw new error;
    }
    }

    return (
        <div className="my-4">
            <Dialog>
                <DialogTrigger>
                    <Button variant="secondary">Upload Output File</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload the output file</DialogTitle>
                        <DialogDescription>
                            The output file must be in the csv format. The output must be as per the instructed format.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="link" className="sr-only">
                                Choose File
                            </Label>
                            <Input
                                id="link"
                                type="file"
                                accept=".csv, application/vnd.ms-excel"
                                onChange={(e) => setCSVFile(e.target.files[0])}
                                required
                            />
                        </div>
                        <Button type="submit" size="sm" className="px-3" onClick={handleCSVFileUpload} disabled={loading}>
                            <span className="sr-only">Upload</span>
                            {
                                loading ? <Loader className="w-4 h-4 animate-spin" /> : <ArrowUpFromLine className="w-4 h-4" />
                            }
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    )
}
