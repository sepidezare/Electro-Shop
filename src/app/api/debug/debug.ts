import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongoDb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const client = await clientPromise;
      const db = client.db('test-db'); // Replace with your DB name
      
      // Add a test document
      const result = await db.collection('test-collection').insertOne({
        message: 'Hello from Vercel!',
        timestamp: new Date(),
        randomId: Math.random().toString(36).substring(7)
      });

      res.status(200).json({ 
        success: true, 
        insertedId: result.insertedId,
        message: 'Data added successfully!' 
      });
    } catch (error) {
      console.error('MongoDB error:', error);
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}