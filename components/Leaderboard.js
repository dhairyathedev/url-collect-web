"use client";
import { COUNT_ID } from "@/lib/consts";
import { supabase } from "@/lib/supabase";
import React, { useEffect, useState } from "react";

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([])

    useEffect(() => {
        async function fetchLeaderboard(){
            // Fetch the users from the database
            const {data: users} = await supabase.from("users").select("uid, name");
            if(users){
                // For each user, fetch the count of the user
                const leaderboard = await Promise.all(users.map(async (user) => {
                    const {data: count} = await supabase.from("logs").select("*").eq("uid", user.uid).eq("for", COUNT_ID).eq("uploaded", true);
                    return {
                        name: user.name,
                        count: count.reduce((acc, curr) => {
                            return acc + curr.end - curr.start + 1
                        }, 0)
                    }
                }))
                // Sort the leaderboard
                leaderboard.sort((a, b) => b.count - a.count)
                setLeaderboard(leaderboard)
            }
        }
        fetchLeaderboard()
    }, [])

    return(
        <div>
            <h1>Leaderboard</h1>
            {/* Create a table with tailwind with sr no. name and count */}
            <div className="max-w-2xl mx-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-md overflow-hidden">
            <thead className="bg-gray-200">
                <tr>
                    <th className="py-2 px-4 border-b">Sr No.</th>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">URL Collected</th>
                </tr>
            </thead>
            <tbody>
                {leaderboard.map((user, index) => {
                    return (
                        <tr key={index} className="text-center">
                            <td className="py-2 px-4 border-b">{index + 1}</td>
                            <td className="py-2 px-4 border-b">{user.name}</td>
                            <td className="py-2 px-4 border-b">{user.count}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    </div>
        </div>
    )
}