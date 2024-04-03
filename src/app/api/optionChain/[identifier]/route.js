// app/api/options/[identifier].js

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

export async function GET(request, context) {
  try {
    const params = context.params;
    const value = params.identifier;
    const db = await connectToDatabase();
    const collection = db.collection(dbCollection);

    const findResult = await collection.findOne({ identifier: value });

    return NextResponse.json(findResult || { error: "No document found" });
  } catch (err) {
    console.error("Failed to connect to server", err);
    return NextResponse.json({ error: err.message });
  }
}
