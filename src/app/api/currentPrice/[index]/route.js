import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;
const dbCollection = process.env.MONGODB_DB_COL2;

const client = new MongoClient(url);

async function connectToDatabase() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db(dbName);
}

export async function GET(request, context) {
  try {
    const params = context.params;
    const value = params.index;
    const db = await connectToDatabase();
    const collection = db.collection(dbCollection);

    // Find the latest document by 'currentDateTime'
    const findResult = await collection
      .find({ underlying: value })
      .sort({ currentDateTime: -1 })
      .limit(1)
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
