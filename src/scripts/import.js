// src/scripts/import.js
const { MongoClient } = require('mongodb');

async function importData() {
  // Use your MongoDB URI directly (remove quotes if they're in the .env file)
  const vercelUri = "mongodb+srv://Vercel-Admin-myDB:oP15HnFBQD2c3z6V@mydb.iodfmbm.mongodb.net/?retryWrites=true&w=majority";
  const localUri = "mongodb://localhost:27017";

  console.log('Connecting to databases...');

  try {
    // Connect to both databases
    const vercelClient = new MongoClient(vercelUri);
    const localClient = new MongoClient(localUri);
    
    await vercelClient.connect();
    await localClient.connect();
    
    console.log('✅ Connected to both databases');
    
    const localDb = localClient.db('myDB'); // ← CHANGE THIS!
    const vercelDb = vercelClient.db();
    
    // Get all collection names
    const collections = await localDb.listCollections().toArray();
    console.log('Found collections:', collections.map(c => c.name));
    
    // Copy each collection
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`Importing ${collectionName}...`);
      
      const localData = await localDb.collection(collectionName).find({}).toArray();
      
      if (localData.length > 0) {
        // Clear existing data in Vercel collection
        await vercelDb.collection(collectionName).deleteMany({});
        // Insert new data
        await vercelDb.collection(collectionName).insertMany(localData);
        console.log(`✅ Imported ${localData.length} documents to ${collectionName}`);
      } else {
        console.log(`ℹ️  No data found in ${collectionName}`);
      }
    }
    
    console.log('🎉 All data imported successfully!');
  } catch (error) {
    console.error('❌ Import failed:', error.message);
  } finally {
    // Close connections
    if (localClient) await localClient.close();
    console.log('Connections closed');
  }
}

importData();