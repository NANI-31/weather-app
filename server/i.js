const { MongoClient } = require("mongodb");

async function run() {
  const uri =
    "mongodb+srv://nani:nani@cluster0.nkgeayy.mongodb.net/?appName=Cluster0";

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas!");

    // Choose your database
    const db = client.db("<db_name>");

    // Choose collection
    const usersCollection = db.collection("users");

    // Example: Insert one document
    const result = await usersCollection.insertOne({
      name: "John Doe",
      age: 25,
      city: "Hyderabad",
    });
    console.log("Inserted:", result.insertedId);

    // Example: Find documents
    const users = await usersCollection.find().toArray();
    console.log("Users:", users);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
