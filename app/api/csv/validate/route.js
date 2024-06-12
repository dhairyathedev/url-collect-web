import { NextResponse } from "next/server";
const readline = require('readline');

export async function POST(request) {
    try {
        const formData = await request.formData();
        const start = parseInt(formData.get('start'), 10);
        const end = parseInt(formData.get('end'), 10);
        console.log('start', start, 'end', end);
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ message: "No file uploaded!" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileContent = buffer.toString('utf8');

        // Check if the CSV file has the correct headers - id, url, branch, university_name, location
        const headers = fileContent.split('\n')[0].split(',');
        if (headers[0] !== 'id' || headers[1] !== 'url' || headers[2] !== 'branch' || headers[3] !== 'university_name' || headers[4] !== 'location\r') {
            return NextResponse.json({ message: "Invalid data in CSV file!" }, { status: 400 });
        }

        // Check if the CSV file has the correct number of rows excluding the header and include only non-empty rows
        const rows = fileContent.split('\n').slice(1); // Skip the header row
        const nonEmptyRows = rows.filter(row => row.trim().length > 0);

        if (nonEmptyRows.length > 15 || nonEmptyRows.length < 10) {
            return NextResponse.json({ message: "Invalid data in CSV file!" }, { status: 400 });
        }

        // Validate that the id column values are within the start and end range
        for (const row of nonEmptyRows) {
            const columns = row.split(',');
            const id = parseInt(columns[0], 10);

            if (isNaN(id) || id < start || id > end) {
                return NextResponse.json({ message: `Invalid id value: ${id} in CSV file. It should be between ${start} and ${end}.` }, { status: 400 });
            }
        }

        return NextResponse.json({ message: "Successfully validated the file!" }, { status: 200 });
    } catch (error) {
        console.error('Error validating the file', error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}