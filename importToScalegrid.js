const fs = require('fs');
const { MongoClient } = require('mongodb');

// Your ScaleGrid connection string
const remoteUri = 'mongodb://admin:Y6vp1tanDJfqxx9x@SG-horn-bowl-3248-77020.servers.mongodirector.com:27017/admin';

// Path to your local JSON file
const jsonFile = 'C:/Users/sepide/next-ecommerce/products.json';

async function importData() {
  const client = new MongoClient(remoteUri);

  try {
    await client.connect();
    const db = client.db('myDB'); // choose your database name

    const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

    if (Array.isArray(data)) {
      await db.collection('products').insertMany(data);
      console.log(`✅ Imported ${data.length} documents into 'products' collection`);
    } else {
      console.error('❌ JSON file must be an array of documents');
    }

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

importData();
