const { MongoClient } = require('mongodb');
require('dotenv').config();

const url = process.env.DB_URL || 'mongodb+srv://Skara007:Steve%40Jobs1@cluster0.e066q.mongodb.net/issuetracker?retryWrites=true&w=majority';
// const url = "mongo://localhost/issuetracker"
function testWithCallbacks(callback) {
  console.log('\n--- testWithCallBacks ---\n');
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect((err, client) => {
    if (err) {
      callback(err);
      return;
    }
    console.log('Connected to MongoDB', url);

    const db = client.db();
    const collection = db.collection('employees');

    const employee = { id: 1, name: 'A. Callback', age: 23 };
    collection.insertOne(employee, (err, result) => {
      if (err) {
        client.close();
        callback(err);
        return;
      }
      console.log('Result of Insert:\n', result.insertedId);
      collection.find({ _id: result.insertedId }).toArray((err, docs) => {
        if (err) {
          client.close();
          callback(err);
          return;
        }
        console.log('result of find:\n', docs);
        client.close();
        callback(err);
      });
    });
  });
}

async function testWithAsync() {
  console.log('\n--- testWithAsync ---');
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    console.log('connected to MongoDB', url);
    const db = client.db();
    const collection = db.collection('employees');

    const sampleEmployee = { id: 2, name: 'B. Async', age: 16 };
    const result = await collection.insertOne(sampleEmployee);
    console.log('Result of insertion:\n', result.insertedId);
    const docs = await collection.find({ _id: result.insertedId }).toArray();
    console.log('Result of find:\n', docs);
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
}

testWithCallbacks((err) => {
  if (err) {
    console.log(err);
  }
});

testWithAsync();
