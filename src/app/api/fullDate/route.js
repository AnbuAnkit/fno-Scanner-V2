import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;
const dbCollection = process.env.MONGODB_DB_COL1;

const client = new MongoClient(url);

async function connectToDatabase() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db(dbName);
}

export async function GET() {
  try {
    const db = await connectToDatabase();
    const collection = db.collection(dbCollection);
    const value = "expiryDate";

    // Find the latest document by 'currentDateTime'
    const findResult = await collection
      .find({ identifier: value })

      .toArray();

    // Check if a document was found
    if (findResult.length === 0) {
      return NextResponse.json({ error: "No document found" });
    }

    return NextResponse.json(findResult[0]);
  } catch (err) {
    console.error("Failed to connect to server", err);
    return NextResponse.json({ error: err.message });
  }
}
