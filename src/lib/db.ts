import clientPromise from './mongoDb';

export async function getDatabase() {
  const client = await clientPromise;
  return client.db(); // your database name
}

export async function getCollection(collectionName: string) {
  const db = await getDatabase();
  return db.collection(collectionName);
}