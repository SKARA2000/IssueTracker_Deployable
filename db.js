require('dotenv').config();
const { MongoClient } = require('mongodb');

let db;

async function connectToDB() {
    const url = process.env.DB_URL || 'mongodb+srv://Skara007:Steve%40Jobs1@cluster0.e066q.mongodb.net/issuetracker?retryWrites=true&w=majority';
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log(`Connected to MongoDB at ${url}`);
    db = client.db();
}
  
async function getNextInSeq(name) {
    const result = await db.collection('counters').findOneAndUpdate(
      { _id: name },
      { $inc: { current: 1 } },
      { returnOriginal: false },
    );
    return result.value.current;
}

function getDB(){
    return db;
}

module.exports = { connectToDB, getNextInSeq, getDB };