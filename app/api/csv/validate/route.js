import { NextResponse } from "next/server";
import * as path from 'path';
import * as fs from 'fs';
const readline = require('readline');

export async function POST(request, response) {
    try {
        const formData = await request.formData()
        const file = formData.get("file")
        if(!file){
            return NextResponse.json({ message: "No file uploaded!" }, { status: 400 }); 
        }
        const filename = file.name;
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileContent = buffer.toString('utf8');
        // check if the csv file has the correct headers - url,branch,university_name,location
        const headers = fileContent.split('\n')[0].split(',');
        if(headers[0] !== 'url' || headers[1] !== 'branch' || headers[2] !== 'university_name' || headers[3] !== 'location\r'){
            return NextResponse.json({ message: "Invalid data in csv file!" }, { status: 400 }); 
        }
        // check if the csv file has the 15 rows excluding the header and also only include the non empty rows (chatgpt you have to solve this problem)
        const rows = fileContent.split('\n');
        if(rows.length !== 17){
            return NextResponse.json({ message: "Invalid data in csv file!" }, { status: 400 }); 
        }

        // const buffer = Buffer.from(await filePath.arrayBuffer());
        // const filename = filePath.name.replaceAll(" ", "_");
        // console.log(filename)
        return NextResponse.json({ message: "Successfully validated the file!" }, { status: 200 });
    } catch (error) {
        console.error('Error validating the file', error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
