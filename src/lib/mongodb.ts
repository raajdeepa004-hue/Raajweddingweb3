import { MongoClient, Db, GridFSBucket } from 'mongodb';
import { defaultWeddingConfig, WeddingConfig } from '../config/wedding';

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export const getMongoUri = (): string => {
  return process.env.MONGODB_URI?.trim() || '';
};

const getDatabaseName = (): string => process.env.MONGODB_DB?.trim() || 'wedding_invitation';

let clientPromise: Promise<MongoClient> | null = null;

export const isMongoConfigured = (): boolean => {
  const uri = getMongoUri();
  return Boolean(uri && uri.trim().length > 0 && uri.startsWith('mongodb'));
};

export async function getMongoClient(): Promise<MongoClient> {
  const uri = getMongoUri();
  if (!isMongoConfigured()) {
    throw new Error('MONGODB_URI is not configured in environment variables.');
  }

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
      });
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    if (!clientPromise) {
      const client = new MongoClient(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
      });
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

export async function getDatabase(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(getDatabaseName());
}

export async function getGridFSBucket(): Promise<GridFSBucket> {
  const db = await getDatabase();
  return new GridFSBucket(db, { bucketName: 'wedding_media' });
}

/**
 * Retrieve current wedding config from MongoDB if available,
 * otherwise return local default configuration safely.
 */
export async function getWeddingConfig(): Promise<WeddingConfig> {
  if (!isMongoConfigured()) {
    return defaultWeddingConfig;
  }

  try {
    const db = await getDatabase();
    const collection = db.collection<WeddingConfig>('invitation_config');
    const doc = await collection.findOne({ _id: 'primary' as unknown as import('mongodb').ObjectId });
    if (doc) {
      // Exclude _id before returning and merge with defaults so new fields like moments are always preserved
      const { ...cleanConfig } = doc as unknown as WeddingConfig & { _id?: unknown };
      delete (cleanConfig as { _id?: unknown })._id;
      return {
        ...defaultWeddingConfig,
        ...cleanConfig,
        moments: (cleanConfig.moments && cleanConfig.moments.length > 0)
          ? cleanConfig.moments
          : defaultWeddingConfig.moments,
      };
    }
    return defaultWeddingConfig;
  } catch (err) {
    console.warn('[MongoDB] Failed to fetch wedding config, using local defaults:', (err as Error).message);
    return defaultWeddingConfig;
  }
}

/**
 * Save or update wedding config to MongoDB (protected by admin token)
 */
export async function saveWeddingConfig(config: WeddingConfig): Promise<boolean> {
  if (!isMongoConfigured()) {
    throw new Error('Cannot save config: MongoDB is not configured.');
  }

  const db = await getDatabase();
  const collection = db.collection<any>('invitation_config');
  await collection.updateOne(
    { _id: 'primary' },
    { $set: { ...config, updatedAt: new Date().toISOString() } },
    { upsert: true }
  );
  return true;
}
