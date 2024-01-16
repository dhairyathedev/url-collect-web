import { NextResponse } from "next/server";
import fs from "fs";
import csv from "csv-parser";
export async function POST(request){
    const {file} = await request.body;
    if(!file){
        return NextResponse.json({message: "No file uploaded!"}, {status: 500})
    }
    // const urls = []
    // try{
    //     fs.createReadStream(file.path)   
    // }catch(error){
    //     console.log(error)
    //     throw new error;
    // }

}