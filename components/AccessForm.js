"use client";
import { zodResolver } from "@hookform/resolvers/zod"
import { set, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CSVDownloader from "./CSVDownload";
import UploadCSVFile from "./UploadCSVFile";
import Certificate from "./Certificate";



const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters long."
    }).max(50),
    password: z.string().min(1, {
        message: "Password must not be empty."
    }).max(50),
})



export default function AccessForm({ csvData, count }) {
    const [loggedIn, setLoggedIn] = useState(false)
    const [uid, setUid] = useState("")
    const [start, setStart] = useState(count.last_collected_num + 1)
    const [end, setEnd] = useState(count.last_collected_num + count.step)
    const [user ,setUser] = useState({})
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    })



    async function onSubmit(values) {
        const { data: user } = await supabase.from("users").select("*").eq("username", (values.username).toLowerCase()).single()
        if (user && user.password === values.password) {
            setLoggedIn(true)
            setUser(user)
            setUid(user.uid)
            toast.success("Logged in successfully.", {
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            })
        } else {
            toast.error("Invalid username or password.", {
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            })
        }
    }
    useEffect(() => {
        async function fetchUserCurrentRange(){
            const {data, error} = await supabase.from("logs").select("*").eq("uid", uid).eq("uploaded", false).order("end", {ascending: false}).single()
            if(data){
                setStart(data.start)
                setEnd(data.end)
            }
            
        }
        fetchUserCurrentRange()
    }, [uid])

    if (loggedIn) {
        if (count && count.end < end) {
            return (
                <>
                    <Certificate name={user.name} forWhat={count.name} uid={uid}/>
                </>
            );
        } else {
            return (
                <>
                    <CSVDownloader csvData={csvData} start={start} end={end} uid={uid} />
    
                    <UploadCSVFile start={start} end={end} uid={uid}/>
                    <div className="space-y-4 mt-4">
                        <h2 className="text-xl font-semibold">Danger Zone</h2>
                        <Button variant="destructive" onClick={() => window.location.reload()}>Logout</Button>
                    </div>
                </>
            );
        }
    } else {
        return (
            <>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="23dcs256" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter your username provided to you.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Secret Password" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter the password provided to you. Don&apos;t share this with anyone.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" size="sm">Login</Button>
                    </form>
                </Form>
            </>
        );
    }    
}
