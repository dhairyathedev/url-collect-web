"use client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { useState } from "react";
import { toast } from "sonner";
import CSVDownloader from "./CSVDownload";



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

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    })



    async function onSubmit(values) {
        const { data: user } = await supabase.from("users").select("*").eq("username", values.username).single()
        if (user && user.password === values.password) {
            setLoggedIn(true)
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
    if (loggedIn) return (
        <>
            <CSVDownloader csvData={csvData} start={count.last_collected_num + 1} end={count.last_collected_num + count.step} />
            <div className="space-y-4 mt-4">
                <h2 className="text-xl font-semibold">Danger Zone</h2>
                <Button variant="destructive" onClick={() => setLoggedIn(false)}>Logout</Button>
            </div>
        </>
    )
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
    )
}
